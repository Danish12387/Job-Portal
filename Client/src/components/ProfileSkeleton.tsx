import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ProfileSkeleton() {
    return (
        <div className="w-full bg-white container mx-auto mb-20">
            <div className="relative h-64 bg-gray-200">
                <div className="absolute -bottom-20 left-8">
                    <Skeleton className="w-40 h-40 rounded-full" />
                </div>
            </div>

            <div className="px-8">
                <div className="mt-24 mb-6 flex justify-between items-start">
                    <div>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-48 mb-1" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>

                <div className="border-b mb-8">
                    <nav className="flex gap-8" role="tablist">
                        {['Overview', 'About', 'Hobbies', 'Posts', 'Jobs', 'Events'].map((section) => (
                            <Skeleton key={section} className="h-8 w-20" />
                        ))}
                    </nav>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        <Card className="p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </Card>

                        <Card className="p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Skeleton key={i} className="h-6 w-20" />
                                ))}
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-2 w-3/4">
                                            <Skeleton className="h-5 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Card className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <div className="space-y-4">
                                {['Email', 'Languages', 'Pronouns', 'Nickname', 'Join Date', 'Work History', 'Education'].map((item) => (
                                    <div key={item}>
                                        <Skeleton className="h-3 w-24 mb-1" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}