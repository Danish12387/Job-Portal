'use client'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Briefcase, Search, MoveRight } from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import { useAppSelector } from '@/lib/hooks';
import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link'
import { Job } from '@/utils/apiHandlers'

export default function JobSearchPage() {
    const { jobs, count } = useAppSelector(state => state.jobs);
    const { user } = useAppSelector(state => state.user);
    const [newJobs, setNewJobs] = useState<Job[]>([]);

    const [salary, setSalary] = useState("all");
    const [locationFilter, setLocationFilter] = useState<string>('all');
    const [timeFilter, setTimeFilter] = useState<string>('all-time');
    const [workExperience, setWorkExperience] = useState<string>('any');
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

    useEffect(() => {
        setNewJobs(jobs);
    }, [jobs]);

    useEffect(() => {
        applyFilters();
    }, [jobs, locationFilter, timeFilter, selectedJobTypes, workExperience, salary]);

    const applyFilters = () => {
        let filteredJobs = jobs;

        if (locationFilter === 'near-me') {
            filteredJobs = filteredJobs.filter(job =>
                job.jobLocationCity.toLowerCase() === user?.city.toLowerCase()
            );
        } else if (locationFilter === 'remote') {
            filteredJobs = filteredJobs.filter(job => job.jobType === 'Remote');
        }

        const now = new Date();
        if (timeFilter === 'last-24-hours') {
            filteredJobs = filteredJobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return now.getTime() - jobDate.getTime() <= 24 * 60 * 60 * 1000;
            });
        } else if (timeFilter === 'last-7-days') {
            filteredJobs = filteredJobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return now.getTime() - jobDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
            });
        }

        if (salary === 'Hourly') {
            filteredJobs = filteredJobs.filter(job => {
                return job.salary === "Hourly"
            })
        } else if (salary === 'Monthly') {
            filteredJobs = filteredJobs.filter(job => {
                return job.salary === "Monthly"
            })
        } else if (salary === 'Yearly') {
            filteredJobs = filteredJobs.filter(job => {
                return job.salary === "Yearly"
            })
        }

        if (workExperience === "senior") {
            filteredJobs = filteredJobs.filter(job => {
                return job.workExperience === "Senior"
            })
        } else if (workExperience === 'internship') {
            filteredJobs = filteredJobs.filter(job => {
                return job.workExperience === "Internship"
            })
        } else if (workExperience === 'entry-level') {
            filteredJobs = filteredJobs.filter(job => {
                return job.workExperience === "Entry Level"
            })
        }

        if (selectedJobTypes.length > 0) {
            filteredJobs = filteredJobs.filter(job => {
                const jobTypeLower = job.jobType.toLowerCase().replace(' ', '-');
                return selectedJobTypes.includes(jobTypeLower);
            });
        }

        setNewJobs(filteredJobs);
    };

    const filterLocation = (value: string) => {
        setLocationFilter(value);
    };

    const filterTime = (value: string) => {
        setTimeFilter(value);
    };

    const filterWorkEx = (value: string) => {
        setWorkExperience(value);
    }

    const filterSalary = (value: string) => {
        if (salary === value) {
            setSalary('all');
        } else {
            setSalary(value);
        }
    };

    const toggleJobType = (jobType: string) => {
        if (selectedJobTypes.includes(jobType)) {
            setSelectedJobTypes(selectedJobTypes.filter(type => type !== jobType));
        } else {
            setSelectedJobTypes([...selectedJobTypes, jobType]);
        }
    };

    const isChecked = (jobType: string) => {
        return selectedJobTypes.includes(jobType);
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-14">
                <h1 className="text-5xl font-semibold mb-2">
                    Find your <span className="text-blue-600">new job</span> today
                </h1>
                <p className="text-gray-600 mb-6">
                    Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
                </p>

                <div className="flex flex-col md:flex-row mb-8 relative">
                    <Input className="flex-grow pl-10 rounded-r-none" placeholder="What position are you looking for?" />
                    <Search className="absolute inset-y-2 top-3 left-2 text-gray-400 pointer-events-none" />
                    <Input className="md:w-[50%] rounded-none border-l-0" placeholder="Location" />
                    <Button className="md:w-1/6 rounded-l-none h-12">Search Jobs</Button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4">
                        <Card className='shadow-none'>
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold mb-2">Location</h3>
                                        <RadioGroup defaultValue="all" onValueChange={filterLocation}>
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
                                        {/* <Slider min={0} max={200000} step={1000} />
                                        <div className="flex justify-between mt-2">
                                            <span>$0</span>
                                            <span>$200,000+</span>
                                        </div> */}
                                        <div className="flex my-2">
                                            {["Hourly", "Monthly", "Yearly"].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => filterSalary(option)}
                                                    className={`p-2 text-sm border rounded-none ${salary === option ? "border-blue-500 bg-blue-100 text-blue-700" : "border-gray-300"
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Date of posting</h3>
                                        <RadioGroup defaultValue="all-time" onValueChange={filterTime}>
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
                                        <RadioGroup defaultValue="any" onValueChange={filterWorkEx}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="any" id="any-experience" />
                                                <Label htmlFor="any-experience">Any experience</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="senior" id="senior" />
                                                <Label htmlFor="senior">Senior</Label>
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
                                                <Checkbox id="full-time" checked={isChecked("full-time")}
                                                    onClick={() => toggleJobType("full-time")} />
                                                <label htmlFor="full-time" className="ml-2">Full-time</label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="part-time" checked={isChecked("part-time")}
                                                    onClick={() => toggleJobType("part-time")} />
                                                <label htmlFor="part-time" className="ml-2">Part-time</label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="contract" checked={isChecked("contract")}
                                                    onClick={() => toggleJobType("contract")} />
                                                <label htmlFor="contract" className="ml-2">Contract</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{newJobs?.length} Jobs</h2>
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
                            {
                                newJobs.length > 0 ? (
                                    newJobs?.map((job, index) => (
                                        <Card key={index} className='rounded-md my-5'>
                                            <CardContent className="flex items-start p-6">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                                                <div className="flex-grow">
                                                    <div className='flex justify-between items-center'>
                                                        <div>
                                                            <p className="text-gray-800">{job.companyName}</p>
                                                            <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                                                        </div>
                                                        <Link href={`/job-details/${job._id}`}>
                                                            <Button variant="outline" className="text-sm text-primary hover:text-primary">Apply now</Button>
                                                        </Link>
                                                    </div>
                                                    <div className="flex flex-wrap justify-between pr-5 mt-2">
                                                        <span className="flex items-center text-sm text-gray-500"><MapPin className="w-4 h-4 mr-1" />{job.jobLocationCountry}, {job.jobLocationCity}</span>
                                                        <span className="flex items-center text-sm text-gray-500"><Briefcase className="w-4 h-4 mr-1" />{job.jobType}</span>
                                                        <span className="flex items-center text-sm text-gray-500">{job.salaryRange}</span>
                                                        <span className="flex items-center text-sm text-gray-500"><Clock className="w-4 h-4 mr-1" />   {formatDistanceToNowStrict(new Date(job.createdAt), { addSuffix: true })}</span>
                                                    </div>
                                                    <p className='line-clamp-2 text-sm text-gray-600 mt-3'>{job.jobDescription}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )))
                                    :
                                    (
                                        <div className='my-10 text-xl font-semibold text-center'>No Results Found!</div>
                                    )
                            }
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-8">
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Email me for jobs</CardTitle>
                                <CardDescription>Ut esse deserunt aute Lorem cupidatat nostrud est incididunt.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-2">
                                    <Input placeholder="name@example.com" />
                                    <Button>Subscribe</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
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
            </div>
        </MainLayout>
    )
}