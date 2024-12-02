"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, VideoIcon, FileTextIcon } from 'lucide-react'
import { useAppSelector } from "@/lib/hooks"
import CreatePost from "./CreatePost"

export function PostCreator() {
  const { user } = useAppSelector(state => state.user);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="pointer-events-none">
            <AvatarImage src={user?.profilePicture || '/dummy-person.jpg'} alt="User" />
            <AvatarFallback>
              <img src="/dummy-person.jpg" alt="Profile" />
            </AvatarFallback>
          </Avatar>
          <CreatePost />
        </div>
        <div className="mt-4 flex justify-around">
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

