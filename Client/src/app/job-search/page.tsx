'use client'
import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Briefcase } from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import { useAppSelector } from '@/lib/hooks';
import { formatDistanceToNowStrict } from 'date-fns';

export default function JobSearchPage() {
    const { jobs, count } = useAppSelector(state => state.jobs);

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">
                    Find your <span className="text-blue-600">new job</span> today
                </h1>
                <p className="text-gray-600 mb-6">
                    Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Input className="flex-grow" placeholder="What position are you looking for?" />
                    <Input className="md:w-1/4" placeholder="Location" />
                    <Button className="md:w-1/6">Search Jobs</Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Location</h3>
                                        <RadioGroup defaultValue="all">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="all" id="all-locations" />
                                                <Label htmlFor="all-locations">All locations</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="near-me" id="near-me" />
                                                <Label htmlFor="near-me">Near me</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="remote" id="remote-jobs" />
                                                <Label htmlFor="remote-jobs">Remote jobs</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Salary</h3>
                                        <Slider defaultValue={[20000, 100000]} min={0} max={200000} step={1000} />
                                        <div className="flex justify-between mt-2">
                                            <span>$0</span>
                                            <span>$200,000+</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Date of posting</h3>
                                        <RadioGroup defaultValue="all-time">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="all-time" id="all-time" />
                                                <Label htmlFor="all-time">All time</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="last-24-hours" id="last-24-hours" />
                                                <Label htmlFor="last-24-hours">Last 24 hours</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="last-7-days" id="last-7-days" />
                                                <Label htmlFor="last-7-days">Last 7 days</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Work experience</h3>
                                        <RadioGroup defaultValue="any">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="any" id="any-experience" />
                                                <Label htmlFor="any-experience">Any experience</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="internship" id="internship" />
                                                <Label htmlFor="internship">Internship</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="entry-level" id="entry-level" />
                                                <Label htmlFor="entry-level">Entry level</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Type of employment</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Checkbox id="full-time" />
                                                <label htmlFor="full-time" className="ml-2">Full-time</label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="part-time" />
                                                <label htmlFor="part-time" className="ml-2">Part-time</label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="temporary" />
                                                <label htmlFor="temporary" className="ml-2">Temporary</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">3177 Jobs</h2>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Relevance</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="salary">Salary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            {jobs.map((job, index) => (
                                <Card key={index}>
                                    <CardContent className="flex items-start p-6">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                                            <p className="text-gray-600">{job.companyName}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="flex items-center text-sm text-gray-500"><MapPin className="w-4 h-4 mr-1" />{job.jobLocationCountry}, {job.jobLocationCity}</span>
                                                <span className="flex items-center text-sm text-gray-500"><Briefcase className="w-4 h-4 mr-1" />{job.jobType}</span>
                                                <span className="flex items-center text-sm text-gray-500">{job.salaryRange}</span>
                                                <span className="flex items-center text-sm text-gray-500"><Clock className="w-4 h-4 mr-1" />   {formatDistanceToNowStrict(new Date(job.createdAt), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-8">
                    <Card className="md:w-1/2">
                        <CardHeader>
                            <CardTitle>Email me for jobs</CardTitle>
                            <CardDescription>Ut esse deserunt aute Lorem cupidatat nostrud est incididunt.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input placeholder="name@example.com" />
                                <Button>Subscribe</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:w-1/2">
                        <CardHeader>
                            <CardTitle>Get noticed faster</CardTitle>
                            <CardDescription>Labore irure cupidatat est laborum fugiat dolore amet.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full">Upload your resume</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    )
}