'use client'
import { DatePicker } from "@/components/DatePicker"
import { LocationSelector } from "@/components/LocationSelector"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { jobPostSchema, jobPostSchemaType } from "@/schema/jobSchema"
import { createJob } from "@/utils/apiHandlers"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import ResPointsList from "@/components/ResPointsList"
import ReqPointsList from "@/components/ReqPointsList"
import toast from "react-hot-toast";

export default function JobPostingForm() {
    const [input, setInput] = useState<jobPostSchemaType>({
        companyName: '',
        websiteLink: '',
        jobTitle: '',
        jobLocationCountry: '',
        jobLocationCity: '',
        salaryRange: '',
        experience: '',
        qualification: '',
        applicationDeadline: '',
        jobDescription: '',
        jobCategory: '',
        jobType: '',
        workExperience: '',
        salary: '',
        requirements: [''],
        responsibilities: [''],
    });
    const [errors, setErrors] = useState<Partial<jobPostSchemaType>>({});
    const [date, setDate] = useState<Date>();
    const [value, setValue] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if (value) {
            setInput((prevInput) => ({
                ...prevInput,
                jobLocationCountry: value,
            }));

            setErrors((prevErrors: Partial<jobPostSchemaType>) => {
                const newErrors = { ...prevErrors };
                delete newErrors.jobLocationCountry;
                return newErrors;
            })
        }
    }, [value])

    useEffect(() => {
        if (date) {
            const formatDate = (date: Date): string => {
                const monthNames = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                const day = date.getDate();
                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();

                return `${month} ${day}, ${year}`;
            };

            const formattedDate = formatDate(date);
            setInput((prevInput) => ({
                ...prevInput,
                applicationDeadline: formattedDate,
            }));

            setErrors((prevErrors: Partial<jobPostSchemaType>) => {
                const newErrors = { ...prevErrors };
                delete newErrors.applicationDeadline;
                return newErrors;
            })
        }
    }, [date]);

    const errorHandler = (name: string, value: string | string[]): void => {
        setErrors((prevErrors: Partial<jobPostSchemaType>) => {
            const newErrors = { ...prevErrors };

            if (name === "companyName" && value.length >= 1) {
                delete newErrors.companyName;
            } else if (name === "websiteLink" && value.length >= 1) {
                delete newErrors.websiteLink;
            } else if (name === "jobTitle" && value.length >= 1) {
                delete newErrors.jobTitle;
            } else if (name === "jobLocationCity" && value.length >= 1) {
                delete newErrors.jobLocationCity;
            } else if (name === "salaryRange" && value.length >= 1) {
                delete newErrors.salaryRange;
            } else if (name === "experience" && value.length >= 1) {
                delete newErrors.experience;
            } else if (name === "qualification" && value.length >= 1) {
                delete newErrors.qualification;
            } else if (name === "jobDescription" && value.length >= 1) {
                delete newErrors.jobDescription;
            } else if (name === "requirements" && value.length >= 1) {
                delete newErrors.requirements;
            } else if (name === "responsibilities" && value.length >= 1) {
                delete newErrors.responsibilities;
            }
            return newErrors;
        });
    }

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInput({
            ...input, [name]: name === 'salaryRange' ? String(value) : value
        })
        errorHandler(name, value);
    }

    const selectValueChange = (value: string, type: 'jobCategory' | 'jobType' | 'workExperience' | 'salary') => {
        setInput({
            ...input, [type]: value
        });

        setErrors((prevErrors: Partial<jobPostSchemaType>) => {
            const newErrors = { ...prevErrors };

            if (type === "jobCategory" && ['Technology', 'Design', 'Marketing', 'Other'].includes(value)) {
                delete newErrors.jobCategory;
            } else if (type === "jobType" && ['Full Time', 'Part Time', 'Remote', 'Contract'].includes(value)) {
                delete newErrors.jobType;
            } else if (type === "workExperience" && ['Senior', 'Internship', 'Entry Level'].includes(value)) {
                delete newErrors.workExperience;
            } else if (type === "salary" && ['Hourly', 'Monthly', 'Yearly'].includes(value)) {
                delete newErrors.salary;
            }

            return newErrors;
        });
    };

    const inputSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const inputResult = jobPostSchema.safeParse(input);
        if (!inputResult.success) {
            const fieldErrors = inputResult.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<jobPostSchemaType>);
            toast.error('All fields must be filled.');
            return;
        }

        try {
            await createJob(input);
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <MainLayout>
            <h1 className='w-ful text-2xl font-semibold text-center bg-gray-100 py-6'>Create a Job</h1>
            <div className="container max-w-5xl my-5 mx-auto p-6 bg-white rounded-lg">
                <form className="space-y-6" onSubmit={inputSubmitHandler}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name <span className="text-red-600">*</span></Label>
                            <Input id="company-name" onChange={changeEventHandler} name="companyName" value={input.companyName} placeholder="Company Name" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.companyName}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-website">Company Website <span className="text-red-600">*</span></Label>
                            <Input id="company-website" onChange={changeEventHandler} name="websiteLink" value={input.websiteLink} placeholder="Website Link" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.websiteLink}</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="job-title">Job Title <span className="text-red-600">*</span></Label>
                        <Input id="job-title" onChange={changeEventHandler} name="jobTitle" value={input.jobTitle} placeholder="Title" />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.jobTitle}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="work-experience">Work Experience <span className="text-red-600">*</span></Label>
                            <Select name="workExperience" onValueChange={(e) => selectValueChange(e, 'workExperience')}>
                                <SelectTrigger id="work-experience">
                                    <SelectValue placeholder="----Select Experience----" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors && (
                                <span className="text-xs text-red-500">{errors.workExperience}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary <span className="text-red-600">*</span></Label>
                            <Select name="salary" onValueChange={(e) => selectValueChange(e, 'salary')}>
                                <SelectTrigger id="salary">
                                    <SelectValue placeholder="----Select Salary----" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Hourly">Hourly</SelectItem>
                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                    <SelectItem value="Yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors && (
                                <span className="text-xs text-red-500">{errors.salary}</span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="job-category">Job Category <span className="text-red-600">*</span></Label>
                            <Select name="jobCategory" onValueChange={(e) => selectValueChange(e, 'jobCategory')}>
                                <SelectTrigger id="job-category">
                                    <SelectValue placeholder="----Select Category----" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Design">Design</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors && (
                                <span className="text-xs text-red-500">{errors.jobCategory}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job-type">Job Type <span className="text-red-600">*</span></Label>
                            <Select name="jobType" onValueChange={(e) => selectValueChange(e, 'jobType')}>
                                <SelectTrigger id="job-type">
                                    <SelectValue placeholder="----Select Type----" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Full Time">Full Time</SelectItem>
                                    <SelectItem value="Part Time">Part Time</SelectItem>
                                    <SelectItem value="Remote">Remote</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors && (
                                <span className="text-xs text-red-500">{errors.jobType}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="job-location">Job Location (Country) <span className="text-red-600">*</span></Label>
                            <LocationSelector value={value} setValue={setValue} />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.jobLocationCountry}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary-range">Job Location (City) <span className="text-red-600">*</span></Label>
                            <Input id="salary-range" onChange={changeEventHandler} name="jobLocationCity" value={input.jobLocationCity} placeholder="Job Location" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.jobLocationCity}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="salary-range">Salary Range <span className="text-red-600">*</span></Label>
                            <Input type="number" id="salary-range" onChange={changeEventHandler} name="salaryRange" value={input.salaryRange} placeholder="Salary Range" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.salaryRange}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience <span className="text-red-600">*</span> <span className="text-gray-500">(e.g., 2 years, 6 months)</span></Label>
                            <Input id="experience" onChange={changeEventHandler} name="experience" value={input.experience} placeholder="Experience" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.experience}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="qualification">Qualification <span className="text-red-600">*</span> <span className="text-gray-500">(e.g., Matriculation, Intermediate, BSCS)</span></Label>
                            <Input id="qualification" onChange={changeEventHandler} name="qualification" value={input.qualification} placeholder="Qualification" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.qualification}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="application-deadline">Application Deadline <span className="text-red-600">*</span></Label>
                            <DatePicker date={date} setDate={setDate} />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.applicationDeadline}</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-[18px]" htmlFor="job-description">Job Description <span className="text-red-600">*</span></Label>
                        <Textarea id="job-description" onChange={changeEventHandler} name="jobDescription" value={input.jobDescription} placeholder="Job Description" className="h-32" />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.jobDescription}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold text-[18px]" htmlFor="requirements">Requirements <span className="text-red-600">*</span></Label>
                        <ReqPointsList input={input} setInput={setInput} errorHandler={errorHandler} />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.requirements}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="font-semibold text-[18px]" htmlFor="responsibilities">Responsibilities <span className="text-red-600">*</span></Label>
                        <ResPointsList input={input} setInput={setInput} errorHandler={errorHandler} />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.responsibilities}</span>
                        )}
                    </div>

                    <div className="w-full flex items-center justify-end">
                        <Button type="submit" className="hover:scale-105 px-10">
                            Post Job
                        </Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    )
}