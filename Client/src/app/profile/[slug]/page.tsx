'use client'

import EditAboutDialog from "@/components/EditAboutDialog";
import EditAdditionalDetailsDialog from "@/components/EditAdditionalDetailsDialog";
import EditHobbiesDialog from "@/components/EditHobbiesDialog";
import EditProfileBannerDialog from "@/components/EditProfileBannerDialog";
import EditProfileDialog from "@/components/EditProfileDialog";
import EditProfilePicDialog from "@/components/EditProfilePicDialog";
import MainLayout from "@/components/MainLayout";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { getUserDetails, User } from "@/utils/apiHandlers";
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ExternalLink, MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Section = 'overview' | 'about' | 'hobbies' | 'posts' | 'jobs' | 'events';

export default function Component({ params }: { params: { slug: string } }) {
    const { user } = useAppSelector(state => state.user);
    const [userDetails, setUserDetails] = useState<User>();
    const [activeSection, setActiveSection] = useState<Section>('overview');
    const [loading, setLoading] = useState<boolean>(true);

    const isOwnProfile = user?._id === params.slug;

    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await getUserDetails(params.slug);
            if (response) {
                setUserDetails(response?.user);
            }
        }
        fetchUserDetails();
        setTimeout(() => {
            setLoading(false);
        }, 500);

    }, [params.slug]);

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <>
                        {renderAbout()}
                        {renderHobbies()}
                        {/* {renderPosts()} */}
                        {renderJobs()}
                    </>
                );
            case 'about':
                return renderAbout();
            case 'hobbies':
                return renderHobbies();
            // case 'posts':
            //     return renderPosts();
            case 'jobs':
                return renderJobs();
            case 'events':
                return <p>Events content coming soon...</p>;
            default:
                return null;
        }
    };

    const renderAbout = () => (
        <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">About</h2>
                {isOwnProfile &&
                    <EditAboutDialog userDetails={userDetails} userId={params.slug} setUserDetails={setUserDetails} />
                }
            </div>
            <div className="space-y-4 text-gray-600">
                {userDetails?.about ? (
                    <p>{userDetails.about}</p>
                ) : (
                    <p>{user?._id === params.slug ? "You haven't written about yourself yet." : "This user hasn't written about themselves yet."}</p>
                )}
            </div>
        </Card>
    );

    const renderHobbies = () => (
        <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Hobbies</h2>
                {isOwnProfile &&
                    <EditHobbiesDialog userDetails={userDetails} userId={params.slug} setUserDetails={setUserDetails} />
                }
            </div>
            <div className="flex flex-wrap gap-2">
                {userDetails?.hobbies?.length === 0 || !userDetails?.hobbies ? (
                    <p className="text-gray-600">You haven't added hobbies yet.</p>
                ) : (
                    userDetails?.hobbies?.map((hobby) => (
                        <Badge key={hobby} variant="secondary" className="bg-purple-50 hover:bg-purple-100 text-purple-900">
                            {hobby}
                        </Badge>
                    ))
                )}
            </div>
        </Card>
    );

    // const renderPosts = () => (
    //     <div className="space-y-4">
    //         <div className="flex justify-between items-center">
    //             <h2 className="text-lg font-semibold">Posts</h2>
    //             <Button variant="link" className="text-gray-500">
    //                 View All
    //             </Button>
    //         </div>
    //         {userDetails?.posts && userDetails?.posts.length > 0 ? (
    //             userDetails?.posts.map((post) => (
    //                 <Card key={post.title + post.author} className="p-4">
    //                     <div className="flex justify-between items-start">
    //                         <div>
    //                             <h3 className="font-medium">{post.title}</h3>
    //                             <p className="text-sm text-gray-500">{post.author}</p>
    //                             <p className="text-sm text-gray-500">{post.date}</p>
    //                         </div>
    //                         <Image src={post.image} alt="Post thumbnail" width={80} height={80} className="rounded-lg" />
    //                     </div>
    //                 </Card>
    //             ))
    //         ) : (
    //             <p className="text-gray-600">No posts yet.</p>
    //         )
    //         }
    //     </div>
    // );

    const renderJobs = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Jobs</h2>
                <Button variant="link" className="text-gray-500">
                    View All
                </Button>
            </div>
            {userDetails?.jobs && userDetails?.jobs.length > 0 ? (
                userDetails?.jobs.map((job) => (
                    <Card key={job.jobTitle + userDetails?.fullname} className="p-4 group">
                        <div className="flex justify-between items-center">
                            <div className="max-w-[75%]">
                                <h3 className="font-medium">{job.jobTitle}</h3>
                                <p className="text-sm text-gray-900">{userDetails?.fullname}</p>
                                <p className="text-sm text-gray-500 line-clamp-2">{job?.jobDescription}</p>
                                <p className="text-sm text-gray-500">
                                    {job?.createdAt
                                        ? `${formatDistanceToNowStrict(new Date(job.createdAt), { addSuffix: true })}, on ${format(new Date(job.createdAt), 'MM/dd/yyyy')}`
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                            <Link href={`/job-details/${job._id}`}>
                                <Button variant="ghost" className="relative opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center mr-5 w-[165px] text-primary hover:text-primary">See Details <MoveRight className="group-hover:translate-x-3 absolute right-6 top-[10px] h-5 text-primary transition duration-300" /></Button>
                            </Link>
                        </div>
                    </Card>
                ))
            ) : (
                <p className="text-gray-600">No jobs posted.</p>
            )
            }
        </div>
    );

    return (
        <MainLayout>
            {
                loading ?
                    <ProfileSkeleton />
                    :
                    (
                        <div className="w-full bg-white container mx-auto mb-20">
                            <div className="relative h-64 bg-[#e8f5e9]">
                                <EditProfileBannerDialog isOwnProfile={isOwnProfile} userDetails={userDetails} setUserDetails={setUserDetails} />
                                <div className="absolute -bottom-20 left-8">
                                    <EditProfilePicDialog isOwnProfile={isOwnProfile} userDetails={userDetails} setUserDetails={setUserDetails} />
                                </div>
                            </div>

                            <div className="px-8">
                                <div className="mt-24 mb-6 flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-semibold">{userDetails?.fullname}</h1>
                                        {userDetails?.headline && <p className="">{userDetails?.headline}</p>}
                                        <p className="text-gray-600 text-sm mt-1">{userDetails?.city}, {userDetails?.country}</p>
                                        {userDetails?.websiteLink && (
                                            <a href={userDetails?.websiteLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 w-auto hover:underline text-sm inline-flex items-center my-2">
                                                {userDetails?.linkText} <ExternalLink className="h-4 w-4 ml-2" />
                                            </a>
                                        )}
                                    </div>
                                    {
                                        isOwnProfile &&
                                        <EditProfileDialog userDetails={userDetails} userId={params.slug} setUserDetails={setUserDetails} />
                                    }
                                </div>

                                <div className="border-b mb-8">
                                    <nav className="flex gap-8" role="tablist">
                                        {(['overview', 'about', 'hobbies', 'posts', 'jobs', 'events'] as Section[]).map((section) => (
                                            <button
                                                key={section}
                                                onClick={() => setActiveSection(section)}
                                                className={`px-1 py-4 transition-transform hover:text-green-600 duration-300 ${activeSection === section ? 'text-green-600 border-b-2 scale-105 border-green-600' : 'text-gray-500'}`}
                                                role="tab"
                                                aria-selected={activeSection === section}
                                                aria-controls={`${section}-content`}
                                            >
                                                {section.charAt(0).toUpperCase() + section.slice(1)}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-8" role="tabpanel" aria-labelledby={`${activeSection}-tab`} id={`${activeSection}-content`}>
                                        {renderContent()}
                                    </div>

                                    <div className="space-y-8">
                                        <Card className="p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-lg font-semibold">Additional Details</h2>
                                                {isOwnProfile && <EditAdditionalDetailsDialog userDetails={userDetails} userId={params.slug} setUserDetails={setUserDetails} />}
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">EMAIL</p>
                                                    <p className="text-green-600">{userDetails?.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">LANGUAGES</p>
                                                    <p>
                                                        <span>{userDetails?.languages?.length === 0 || !userDetails?.languages ? "Not Provided" : userDetails?.languages?.join(', ')}</span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">PREFERRED GENDER PRONOUNS</p>
                                                    <p>{userDetails?.pronouns || "Not Provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">NICKNAME</p>
                                                    <p>{userDetails?.nickname || "No Nickname Provided"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">JOIN DATE</p>
                                                    <p className="text-green-600">
                                                        {userDetails?.createdAt
                                                            ? `${formatDistanceToNowStrict(new Date(userDetails.createdAt), { addSuffix: true })}, on ${format(new Date(userDetails.createdAt), 'MM/dd/yyyy')}`
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">WORK HISTORY</p>
                                                    <p>
                                                        <span className="text-green-600">{userDetails?.workHistory?.length === 0 || !userDetails?.workHistory ? "No Work History Provided" : userDetails?.workHistory?.join(', ')}</span>
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">EDUCATION</p>
                                                    <p className="text-green-600">{userDetails?.education || "No Education Provided"}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
            }
        </MainLayout>
    )
}