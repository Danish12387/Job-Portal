'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks"
import { Briefcase, MapPin } from "lucide-react"

export function UserProfile() {
    const { user } = useAppSelector(state => state.user);

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 pointer-events-none">
                        <AvatarImage src={user?.profilePicture || '/dummy-person.jpg'} alt="User" />
                        <AvatarFallback>
                            <img src="/dummy-person.jpg" alt="Profile" />
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-[17px] font-semibold">{user?.fullname}</h2>
                    <p className="text-sm text-muted-foreground">{user?.headline}</p>
                    <div className="mt-4 space-y-2 w-full">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4" />
                            <span>{user?.workHistory}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{user?.city}, {user?.country}</span>
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <div className="flex justify-between text-sm">
                            <span>Profile views</span>
                            <span className="font-semibold">1,234</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Post impressions</span>
                            <span className="font-semibold">5,678</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

