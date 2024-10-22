'use client'
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import useGetJobDetails from "@/hooks/useGetJobDetails";
import { useAppSelector } from "@/lib/hooks";

export default function JobListing({ params }: { params: { slug: string } }) {
    const { jobDetails } = useAppSelector(state => state.jobs);

    useGetJobDetails(params.slug);

    return (
        <MainLayout>
            <h1 className="text-2xl font-semibold bg-gray-100 py-6 text-center">{jobDetails?.jobTitle}({jobDetails?.jobType}) - {jobDetails?.companyName}</h1>
            <div className="container mx-auto py-6">
                <div className="space-x-2 flex items-center justify-center gap-5">
                    <Button variant='outline' className="hover:scale-105">
                        View Company
                    </Button>
                    <Button className="hover:scale-105">
                        Apply This Job
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div>
                        <p className=""><span className="test-[16px] font-semibold">Minimum Qualification:</span> {jobDetails?.qualification}</p>
                        <p className=""><span className="test-[16px] font-semibold">Work Experience:</span> {jobDetails?.workExperience}</p>
                        <p className=""><span className="test-[16px] font-semibold">Experience:</span> {jobDetails?.experience}</p>
                        <p className=""><span className="test-[16px] font-semibold">Location:</span> {jobDetails?.jobLocationCity}, {jobDetails?.jobLocationCountry}</p>
                    </div>
                    <div>
                        <p className=""><span className="test-[16px] font-semibold">Application Deadline:</span> {jobDetails?.applicationDeadline}</p>
                        <p className=""><span className="test-[16px] font-semibold">Salary Range:</span> ${jobDetails?.salaryRange}</p>
                        <p className=""><span className="test-[16px] font-semibold">Salary: </span>{jobDetails?.salary}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Job description</h2>
                    <p className="">
                        {jobDetails?.jobDescription}
                    </p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{jobDetails?.jobTitle} Requirements:</h2>
                    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                        {
                            jobDetails?.requirements?.map((responsibility, index) => (
                                <li key={index}>{responsibility}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Responsibilities:</h2>
                    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                        {
                            jobDetails?.responsibilities?.map((responsibility, index) => (
                                <li key={index}>{responsibility}</li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </MainLayout>
    )
}