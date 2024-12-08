"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks";
import { likeHandler, Post } from "@/utils/apiHandlers";
import { MessageSquare, MoreHorizontal, ThumbsUp } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

const PostComponent = ({ post }: { post: Post }) => {
    const { user } = useAppSelector(state => state.user);
    const [seeMore, setSeeMore] = useState<boolean>(false);
    const isLiked = post.likes.some(like => like.toString() === user?._id.toString());
    const [isLikedState, setIsLikedState] = useState<boolean>(isLiked);

    const postlikeHndler = async (id: string) => {
        setIsLikedState(!isLikedState);
        likeHandler(id);
    }

    return (
        <div className="my-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between p-4">
                    <Link href={`/profile/${post?.author?._id}`} className="inline-flex flex-row items-center">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={post?.author?.profilePicture || '/dummy-person.jpg'} alt="User" />
                            <AvatarFallback>
                                <img src="/dummy-person.jpg" alt="Profile" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 flex-1">
                            <div className="font-semibold">{post?.author?.fullname}</div>
                            <div className="text-sm text-muted-foreground">{post?.author?.headline}</div>
                        </div>
                    </Link>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <p className={seeMore ? `line-clamp-none` : `line-clamp-3`}>
                                {post?.caption}
                            </p>
                            {
                                post?.caption.length > 200 && (
                                    <p className="text-sm text-blue-700 cursor-pointer hover:underline inline" onClick={() => setSeeMore(!seeMore)}>{seeMore ? 'See less' : 'See more'}</p>
                                )
                            }
                        </div>
                        {
                            post?.image && (
                                <div className="h-full flex items-center justify-center my-4 bg-gray-200">
                                    <img src={post?.image} alt="Profile" className="w-auto h-auto pointer-events-none max-h-[500px]" />
                                </div>
                            )
                        }
                    </div>
                    <div className="flex justify-around border-t pt-4">
                        {
                            isLikedState ?
                                (

                                    <Button onClick={() => postlikeHndler(post?._id)} variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary w-24">
                                        <ThumbsUp className="h-4 w-4" />
                                        Liked
                                    </Button>
                                )
                                :
                                (
                                    <Button onClick={() => postlikeHndler(post?._id)} variant="ghost" size="sm" className="gap-2 w-24">
                                        <ThumbsUp className="h-4 w-4" />
                                        Like
                                    </Button>
                                )
                        }
                        <Button variant="ghost" size="sm" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Comment
                        </Button>
                        {/* <Button variant="ghost" size="sm" className="gap-2">
                    <Repeat2 className="h-4 w-4" />
                    Repost
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Send className="h-4 w-4" />
                    Send
                </Button> */}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PostComponent;