import React from 'react'
import { Card, CardContent } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';
import { Briefcase, Clock, MapPin } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Job } from '@/utils/apiHandlers';

interface JobCardProps {
    job: Job
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
    return (
        <Card className='rounded-md my-5'>
            <CardContent className="flex items-start p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex-shrink-0"></div>
                <div className="flex-grow">
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className="text-gray-800">{job.companyName}</p>
                            <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                        </div>
                        <Link href={`/job-details/${job._id}`}>
                            <Button variant="outline" className="text-sm text-primary hover:text-primary">View Details</Button>
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
    )
}

export default JobCard;