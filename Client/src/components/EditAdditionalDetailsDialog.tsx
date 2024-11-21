'use client'

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { editAdditionalDetails, User } from '@/utils/apiHandlers';
import { setUser } from '@/lib/features/user/userSlice';
import { useAppDispatch } from '@/lib/hooks';

export interface AdditionalDetailsState {
    languages: string;
    pronouns: string;
    nickname: string;
    workHistory: string;
    education: string;
}

interface EditAdditionalDetailsDialogProps {
    userDetails: User | undefined;
    setUserDetails: React.Dispatch<React.SetStateAction<User | undefined>>;
    userId: string;
}

const EditAdditionalDetailsDialog: React.FC<EditAdditionalDetailsDialogProps> = ({ userDetails, userId, setUserDetails }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [additionalDetailsForm, setAdditionalDetailsForm] = useState<AdditionalDetailsState>({
        languages: userDetails?.languages?.join(', ') || '',
        pronouns: userDetails?.pronouns || '',
        nickname: userDetails?.nickname || '',
        workHistory: userDetails?.workHistory?.join(', ') || '',
        education: userDetails?.education || '',
    });
    const [initialForm, setInitialForm] = useState<AdditionalDetailsState>(additionalDetailsForm);

    useEffect(() => {
        const isEditing = searchParams.get('edit') === 'additional-details';
        setIsOpen(isEditing);
        if (!isEditing && isFormDirty()) {
            setShowWarning(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (userDetails) {
            const newForm = {
                email: userDetails.email || '',
                languages: userDetails.languages?.join(', ') || '',
                pronouns: userDetails.pronouns || '',
                nickname: userDetails.nickname || '',
                workHistory: userDetails.workHistory?.join(', ') || '',
                education: userDetails.education || '',
            };
            setAdditionalDetailsForm(newForm);
            setInitialForm(newForm);
        }
    }, [userDetails]);

    const isFormDirty = () => {
        return JSON.stringify(additionalDetailsForm) !== JSON.stringify(initialForm);
    };

    const isFormEmpty = () => {
        return Object.values(additionalDetailsForm).every(value => value === '');
    };

    const openDialog = () => {
        router.push(`/profile/${userId}?edit=additional-details`);
    };

    const closeDialog = () => {
        if (isFormDirty()) {
            setShowWarning(true);
        } else {
            router.push(`/profile/${userId}`);
        }
    };

    const handleDiscard = () => {
        setAdditionalDetailsForm(initialForm);
        setShowWarning(false);
        router.push(`/profile/${userId}`);
    };

    const handleKeepEditing = () => {
        setShowWarning(false);
    };

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdditionalDetailsForm({ ...additionalDetailsForm, [name]: value });
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!isFormDirty()) {
            toast('No changes to save.');
            return;
        }

        try {
            setLoading(true);
            const res = await editAdditionalDetails(additionalDetailsForm);
            if (res && res.user) {
                setUserDetails(res.user);
                dispatch(setUser(res.user));
                setIsOpen(false);
                router.push(`/profile/${userId}`);
            } else {
                throw new Error('Failed to update additional details');
            }
        } catch (error) {
            console.error('Error updating additional details:', error);
            toast.error('Failed to update additional details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={openDialog} variant="ghost" size="icon" className="text-green-600">
                <Edit2 className="w-4 h-4" />
            </Button>
            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-[700px] max-h-[500px] h-[80%] border-none p-0">
                    <DialogHeader className='border-b w-full p-4 h-20'>
                        <DialogTitle>Edit Additional Details</DialogTitle>
                        <DialogDescription>
                            Update your additional details here. These fields are optional.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='overflow-y-auto'>
                        <div className="grid gap-4 p-6">
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="email" className="text-gray-700">
                                    Email
                                </Label>
                                <Input readOnly value={userDetails?.email} id="email" className="col-span-3 text-gray-600" placeholder="Enter your email" />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="languages" className="text-gray-700">
                                    Languages
                                </Label>
                                <Input id="languages" onChange={changeEventHandler} value={additionalDetailsForm.languages} name="languages" className="col-span-3" placeholder="Enter languages (comma-separated)" />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="pronouns" className="text-gray-700">
                                    Pronouns
                                </Label>
                                <Input id="pronouns" onChange={changeEventHandler} value={additionalDetailsForm.pronouns} name="pronouns" className="col-span-3" placeholder="Enter your pronouns" />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="nickname" className="text-gray-700">
                                    Nickname
                                </Label>
                                <Input id="nickname" onChange={changeEventHandler} value={additionalDetailsForm.nickname} name="nickname" className="col-span-3" placeholder="Enter your nickname" />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="workHistory" className="text-gray-700">
                                    Work History
                                </Label>
                                <Input id="workHistory" onChange={changeEventHandler} value={additionalDetailsForm.workHistory} name="workHistory" className="col-span-3" placeholder="Enter work history (comma-separated)" />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="education" className="text-gray-700">
                                    Education
                                </Label>
                                <Input id="education" onChange={changeEventHandler} value={additionalDetailsForm.education} name="education" className="col-span-3" placeholder="Enter your education" />
                            </div>
                        </div>
                        <DialogFooter className='m-6'>
                            {loading ? (
                                <Button disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Saving
                                </Button>
                            ) : (
                                <Button type="submit" disabled={!isFormDirty() || isFormEmpty()}>
                                    Save changes
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes to your additional details. Are you sure you want to discard them?
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

export default EditAdditionalDetailsDialog;