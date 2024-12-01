'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks";
import GetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import Link from "next/link";

export function RecommendedUsers() {
    const { suggestedUsers } = useAppSelector(state => state.user);

    GetSuggestedUsers();

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Add to your feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {suggestedUsers?.map((user, index) => (
                    <div key={index} className="flex flex-col items-start gap-2">
                        <Link href={`/profile/${user._id}`} className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src={user?.profilePicture || '/dummy-person.jpg'} alt="User" />
                                <AvatarFallback>
                                    <img src="/dummy-person.jpg" alt="Profile" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold">{user.fullname}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {user?.workHistory}
                                </p>
                            </div>
                        </Link>
                        <Button variant="outline" size="sm" className="mt-2">
                            Follow
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

