import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function JobCardSkeleton() {
    return (
        <Card className="rounded-md my-5">
            <CardContent className="flex items-start p-6">
                <Skeleton className="w-12 h-12 rounded-full mr-4 flex-shrink-0" />
                <div className="flex-grow w-full">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                    </div>
                    <div className="flex flex-wrap justify-between pr-5 mt-4">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}