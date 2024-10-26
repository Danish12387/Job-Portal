import React, { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Job } from '@/utils/apiHandlers';
import { useAppSelector } from '@/lib/hooks';
import { Checkbox } from './ui/checkbox';

interface SearchInputs {
    location: string;
    search: string;
}

interface FiltersProps {
    jobs: Job[];
    setNewJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    searchInputs: SearchInputs;
    selectValue: string;
}

const Filters: React.FC<FiltersProps> = ({ jobs, setNewJobs, selectValue, searchInputs }) => {
    const { user } = useAppSelector(state => state.user);

    const [salary, setSalary] = useState("all");
    const [locationFilter, setLocationFilter] = useState<string>('all');
    const [timeFilter, setTimeFilter] = useState<string>('all-time');
    const [workExperience, setWorkExperience] = useState<string>('any');
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);

    useEffect(() => {
        applyFilters();
    }, [jobs, locationFilter, timeFilter, selectedJobTypes, workExperience, salary, selectValue]);

    useEffect(() => {
        if (searchInputs.search === '' && searchInputs.location === '') {
            applyFilters();
        }
    }, [searchInputs]);

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

        if (searchInputs.search) {
            filteredJobs = filteredJobs.filter(job => {
                const jobTitleLower = job.jobTitle.toLowerCase();
                return jobTitleLower.includes(searchInputs.search.toLowerCase());
            });
        }

        if (searchInputs.location) {
            filteredJobs = filteredJobs.filter(job => {
                const jobLocationLower = job.jobLocationCity.toLowerCase();
                return jobLocationLower.includes(searchInputs.location.toLowerCase());
            });
        }

        interface Job {
            createdAt: string | Date;
        }

        if (selectValue === "date") {
            filteredJobs = [...filteredJobs].sort((a: Job, b: Job) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
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
    )
}

export default Filters;