'use client'
import React, { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Briefcase, Search, MoveRight } from 'lucide-react'
import MainLayout from '@/components/MainLayout'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link'
import { Job } from '@/utils/apiHandlers'
import { incrementPage, JobFilters, setHasMore, setJobFiltersState, setJobLoading } from '@/lib/features/job/jobSlice';
import InfiniteScroll from 'react-infinite-scroll-component'
import JobsLoader from '@/components/JobsLoader/JobsLoader';
import JobCardSkeleton from '@/components/CardsSkeleton';
import JobCard from '@/components/JobCard';

export default function JobSearchPage() {
    const dispatch = useAppDispatch();
    const { jobs, page, hasMore, jobLoading, totalJobs } = useAppSelector(state => state.jobs);
    const { user } = useAppSelector(state => state.user);
    const [newJobs, setNewJobs] = useState<Job[]>([]);
    const [srchInputs, setSrchInputs] = useState({
        location: '',
        search: '',
    })

    const [jobFilters, setJobFilters] = useState<JobFilters>({
        location: 'all',
        time: 'all-time',
        selectedJobTypes: [''],
        workExperience: 'any',
        salary: 'all',
        selectValue: 'all',
        searchInputs: {
            location: '',
            search: '',
        },
    });

    useEffect(() => {
        setNewJobs(jobs);
    }, [jobs]);

    console.log(jobs);

    // useEffect(() => {
    //     // applyFilters();
    // }, [jobs, jobFilters]);

    useEffect(() => {
        setNewJobs([]);
        dispatch(setJobLoading(true));
        dispatch(setJobFiltersState(jobFilters));
        dispatch(incrementPage(1));
        dispatch(setHasMore(true));
        console.log('changed');
    }, [jobFilters])

    useEffect(() => {
        if (srchInputs.search === '' && srchInputs.location === '') {
            onChangeJobFilters('searchInputs', { ...srchInputs });
        }
    }, [srchInputs]);

    const loadMoreJobs = () => {
        dispatch(incrementPage(page + 1));
        // dispatch(setHasMore(false));
    };

    const applyFilters = () => {
        let filteredJobs = jobs;

        if (jobFilters.location === 'near-me') {
            filteredJobs = filteredJobs.filter(job =>
                job.jobLocationCity.toLowerCase() === user?.city.toLowerCase()
            );
        } else if (jobFilters.location === 'remote') {
            filteredJobs = filteredJobs.filter(job => job.jobType === 'Remote');
        }

        const now = new Date();
        if (jobFilters.time === 'last-24-hours') {
            filteredJobs = filteredJobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return now.getTime() - jobDate.getTime() <= 24 * 60 * 60 * 1000;
            });
        } else if (jobFilters.time === 'last-7-days') {
            filteredJobs = filteredJobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return now.getTime() - jobDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
            });
        }

        if (jobFilters.salary === 'Hourly') {
            filteredJobs = filteredJobs.filter(job => {
                return job.salary === "Hourly"
            })
        } else if (jobFilters.salary === 'Monthly') {
            filteredJobs = filteredJobs.filter(job => {
                return job.salary === "Monthly"
            })
        } else if (jobFilters.salary === 'Yearly') {
            filteredJobs = filteredJobs.filter(job => {
                return job.salary === "Yearly"
            })
        }

        if (jobFilters.workExperience === "senior") {
            filteredJobs = filteredJobs.filter(job => {
                return job.workExperience === "Senior"
            })
        } else if (jobFilters.workExperience === 'internship') {
            filteredJobs = filteredJobs.filter(job => {
                return job.workExperience === "Internship"
            })
        } else if (jobFilters.workExperience === 'entry-level') {
            filteredJobs = filteredJobs.filter(job => {
                return job.workExperience === "Entry Level"
            })
        }

        if (jobFilters.selectedJobTypes.length > 1) {
            filteredJobs = filteredJobs.filter(job => {
                const jobTypeLower = job.jobType.toLowerCase().replace(' ', '-');
                return jobFilters.selectedJobTypes.includes(jobTypeLower);
            });
        }

        if (jobFilters.searchInputs.search) {
            filteredJobs = filteredJobs.filter(job => {
                const jobTitleLower = job.jobTitle.toLowerCase();
                return jobTitleLower.includes(jobFilters.searchInputs.search.toLowerCase());
            });
        }

        if (jobFilters.searchInputs.location) {
            filteredJobs = filteredJobs.filter(job => {
                const jobLocationLower = job.jobLocationCity.toLowerCase();
                return jobLocationLower.includes(jobFilters.searchInputs.location.toLowerCase());
            });
        }

        interface Job {
            createdAt: string | Date;
        }

        if (jobFilters.selectValue === "date") {
            filteredJobs = [...filteredJobs].sort((a: Job, b: Job) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
        }

        setNewJobs(filteredJobs);
    };

    interface searchInputsInterface {
        location: string;
        search: string;
    }

    const onChangeJobFilters = (name: string, value: string | string[] | searchInputsInterface | undefined) => {
        setJobFilters({
            ...jobFilters,
            [name]: value
        });
    }

    const fetchAllJobs = () => {
        const pages = Math.ceil(totalJobs / 6);
        dispatch(incrementPage(pages));
    }

    const filterLocation = (value: string) => {
        if (value === 'near-me') {

            onChangeJobFilters('location', user?.city);
        } else {
            onChangeJobFilters('location', value);
        }

    };

    const filterTime = (value: string) => {
        onChangeJobFilters('time', value);
    };

    const filterWorkEx = (value: string) => {
        onChangeJobFilters('workExperience', value);
    }

    const filterSalary = (value: string) => {
        if (jobFilters.salary === value) {
            onChangeJobFilters('salary', 'all');
        } else {
            onChangeJobFilters('salary', value);
        }
    };

    const toggleJobType = (jobType: string) => {
        if (jobFilters.selectedJobTypes.includes(jobType)) {
            // setSelectedJobTypes(selectedJobTypes.filter(type => type !== jobType));
            const filteredJobTypes = jobFilters.selectedJobTypes.filter(type => type !== jobType);
            onChangeJobFilters('selectedJobTypes', filteredJobTypes);
        } else {
            // setSelectedJobTypes([...selectedJobTypes, jobType]);
            if (jobFilters.selectedJobTypes.includes('')) {
                onChangeJobFilters('selectedJobTypes', [jobType]);
            } else {
                onChangeJobFilters('selectedJobTypes', [...jobFilters.selectedJobTypes, jobType]);
            }
        }
    };

    console.log(jobFilters)

    const isChecked = (jobType: string) => {
        return jobFilters.selectedJobTypes.includes(jobType);
    };

    const changeSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSrchInputs({ ...srchInputs, [name]: value });
    }

    const submitSearchHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onChangeJobFilters('searchInputs', { ...srchInputs })
        // applyFilters();
    }

    const selectValueChange = (value: string) => {
        onChangeJobFilters('selectValue', value);
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-14">
                <h1 className="text-5xl font-semibold mb-2">
                    Find your <span className="text-blue-600">new job</span> today
                </h1>
                <p className="text-gray-600 mb-6">
                    Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
                </p>

                <form onSubmit={submitSearchHandler} className="flex flex-col md:flex-row mb-8 relative">
                    <Input name='search' value={srchInputs.search} onChange={changeSearchHandler} className="flex-grow pl-10 rounded-r-none" placeholder="What position are you looking for?" />
                    <Search className="absolute inset-y-2 top-3 left-2 text-gray-400 pointer-events-none" />
                    <Input name='location' value={srchInputs.location} onChange={changeSearchHandler} className="md:w-[50%] rounded-none border-l-0" placeholder="Location (city name)" />
                    <Button type='submit' className="md:w-1/6 rounded-l-none h-12">Search Jobs</Button>
                </form>

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
                                                <RadioGroupItem value="Remote" id="remote-jobs" />
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
                                                    className={`p-2 text-sm border rounded-none ${jobFilters.salary === option ? "border-blue-500 bg-blue-100 text-blue-700" : "border-gray-300"
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
                                                <RadioGroupItem value="Senior" id="senior" />
                                                <Label htmlFor="senior">Senior</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Internship" id="internship" />
                                                <Label htmlFor="internship">Internship</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Entry level" id="entry-level" />
                                                <Label htmlFor="entry-level">Entry level</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Type of employment</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Checkbox id="full-time" checked={isChecked("Full Time")}
                                                    onClick={() => toggleJobType("Full Time")} />
                                                <label htmlFor="full-time" className="ml-2">Full-time</label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="part-time" checked={isChecked("Part Time")}
                                                    onClick={() => toggleJobType("Part Time")} />
                                                <label htmlFor="part-time" className="ml-2">Part-time</label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="contract" checked={isChecked("Contract")}
                                                    onClick={() => toggleJobType("Contract")} />
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
                            <h2 className="text-2xl font-semibold">{newJobs.length} Jobs</h2>
                            <Select onValueChange={(e) => selectValueChange(e)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="relevance">Relevance</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="salary">Salary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <InfiniteScroll
                                dataLength={jobs.length}
                                next={loadMoreJobs}
                                hasMore={hasMore}
                                loader={jobLoading && Array(6).fill(0).map((_, index) => <JobCardSkeleton key={index} />)}
                                endMessage={<p className='text-center text-gray-600'>No more jobs to load</p>}>
                                {
                                    jobs.length > 0 ? (
                                        newJobs.length > 0 ? (
                                            newJobs?.map((job, index) => (
                                                <JobCard job={job} key={index} />
                                            ))
                                        )
                                            :
                                            (
                                                Array(6).fill(0).map((_, index) => <JobCardSkeleton key={index} />)
                                            )
                                    )
                                        :
                                        (
                                            !jobLoading && (<div className='my-10 text-xl font-semibold text-center'>No Results Found!</div>)
                                        )
                                }
                            </InfiniteScroll>
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