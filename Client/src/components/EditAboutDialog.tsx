import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { CircleMinus, Edit2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import toast from 'react-hot-toast';
import { editProfileAbout, User } from '@/utils/apiHandlers';
import { setUser } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Textarea } from './ui/textarea';

interface EditProfileDialogProps {
    userDetails: User | undefined;
    setUserDetails: React.Dispatch<React.SetStateAction<User | undefined>>;
    userId: string;
}

const EditAboutDialog: React.FC<EditProfileDialogProps> = ({ userDetails, userId, setUserDetails }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [about, setAbout] = useState<string | undefined>(userDetails?.about);
    const [initialForm, setInitialForm] = useState<string | undefined>(about);

    useEffect(() => {
        const isEditing = searchParams.get('edit') === 'about';
        setIsOpen(isEditing);
        if (!isEditing && isFormDirty()) {
            setShowWarning(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (userDetails) {
            const newAbout = userDetails?.about || '';
            setAbout(newAbout);
            setInitialForm(newAbout);
        }
    }, [userDetails]);

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setAbout(event.target.value);
    }
    const isFormDirty = () => {
        return about !== initialForm;
    };

    const openDialog = () => {
        router.push(`/profile/${userId}?edit=about`);
    };

    const closeDialog = () => {
        if (isFormDirty()) {
            setShowWarning(true);
        } else {
            router.push(`/profile/${userId}`);
        }
    };

    const handleDiscard = () => {
        setAbout(initialForm);
        setShowWarning(false);
        router.push(`/profile/${userId}`);
    };

    const handleKeepEditing = () => {
        setShowWarning(false);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!about) return toast.error('Fields cannot be empty.');
        try {
            setLoading(true);
            const res = await editProfileAbout(about);
            if (res && res.user) {
                setUserDetails(res.user);
                dispatch(setUser(res.user));
                setIsOpen(false);
                router.push(`/profile/${userId}`);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={openDialog} size="sm" variant="ghost" className="text-green-600">
                <Edit2 className="w-4 h-4" />
            </Button>
            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-[700px] max-h-[400px] h-[70%] border-none p-0">
                    <DialogHeader className='border-b w-full p-4 h-20'>
                        <DialogTitle>Edit Profile About</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='overflow-y-auto'>
                        <div className="grid gap-4 p-6">
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="name" className="font-semibold text-lg">
                                    About
                                </Label>
                                <Textarea id="name" value={about} onChange={handleInputChange} name="fullname" className="h-32" placeholder="Enter your about" />
                            </div>
                        </div>
                        <DialogFooter className='m-6'>
                            {
                                loading ?
                                    <Button disabled>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Saving
                                    </Button>
                                    :
                                    <Button type="submit">Save changes</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes in about. Are you sure you want to discard them?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleKeepEditing}>Keep editing</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDiscard}>Discard changes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default EditAboutDialog;