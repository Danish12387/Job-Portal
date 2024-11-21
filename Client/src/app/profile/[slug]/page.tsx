'use client'
import Link from "next/link"
import Image from "next/image"
import { Edit2, Plus, Bookmark, ExternalLink } from "lucide-react"
import { formatDistanceToNowStrict, format } from 'date-fns';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import MainLayout from "@/components/MainLayout";
import { useEffect, useState } from "react"
import { getUserDetails, User } from "@/utils/apiHandlers"
import EditProfileDialog from "@/components/EditProfileDialog";
import EditAboutDialog from "@/components/EditAboutDialog";

export default function Component({ params }: { params: { slug: string } }) {
    const [userDetails, setUserDetails] = useState<User>();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await getUserDetails(params.slug);
            if (response) {
                setUserDetails(response?.user);
            }
        }
        fetchUserDetails();
    }, []);

    return (
        <MainLayout>
            <div className="w-full bg-white container mx-auto">
                <div className="relative h-48 bg-[#e8f5e9]">
                    <Image
                        src={'/dummy-banner.jpg'}
                        alt="Profile background"
                        width={800}
                        height={200}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute -bottom-16 left-8">
                        <Avatar className="w-32 h-32 border-4 border-white rounded-full">
                            <AvatarImage src={''} />
                            <AvatarFallback><img src="/dummy-person.jpg" /></AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="px-8">
                    <div className="mt-20 mb-6 flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-semibold">{userDetails?.fullname}</h1>
                            {userDetails?.headline && <p className="">{userDetails?.headline}</p>}
                            <p className="text-gray-600 text-sm mt-1">{userDetails?.city}, {userDetails?.country}</p>
                            {userDetails?.websiteLink && <a href={userDetails?.websiteLink} target="_blank" className="text-blue-700 w-auto hover:underline text-sm inline-flex items-center my-2">{userDetails?.linkText} <ExternalLink className="h-4 w-4 ml-2" /></a>}
                        </div>
                        <EditProfileDialog userDetails={userDetails} userId={params.slug} setUserDetails={setUserDetails} />
                    </div>

                    <div className="flex gap-4 mb-6">
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                            <img src="/placeholder.svg?height=24&width=24" alt="Social 1" className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                            <img src="/placeholder.svg?height=24&width=24" alt="Social 2" className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                            <img src="/placeholder.svg?height=24&width=24" alt="Social 3" className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                            <img src="/placeholder.svg?height=24&width=24" alt="Social 4" className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-md">
                            <img src="/placeholder.svg?height=24&width=24" alt="Social 5" className="w-6 h-6" />
                        </button>
                        <button className="ml-auto p-2 hover:bg-gray-100 rounded-md">
                            <Bookmark className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="border-b mb-8">
                        <nav className="flex gap-8">
                            <button className="px-1 py-4 text-green-600 border-b-2 border-green-600">Overview</button>
                            <button className="px-1 py-4 text-gray-500">Groups</button>
                            <button className="px-1 py-4 text-gray-500">Posts</button>
                            <button className="px-1 py-4 text-gray-500">Pages</button>
                            <button className="px-1 py-4 text-gray-500">Events</button>
                            <button className="px-1 py-4 text-gray-500">More</button>
                        </nav>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        <div className="col-span-2 space-y-8">
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">About</h2>
                                    <EditAboutDialog userDetails={userDetails} userId={params.slug} setUserDetails={setUserDetails} />
                                </div>
                                <div className="space-y-4 text-gray-600">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                                </div>
                            </Card>

                            {/* Ask Me About */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold">Ask Me About</h2>
                                        <span className="text-gray-400 text-sm">8</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-green-600">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { title: "A Very Long Example Text Here", count: 42 },
                                        { title: "A Very Long Example", count: 1 },
                                        { title: "Example", count: 132 },
                                        { title: "Human Resources", count: 24 },
                                        { title: "Medium Length", count: 51 },
                                        { title: "Last Test", count: 3 },
                                        { title: "Analytics", count: 4 },
                                        { title: "Interaction Design", count: 4 },
                                        { title: "Example", count: 23 },
                                        { title: "Interface Design", count: 45 },
                                    ].map((item) => (
                                        <div key={item.title} className="flex items-center gap-2 text-sm">
                                            <Plus className="w-4 h-4 text-green-600" />
                                            <span>{item.title}</span>
                                            <span className="text-gray-400">• {item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Hobbies</h2>
                                    <Button variant="ghost" size="icon" className="text-green-600">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Dogs",
                                        "Football",
                                        "Basketball",
                                        "The Witcher",
                                        "Ice Skating",
                                        "Travelling",
                                        "Tetris",
                                        "Rock Climbing",
                                        "Donuts",
                                        "Auto Detailing",
                                        "Table Tennis",
                                    ].map((hobby) => (
                                        <Badge key={hobby} variant="secondary" className="bg-purple-50 hover:bg-purple-100 text-purple-900">
                                            {hobby}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">Posts</h2>
                                    <Button variant="link" className="text-gray-500">
                                        View All
                                    </Button>
                                </div>
                                {[
                                    {
                                        title: "SpotMe $10 Evergreen Referral Incentive is Live!",
                                        author: "Jimmie Harrison",
                                        date: "Joined on February 1, 2021",
                                        image: "/placeholder.svg?height=80&width=80",
                                    },
                                    {
                                        title: "SpotMe $10 Evergreen Referral Incentive is Live!",
                                        author: "Justin Philips",
                                        date: "Joined on February 1, 2021",
                                        image: "/placeholder.svg?height=80&width=80",
                                    },
                                    {
                                        title: "SpotMe $10 Evergreen Referral Incentive is Live!",
                                        author: "Abram Calzoni",
                                        date: "Joined on February 1, 2021",
                                        image: "/placeholder.svg?height=80&width=80",
                                    },
                                ].map((post) => (
                                    <Card key={post.title + post.author} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{post.title}</h3>
                                                <p className="text-sm text-gray-500">{post.author}</p>
                                                <p className="text-sm text-gray-500">{post.date}</p>
                                            </div>
                                            <Image src={post.image} alt="Post thumbnail" width={80} height={80} className="rounded-lg" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">Additional Details</h2>
                                    <Button variant="ghost" size="icon" className="text-green-600">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">EMAIL</p>
                                        <p className="text-green-600">ymag.certic@company.com</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">LANGUAGES</p>
                                        <p>
                                            <span className="text-green-600">English</span>, <span className="text-green-600">Spanish</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">PREFERRED GENDER PRONOUNCE</p>
                                        <p>He / Him / His</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">NICKNAME</p>
                                        <p>Costa</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">JOIN DATE</p>
                                        <p>{userDetails?.createdAt
                                            ? formatDistanceToNowStrict(new Date(userDetails.createdAt), { addSuffix: true })
                                            : 'N/A'}
                                            , on {userDetails?.createdAt
                                                ? format(new Date(userDetails.createdAt), 'MM/dd/yyyy') : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">WORK HISTORY</p>
                                        <p>
                                            <span className="text-green-600">Petrova.ai</span>,{" "}
                                            <span className="text-green-600">Snap Inc.</span>,{" "}
                                            <span className="text-green-600">Pinterest</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">EDUCATION</p>
                                        <p className="text-green-600">Stanford University</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}