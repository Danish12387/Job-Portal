'use client'

import React, { useState, KeyboardEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit2, Loader2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { User, editHobbies } from '@/utils/apiHandlers'
import { useAppDispatch } from '@/lib/hooks'
import { setUser } from '@/lib/features/user/userSlice'

interface EditHobbiesDialogProps {
    userDetails: User | undefined;
    setUserDetails: React.Dispatch<React.SetStateAction<User | undefined>>;
    userId: string;
}

export default function EditHobbiesDialog({ userDetails, setUserDetails, userId }: EditHobbiesDialogProps) {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [hobbies, setHobbies] = useState<string[] | undefined>(userDetails?.hobbies);
    const [newHobby, setNewHobby] = useState('');
    const [loading, setLoading] = useState(false);

    const [initialHobbies, setInitialHobbies] = useState<string[] | undefined>(hobbies);

    useEffect(() => {
        const isEditing = searchParams.get('edit') === 'hobbies'
        setIsOpen(isEditing)
        if (!isEditing && isFormDirty()) {
            setShowWarning(true)
        }
    }, [searchParams])

    useEffect(() => {
        if (userDetails) {
            const newHobbies = userDetails?.hobbies || [];
            setHobbies(newHobbies);
            setInitialHobbies(newHobbies);
        }
    }, [userDetails]);

    const isFormDirty = () => {
        return JSON.stringify(hobbies) !== JSON.stringify(initialHobbies)
    }

    const openDialog = () => {
        router.push(`/profile/${userId}?edit=hobbies`)
    }

    const closeDialog = () => {
        if (isFormDirty()) {
            setShowWarning(true)
        } else {
            router.push(`/profile/${userId}`)
        }
    }

    const handleDiscard = () => {
        setHobbies(initialHobbies)
        setShowWarning(false)
        router.push(`/profile/${userId}`)
    }

    const handleKeepEditing = () => {
        setShowWarning(false)
    }

    const addHobby = () => {
        if (hobbies === undefined) return;
        if (newHobby.trim() && !hobbies?.includes(newHobby.trim())) {
            setHobbies([...hobbies, newHobby.trim()])
            setNewHobby('')
        } else if (hobbies.includes(newHobby.trim())) {
            toast.error('This hobby already exists')
        }
    }

    const removeHobby = (hobby: string) => {
        setHobbies(hobbies?.filter(h => h !== hobby))
    }

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addHobby()
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (hobbies?.length === 0 || !hobbies) return toast.error('Fields cannot be empty.');
        try {
            setLoading(true);
            const res = await editHobbies(hobbies);
            if (res && res.user) {
                setUserDetails(res.user);
                dispatch(setUser(res.user));
                setIsOpen(false);
                router.push(`/profile/${userId}`);
            } else {
                throw new Error('Failed to update hobbies.');
            }
        } catch (error) {
            console.error('Error updating hobbies:', error);
            toast.error('Failed to update hobbies. Please try again.');
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
                <DialogContent className="max-w-[700px] max-h-[500px] h-[70%] border-none p-0">
                    <DialogHeader className='border-b w-full p-4 h-20'>
                        <DialogTitle>Edit Hobbies</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='overflow-y-auto'>
                        <div className="grid gap-4 p-6">
                            <div className="flex items-center">
                                <Input
                                    placeholder="Add a hobby"
                                    value={newHobby}
                                    onChange={(e) => setNewHobby(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className='rounded-r-none'
                                />
                                <Button onClick={addHobby} className='h-12 rounded-l-none'>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 h-[150px] overflow-y-auto p-2 border rounded-md">
                                {hobbies?.map((hobby) => (
                                    <Badge key={hobby} variant="secondary" className="bg-purple-50 text-purple-900 inline-flex h-8 items-center gap-1">
                                        {hobby}
                                        <button onClick={() => removeHobby(hobby)} className="text-purple-900 hover:text-purple-700">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
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
                                    <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                            }
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog >
            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes to your hobbies. Are you sure you want to discard them?
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