"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, VideoIcon, FileTextIcon } from 'lucide-react'

export function PostCreator() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <Button variant="outline" className="w-full justify-start text-muted-foreground">
            Start a post, try writing with AI
          </Button>
        </div>
        <div className="mt-4 flex justify-between">
          <Button variant="ghost" size="sm" className="gap-2">
            <VideoIcon className="h-4 w-4" />
            Video
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Photo
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <FileTextIcon className="h-4 w-4" />
            Write article
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

