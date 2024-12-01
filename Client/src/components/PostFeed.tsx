"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MoreHorizontal, ThumbsUp, MessageSquare, Repeat2, Send } from 'lucide-react'

export function PostFeed() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center p-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1">
                        <div className="font-semibold">Jane Smith</div>
                        <div className="text-sm text-muted-foreground">Senior Developer at Tech Co</div>
                    </div>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="mb-4">
                        Excited to share that we&apos;ve just launched our new feature! 🚀
                        #TechNews #Innovation #Development
                    </p>
                    <div className="flex justify-between border-t pt-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            Like
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Repeat2 className="h-4 w-4" />
                            Repost
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Send className="h-4 w-4" />
                            Send
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

