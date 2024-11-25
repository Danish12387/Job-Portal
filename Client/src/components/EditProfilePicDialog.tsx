'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Edit2, Loader2, Upload } from 'lucide-react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/getCroppedImage';
import { editProfilePic, User } from '@/utils/apiHandlers';
import { setUser } from '@/lib/features/user/userSlice'
import { useAppDispatch } from '@/lib/hooks'

interface EditProfileDialogProps {
    userDetails: User | undefined;
    setUserDetails: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const EditProfilePicDialog: React.FC<EditProfileDialogProps> = ({ userDetails, setUserDetails }) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
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
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Avatar className="w-32 h-32 border-4 border-white rounded-full cursor-pointer">
                    <AvatarImage src={userDetails?.profilePicture || '/dummy-person.jpg'} />
                    <AvatarFallback>
                        <img src="/dummy-person.jpg" alt="Profile" />
                    </AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className={`max-w-[700px] max-h-[500px] h-[80%] border-none`}>
                <DialogHeader>
                    <DialogTitle>Edit Profile Photo</DialogTitle>
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
                        <div className="flex flex-col items-center gap-2 h-64">
                            <img src={userDetails?.profilePicture || '/dummy-person.jpg'} alt="Profile" className="w-full h-full border-4 border-white rounded pointer-events-none" />
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
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {
                        loading ?
                            <Button disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Updating...
                            </Button>
                            :
                            <Button onClick={handleUpdateImage} disabled={!imageSrc}>
                                Update Image
                            </Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfilePicDialog;