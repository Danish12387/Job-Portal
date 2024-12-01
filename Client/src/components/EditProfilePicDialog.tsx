'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { setUser } from '@/lib/features/user/userSlice'
import { useAppDispatch } from '@/lib/hooks'
import { deleteProfilePic, editProfilePic, User } from '@/utils/apiHandlers'
import { getCroppedImg } from '@/utils/getCroppedImage'
import { Loader2, Trash2, Upload } from 'lucide-react'
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import toast from "react-hot-toast"

interface EditProfileDialogProps {
    isOwnProfile: boolean;
    userDetails: User | undefined;
    setUserDetails: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const EditProfilePicDialog: React.FC<EditProfileDialogProps> = ({ isOwnProfile, userDetails, setUserDetails }) => {
    const dispatch = useAppDispatch();
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [croppedArea, setCroppedArea] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);
            const imageDataUrl = await readFile(file)
            setImageSrc(imageDataUrl)
        }
    }

    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result as string))
            reader.readAsDataURL(file)
        })
    }

    const handleCropComplete = (croppedAreaPercentage: any, croppedAreaPixels: any) => {
        setCroppedArea(croppedAreaPixels)
    }

    const handleUpdateImage = async () => {
        try {
            setUpdateLoading(true);
            if (!imageSrc || !croppedArea) {
                throw new Error('Image source or cropped area is missing');
            }
            const croppedImageFile = await getCroppedImg(imageSrc, croppedArea, fileName);
            const formData = new FormData();
            formData.append('profilePicture', croppedImageFile);
            const res = await editProfilePic(formData);
            if (res && res.user) {
                setUserDetails(res.user);
                dispatch(setUser(res.user));
                setImageSrc(null);
                setIsOpen(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error cropping image:', error)
        } finally {
            setUpdateLoading(false);
        }
    }

    const handleDeleteImage = async () => {
        try {
            setDeleteLoading(true);
            if (!userDetails?.profilePicture) return toast.error('No banner to delete');
            const res = await deleteProfilePic(userDetails?.profilePicture);
            if (res && res.user) {
                setUserDetails(res.user);
                dispatch(setUser(res.user));
                setImageSrc(null);
                setIsOpen(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Avatar className="w-44 h-44 border-4 border-white rounded-full cursor-pointer">
                    <AvatarImage src={userDetails?.profilePicture || '/dummy-person.jpg'} />
                    <AvatarFallback>
                        <img src="/dummy-person.jpg" alt="Profile" />
                    </AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className={`max-w-[700px] max-h-[500px] h-[80%] border-none`}>
                <DialogHeader>
                    {isOwnProfile
                        ? (
                            <DialogTitle>Edit Profile Picture</DialogTitle>
                        )
                        :
                        <DialogTitle>{userDetails?.fullname}&apos;s Profile Picture</DialogTitle>
                    }
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 overflow-y-auto">
                    {imageSrc ? (
                        <div className="relative w-full h-80">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={handleCropComplete}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 h-80">
                            <img src={userDetails?.profilePicture || '/dummy-person.jpg'} alt="Profile" className="w-full h-full border-4 border-white rounded-lg pointer-events-none" />
                        </div>
                    )}
                </div>
                {
                    isOwnProfile &&
                    (
                        <DialogFooter>
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex justify-between items-center gap-5'>
                                    <label htmlFor="upload-photo" className="flex items-center gap-2 cursor-pointer">
                                        <Upload className="w-5 h-5" />
                                        <span>Upload Photo</span>
                                        <input
                                            type="file"
                                            id="upload-photo"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {userDetails?.profilePicture &&
                                        (
                                            deleteLoading ?
                                                <Button disabled variant='ghost'>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Deleting...
                                                </Button>
                                                :
                                                <Button onClick={handleDeleteImage} variant='ghost' className='text-red-500 hover:text-red-600 focus-visible:ring-transparent outline-none'>
                                                    <Trash2 className='text-red-500 mr-2 h-5' /> Delete Photo
                                                </Button>
                                        )
                                    }
                                </div>
                                {
                                    updateLoading ?
                                        <Button disabled>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Updating...
                                        </Button>
                                        :
                                        <Button onClick={handleUpdateImage} disabled={!imageSrc}>
                                            Update Photo
                                        </Button>
                                }
                            </div>
                        </DialogFooter>
                    )}
            </DialogContent>
        </Dialog>
    )
}

export default EditProfilePicDialog;