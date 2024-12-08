'use client'
import MainLayout from "@/components/MainLayout";
import { PostCreator } from "@/components/PostCreator";
import { PostFeed } from "@/components/PostFeed";
import { RecommendedUsers } from "@/components/RecommendedUsers";
import { UserProfile } from "@/components/UserProfile";

export default function PostsPage() {

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
                        <div className="md:col-span-3">
                            <UserProfile />
                        </div>

                        <div className="md:col-span-4 space-y-4">
                            <PostCreator />
                            <PostFeed />
                        </div>

                        <div className="md:col-span-3">
                            <RecommendedUsers />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

