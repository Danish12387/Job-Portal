'use client'
import { DatePicker } from "@/components/DatePicker"
import { LocationSelector } from "@/components/LocationSelector"
import MainLayout from "@/components/MainLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { jobPostSchema, jobPostSchemaType, jobPostSelectSchema, jobPostSelectSchemaType } from "@/schema/jobSchema"
import { createJob } from "@/utils/apiHandlers"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

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
    });
    const [selectValue, setSelectValue] = useState<jobPostSelectSchemaType>({
        jobCategory: '',
        jobType: ''
    });
    const [errors, setErrors] = useState<Partial<jobPostSchemaType>>({});
    const [selectErrors, setSelectErrors] = useState<Partial<jobPostSelectSchemaType>>({});
    const [date, setDate] = useState<Date>();
    const [value, setValue] = useState<string | undefined>("");
    const router = useRouter();

    useEffect(() => {
        if (value) {
            setInput((prevInput) => ({
                ...prevInput,
                jobLocationCountry: value,
            }));

            setErrors((prevErrors: Partial<jobPostSchemaType>) => {
                const newErros = { ...prevErrors };
                delete newErros.jobLocationCountry;
                return newErros;
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
                const newErros = { ...prevErrors };
                delete newErros.applicationDeadline;
                return newErros;
            })
        }
    }, [date]);

    const errorHandler = (name: string, value: string): void => {
        setErrors((prevErrors: Partial<jobPostSchemaType>) => {
            const newErros = { ...prevErrors };

            if (name === "companyName" && value.length >= 1) {
                delete newErros.companyName;
            } else if (name === "websiteLink" && value.length >= 1) {
                delete newErros.websiteLink;
            } else if (name === "jobTitle" && value.length >= 1) {
                delete newErros.jobTitle;
            } else if (name === "jobLocationCity" && value.length >= 1) {
                delete newErros.jobLocationCity;
            } else if (name === "salaryRange" && value.length >= 1) {
                delete newErros.salaryRange;
            } else if (name === "experience" && value.length >= 1) {
                delete newErros.experience;
            } else if (name === "qualification" && value.length >= 1) {
                delete newErros.qualification;
            } else if (name === "jobDescription" && value.length >= 1) {
                delete newErros.jobDescription;
            }
            return newErros;
        });
    }

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInput({
            ...input, [name]: value
        })
        errorHandler(name, value);
    }

    const selectValueChange = (value: string, type: 'jobCategory' | 'jobType') => {
        setSelectValue({
            ...selectValue, [type]: value
        });

        setSelectErrors((prevErrors: Partial<jobPostSelectSchemaType>) => {
            const newErrors = { ...prevErrors };

            if (type === "jobCategory" && ['technology', 'design', 'marketing'].includes(value)) {
                delete newErrors.jobCategory;
            } else if (type === "jobType" && ['full-time', 'part-time', 'contract'].includes(value)) {
                delete newErrors.jobType;
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
            return;
        }
        const selectResult = jobPostSelectSchema.safeParse(selectValue);
        if (!selectResult.success) {
            const fieldErrors = selectResult.error.formErrors.fieldErrors;
            setSelectErrors(fieldErrors as Partial<jobPostSelectSchemaType>);
            return;
        }

        try {
            const form = {
                ...input,
                ...selectValue
            }
            const res = await createJob(form);
            router.push('/');
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <MainLayout>
            <h1 className='w-ful text-2xl font-semibold text-center bg-gray-100 py-6'>Create a Job</h1>
            <div className="container max-w-5xl my-5 mx-auto p-6 bg-white shadow-lg rounded-lg">
                <form className="space-y-6" onSubmit={inputSubmitHandler}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input id="company-name" onChange={changeEventHandler} name="companyName" value={input.companyName} placeholder="Company Name" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.companyName}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company-website">Company Website</Label>
                            <Input id="company-website" onChange={changeEventHandler} name="websiteLink" value={input.websiteLink} placeholder="Website Link" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.websiteLink}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="job-title">Job Title</Label>
                        <Input id="job-title" onChange={changeEventHandler} name="jobTitle" value={input.jobTitle} placeholder="Title" />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.jobTitle}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="job-category">Job Category</Label>
                            <Select name="jobCategory" onValueChange={(e) => selectValueChange(e, 'jobCategory')}>
                                <SelectTrigger id="job-category">
                                    <SelectValue placeholder="----Select Technology----" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="design">Design</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            {selectErrors && (
                                <span className="text-xs text-red-500">{selectErrors.jobCategory}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job-type">Job Type</Label>
                            <Select name="jobType" onValueChange={(e) => selectValueChange(e, 'jobType')}>
                                <SelectTrigger id="job-type">
                                    <SelectValue placeholder="----Select Type----" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full-time">Full Time</SelectItem>
                                    <SelectItem value="part-time">Part Time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                            {selectErrors && (
                                <span className="text-xs text-red-500">{selectErrors.jobType}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="job-location">Job Location (Country)</Label>
                            {/* <Input id="job-location" onChange={changeEventHandler} name="joblocation" value={input.joblocation} placeholder="Location" /> */}
                            <LocationSelector value={value} setValue={setValue} />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.jobLocationCountry}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="salary-range">Job Location (City)</Label>
                            <Input id="salary-range" onChange={changeEventHandler} name="jobLocationCity" value={input.jobLocationCity} placeholder="Job Location" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.jobLocationCity}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="salary-range">Salary Range</Label>
                            <Input id="salary-range" onChange={changeEventHandler} name="salaryRange" value={input.salaryRange} placeholder="Salary Range" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.salaryRange}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience <span className="text-gray-500">(e.g., 2 years, 6 months)</span></Label>
                            <Input id="experience" onChange={changeEventHandler} name="experience" value={input.experience} placeholder="Experience" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.experience}</span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="qualification">Qualification <span className="text-gray-500">(e.g., Matriculation, Intermediate, BSCS)</span></Label>
                            <Input id="qualification" onChange={changeEventHandler} name="qualification" value={input.qualification} placeholder="Qualification" />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.qualification}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="application-deadline">Application Deadline</Label>
                            {/* <Input id="application-deadline" onChange={changeEventHandler} name="applicationDeadline" value={input.applicationDeadline} placeholder="Job application deadline" /> */}
                            <DatePicker date={date} setDate={setDate} />
                            {errors && (
                                <span className="text-xs text-red-500">{errors.applicationDeadline}</span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-semibold text-[16px]" htmlFor="job-description">Job Description</Label>
                        <Textarea id="job-description" onChange={changeEventHandler} name="jobDescription" value={input.jobDescription} placeholder="Job Description" className="h-32" />
                        {errors && (
                            <span className="text-xs text-red-500">{errors.jobDescription}</span>
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