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
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LocationSelector } from './LocationSelector';
import { ProfileEditState, userProfileEdit } from '@/schema/updateProfile';
import toast from 'react-hot-toast';
import { editProfile, User } from '@/utils/apiHandlers';
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
    const [country, setCountry] = useState<string>(userDetails?.country || '');
    const [errors, setErrors] = useState<Partial<ProfileEditState>>({});
    const [profileForm, setProfileForm] = useState<ProfileEditState>({
        fullname: userDetails?.fullname || '',
        headline: userDetails?.headline || '',
        country: userDetails?.country || '',
        city: userDetails?.city || '',
        websiteLink: userDetails?.websiteLink || '',
        linkText: userDetails?.linkText || ''
    });
    const [initialForm, setInitialForm] = useState<ProfileEditState>(profileForm);

    useEffect(() => {
        const isEditing = searchParams.get('edit') === 'profile';
        setIsOpen(isEditing);
        if (!isEditing && isFormDirty()) {
            setShowWarning(true);
        }
    }, [searchParams]);

    useEffect(() => {
        if (userDetails) {
            const newForm = {
                fullname: userDetails.fullname || '',
                headline: userDetails.headline || '',
                country: userDetails.country || '',
                city: userDetails.city || '',
                websiteLink: userDetails.websiteLink || '',
                linkText: userDetails.linkText || ''
            };
            setProfileForm(newForm);
            setInitialForm(newForm);
            setCountry(userDetails.country || '');
        }
    }, [userDetails]);

    const isFormDirty = () => {
        return JSON.stringify(profileForm) !== JSON.stringify(initialForm);
    };

    const openDialog = () => {
        router.push(`/profile/${userId}?edit=profile`);
    };

    const closeDialog = () => {
        if (isFormDirty()) {
            setShowWarning(true);
        } else {
            router.push(`/profile/${userId}`);
        }
    };

    const handleDiscard = () => {
        setProfileForm(initialForm);
        setShowWarning(false);
        router.push(`/profile/${userId}`);
    };

    const handleKeepEditing = () => {
        setShowWarning(false);
    };

    useEffect(() => {
        if (country) {
            setProfileForm((prevInput) => ({
                ...prevInput,
                country: country,
            }));

            setErrors((prevErrors: Partial<ProfileEditState>) => {
                const newErrors = { ...prevErrors };
                delete newErrors.country;
                return newErrors;
            })
        }
    }, [country])

    const errorHandler = (name: string, value: string): void => {
        setErrors((prevErrors: Partial<ProfileEditState>) => {
            const newErrors = { ...prevErrors };

            if (name === "fullname" && value.length >= 1) {
                delete newErrors.fullname;
            } else if (name === "headline" && value.length >= 1) {
                delete newErrors.headline;
            } else if (name === "city" && value.length >= 1) {
                delete newErrors.city;
            } else if (name === "websiteLink" && value.length >= 1) {
                delete newErrors.websiteLink;
            } else if (name === "linkText" && value.length >= 1) {
                delete newErrors.linkText;
            }
            return newErrors;
        });
    }

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileForm({ ...profileForm, [name]: value });
        errorHandler(name, value);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const inputResult = userProfileEdit.safeParse(profileForm);
        if (!inputResult.success) {
            const fieldErrors = inputResult.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<ProfileEditState>);
            toast.error('All required fields must be filled.');
            return;
        }

        try {
            setLoading(true);
            const res = await editProfile(profileForm);
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
            <Button onClick={openDialog} size="sm" variant="outline" className="text-green-600 border-green-600">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
            </Button>
            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-[700px] max-h-[500px] h-[80%] border-none p-0">
                    <DialogHeader className='border-b w-full p-4 h-20'>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className='overflow-y-auto'>
                        <div className="grid gap-4 p-6">
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="name" className="text-gray-700">
                                    Name
                                </Label>
                                <Textarea id="name" onChange={ } value={profileForm.fullname} name="fullname" className="col-span-3" placeholder="Full name" />
                                {errors.fullname && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.fullname}</span>
                                )}
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="title" className="text-gray-700">
                                    Headline
                                </Label>
                                <Input id="title" onChange={changeEventHandler} value={profileForm.headline} name="headline" className="col-span-3" placeholder="Enter your profile title" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col justify-between gap-2 w-2/4">
                                    <Label htmlFor="location-country" className="w-[30%] text-gray-700">
                                        Location
                                    </Label>
                                    <LocationSelector value={country} setValue={setCountry} />
                                    {errors.country && (
                                        <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.country}</span>
                                    )}
                                </div>
                                <div className="flex flex-col justify-between gap-2 w-2/4">
                                    <Label htmlFor="location-city" className="text-gray-700">
                                        City
                                    </Label>
                                    <Input id="location-city" onChange={changeEventHandler} value={profileForm.city} name="city" className="col-span-3" placeholder="Enter your city name" />
                                    {errors.city && (
                                        <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.city}</span>
                                    )}
                                </div>
                            </div>
                            <h1 className='font-semibold text-[20px]'>Website</h1>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="website-link" className="text-gray-700">
                                    Link
                                </Label>
                                <Input id="website-link" onChange={changeEventHandler} value={profileForm.websiteLink} name="websiteLink" className="col-span-3" placeholder="Enter your website link" />
                            </div>
                            <div className="flex flex-col justify-between gap-2">
                                <Label htmlFor="website-text" className="text-gray-700">
                                    Link text
                                </Label>
                                <Input id="website-text" onChange={changeEventHandler} value={profileForm.linkText} name="linkText" className="col-span-3" placeholder="Enter text for website link" />
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
                            You have unsaved changes. Are you sure you want to discard them?
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