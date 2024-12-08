'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import React, { useEffect, useState } from 'react'
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { FileTextIcon, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { readFile } from "@/lib/utils";
import { createPost } from "@/utils/apiHandlers";

interface Post {
    caption: string;
    image: File | null;
}

const CreatePost = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState(false);
    const [input, setInput] = useState<Post>({
        caption: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState("");
    const [initialForm, setInitialForm] = useState<Post>(input);

    useEffect(() => {
        const isEditing = searchParams.get('create') === 'post';
        setIsOpen(isEditing);
        if (!isEditing && isFormDirty()) {
            setShowWarning(true);
        }
    }, [searchParams]);

    useEffect(() => {
        setInitialForm(input);
    }, []);

    useEffect(() => {
        if (!input.image && !input.caption) {
            setInput(initialForm);
            setImagePreview('');
        }
    }, [input]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e?.target?.files && e.target?.files?.length > 0) {
            const file = e?.target?.files[0];
            setInput({ ...input, image: file });
            const imageDataUrl = await readFile(file)
            setImagePreview(imageDataUrl);
        }
    }

    const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.name === 'caption') {
            setInput({ ...input, caption: e.target.value });
        }
    }

    const isFormDirty = () => {
        return input !== initialForm;
    };

    const openDialog = () => {
        router.push(`/feed?create=post`);
    };

    const closeDialog = () => {
        if (isFormDirty()) {
            setShowWarning(true);
        } else {
            router.push(`/feed`);
        }
    };

    const handleDiscard = () => {
        setInput(initialForm);
        setShowWarning(false);
        router.push(`/feed`);
    };

    const handleKeepEditing = () => {
        setShowWarning(false);
    };

    const handleCreatePost = async () => {
        try {
            setLoading(true);
            if (!input.image && !input.caption) {
                throw new Error('Post cannot be empty');
            }

            const res = await createPost(input);
            if (res) {
                setInput(initialForm);
                setImagePreview('');
                setIsOpen(false);
                router.push(`/feed`);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Something went wrong');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="w-full">
                <Button onClick={openDialog} variant="outline" className="w-full justify-start text-muted-foreground active:scale-100">
                    Start a post
                </Button>
                <div className="mt-4 flex justify-around">
                    <Button onClick={openDialog} variant="ghost" size="sm" className="gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Photo
                    </Button>
                    <Button onClick={openDialog} variant="ghost" size="sm" className="gap-2">
                        <FileTextIcon className="h-4 w-4" />
                        Write article
                    </Button>
                </div>
            </div>
            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-[700px] max-h-[600px] h-[80%] border-none p-0 flex flex-col">
                    <DialogHeader className='border-b w-full p-4 h-20'>
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription>
                            Click post when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='overflow-y-auto h-full'>
                        <div className={`flex flex-col gap-4 px-6 h-full ${imagePreview ? 'justify-normal' : 'justify-between'}`}>
                            <div className="flex flex-col justify-start gap-2">
                                <Label htmlFor="name" className="font-semibold text-lg">
                                    Caption
                                </Label>
                                <Textarea id="name" value={input.caption} onChange={handleInputChange} name="caption" className="h-32 border-none" placeholder="Enter caption for your post" />
                            </div>
                            <DialogFooter>
                                <div className="flex flex-col items-center gap-10 pb-6 w-full">
                                    {
                                        imagePreview &&
                                        (
                                            <div className="flex w-full min-h-96 justify-center relative bg-gray-300 max-h-[500px]">
                                                <X className="absolute bg-gray-200 hover:bg-gray-300 transition p-2 h-10 rounded-full w-10 top-2 right-2 cursor-pointer" onClick={() => { setInput({ ...input, image: null }); setImagePreview('') }} />
                                                <div className="my-auto h-full flex items-center">
                                                    <img src={imagePreview} alt="Profile" className="w-full h-auto rounded-lg pointer-events-none max-h-[500px]" />
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className='flex justify-between items-center w-full'>
                                        <div className='flex justify-between items-center gap-5'>
                                            <label htmlFor="upload-photo" className="flex items-center gap-2 cursor-pointer hover:text-primary transition duration-300">
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
                                        {
                                            loading ?
                                                <Button disabled>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Creating...
                                                </Button>
                                                :
                                                <Button disabled={!isFormDirty()} onClick={handleCreatePost}>
                                                    Create Post
                                                </Button>
                                        }
                                    </div>
                                </div>
                            </DialogFooter>
                        </div>
                    </div>
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

export default CreatePost;