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
import { Loader2, Upload, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { readFile } from "@/lib/utils";

interface Post {
    caption: string;
    image: string;
}

const CreatePost = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState(false);
    const [input, setInput] = useState<Post>({
        caption: '',
        image: '',
    });
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e?.target?.files && e.target?.files?.length > 0) {
            const file = e?.target?.files[0];
            const imageDataUrl = await readFile(file)
            setInput({ ...input, image: imageDataUrl });
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
        router.push(`/posts?create=post`);
    };

    const closeDialog = () => {
        if (isFormDirty()) {
            setShowWarning(true);
        } else {
            router.push(`/posts`);
        }
    };

    const handleDiscard = () => {
        setInput(initialForm);
        setShowWarning(false);
        router.push(`/posts`);
    };

    const handleKeepEditing = () => {
        setShowWarning(false);
    };

    return (
        <>
            <Button onClick={openDialog} variant="outline" className="w-full justify-start text-muted-foreground active:scale-100">
                Start a post
            </Button>
            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-[700px] max-h-[600px] h-[80%] border-none p-0 flex flex-col">
                    <DialogHeader className='border-b w-full p-4 h-20'>
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription>
                            Click post when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='overflow-y-auto h-full'>
                        <div className={`flex flex-col gap-4 px-6 h-full ${input.image ? 'justify-normal pb-0' : 'justify-between pb-6'}`}>
                            <div className="flex flex-col justify-start gap-2">
                                <Label htmlFor="name" className="font-semibold text-lg">
                                    Caption
                                </Label>
                                <Textarea id="name" value={input.caption} onChange={handleInputChange} name="caption" className="h-32 border-none" placeholder="Enter caption for your post" />
                            </div>
                            <DialogFooter>
                                {
                                    input.image ?
                                        (
                                            <div className="flex w-full items-center justify-center gap-2 relative mb-6">
                                                <X className="absolute bg-gray-200 hover:bg-gray-300 transition p-2 h-10 rounded-full w-10 top-2 right-2 cursor-pointer" onClick={() => setInput({ ...input, image: '' })} />
                                                <div className="my-auto h-80">
                                                    <img src={input.image} alt="Profile" className="w-full h-auto rounded-lg pointer-events-none" />
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
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
                                                </div>
                                                {
                                                    loading ?
                                                        <Button disabled>
                                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                            Posting...
                                                        </Button>
                                                        :
                                                        <Button disabled={!isFormDirty()}>
                                                            Create Post
                                                        </Button>
                                                }
                                            </div>
                                        )
                                }
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