import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useAppDispatch } from '@/lib/hooks';
import { jobPostSchemaType } from '@/schema/jobSchema';
import { Job, updateJob } from '@/utils/apiHandlers';
import { CircleMinus, Edit2, Pencil } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LocationSelector } from './LocationSelector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { DatePicker } from "@/components/DatePicker";
import ReqPointsList from "@/components/ReqPointsList";
import ResPointsList from "@/components/ResPointsList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { jobPostSchema } from "@/schema/jobSchema";
import { FormEvent } from "react";

interface EditProfileDialogProps {
    jobDetails: Job;
}

const EditJobDialog: React.FC<EditProfileDialogProps> = ({ jobDetails }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [errors, setErrors] = useState<Partial<jobPostSchemaType>>({});
    const [input, setInput] = useState<jobPostSchemaType>({
        companyName: jobDetails?.companyName || '',
        websiteLink: jobDetails?.websiteLink || '',
        jobTitle: jobDetails?.jobTitle || '',
        jobLocationCountry: jobDetails?.jobLocationCountry || '',
        jobLocationCity: jobDetails?.jobLocationCity || '',
        salaryRange: jobDetails?.salaryRange || '',
        experience: jobDetails?.experience || '',
        qualification: jobDetails?.qualification || '',
        applicationDeadline: jobDetails?.applicationDeadline || '',
        jobDescription: jobDetails?.jobDescription || '',
        jobCategory: jobDetails?.jobCategory || '',
        jobType: jobDetails?.jobType || '',
        workExperience: jobDetails?.workExperience || '',
        salary: jobDetails?.salary || '',
        requirements: jobDetails?.requirements || [''],
        responsibilities: jobDetails?.responsibilities || [''],
    });
    const [initialForm, setInitialForm] = useState<jobPostSchemaType>(input);
    const [date, setDate] = useState<Date>();
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        const isEditing = searchParams.get('edit') === 'job';
        setIsOpen(isEditing);
        if (!isEditing && isFormDirty()) {
            setShowWarning(true);
        }
    }, [searchParams]);

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
        if (jobDetails) {
            const newForm = {
                companyName: jobDetails?.companyName || '',
                websiteLink: jobDetails?.websiteLink || '',
                jobTitle: jobDetails?.jobTitle || '',
                jobLocationCountry: jobDetails?.jobLocationCountry || '',
                jobLocationCity: jobDetails?.jobLocationCity || '',
                salaryRange: jobDetails?.salaryRange || '',
                experience: jobDetails?.experience || '',
                qualification: jobDetails?.qualification || '',
                applicationDeadline: jobDetails?.applicationDeadline || '',
                jobDescription: jobDetails?.jobDescription || '',
                jobCategory: jobDetails?.jobCategory || '',
                jobType: jobDetails?.jobType || '',
                workExperience: jobDetails?.workExperience || '',
                salary: jobDetails?.salary || '',
                requirements: jobDetails?.requirements || [''],
                responsibilities: jobDetails?.responsibilities || [''],
            };
            setInput(newForm);
            setInitialForm(newForm);
            setValue(jobDetails?.jobLocationCountry || '');
            setDate(new Date(jobDetails?.applicationDeadline || ''));
        }
    }, [jobDetails]);

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

    const isFormDirty = () => {
        return JSON.stringify(input) !== JSON.stringify(initialForm);
    };

    const openDialog = () => {
        router.push(`/my-jobs?edit=job`);
    };

    const closeDialog = () => {
        if (isFormDirty()) {
            setShowWarning(true);
        } else {
            router.push(`/my-jobs`);
        }
    };

    const handleDiscard = () => {
        setInput(initialForm);
        setShowWarning(false);
        router.push(`/my-jobs`);
    };

    const handleKeepEditing = () => {
        setShowWarning(false);
    };

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

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInput({
            ...input, [name]: name === 'salaryRange' ? String(value) : value
        })
        errorHandler(name, value);
    }

    const inputSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const inputResult = jobPostSchema.safeParse(input);
        if (!inputResult.success) {
            const fieldErrors = inputResult.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<jobPostSchemaType>);
            toast.error('All fields must be filled.');
            return;
        }
        const jobId = jobDetails?._id;
        try {
            const res = await updateJob(input, jobId);
            if (res?.success) {
                setIsOpen(false);
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Button onClick={openDialog} size="sm" variant="ghost" className="text-green-600 border-green-600">
                <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-[900px] max-h-[500px] w-[90%] h-[80%] border-none p-0">
                    <DialogHeader className='border-b w-full p-4 h-20'>
                        <DialogTitle>Edit Job</DialogTitle>
                        <DialogDescription>
                            Make changes to your job here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-6 overflow-y-auto p-5" onSubmit={inputSubmitHandler}>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="company-name">Company Name <span className="text-red-600">*</span></Label>
                                <Input id="company-name" onChange={changeEventHandler} name="companyName" value={input.companyName} placeholder="Company Name" />
                                {errors.companyName && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.companyName}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company-website">Company Website <span className="text-red-600">*</span></Label>
                                <Input id="company-website" onChange={changeEventHandler} name="websiteLink" value={input.websiteLink} placeholder="Website Link" />
                                {errors.websiteLink && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.websiteLink}</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job-title">Job Title <span className="text-red-600">*</span></Label>
                            <Input id="job-title" onChange={changeEventHandler} name="jobTitle" value={input.jobTitle} placeholder="Title" />
                            {errors.jobTitle && (
                                <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.jobTitle}</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="work-experience">Work Experience <span className="text-red-600">*</span></Label>
                                <Select name="workExperience"
                                    onValueChange={(e) => selectValueChange(e, 'workExperience')}
                                    defaultValue={input.workExperience || undefined}
                                >
                                    <SelectTrigger id="work-experience">
                                        <SelectValue placeholder="----Select Experience----" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Senior">Senior</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.workExperience && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.workExperience}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary <span className="text-red-600">*</span></Label>
                                <Select
                                    name="salary"
                                    onValueChange={(e) => selectValueChange(e, 'salary')}
                                    defaultValue={input.salary || undefined}
                                >
                                    <SelectTrigger id="salary">
                                        <SelectValue placeholder="----Select Salary----" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Hourly">Hourly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.salary && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.salary}</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="job-category">Job Category <span className="text-red-600">*</span></Label>
                                <Select name="jobCategory"
                                    onValueChange={(e) => selectValueChange(e, 'jobCategory')}
                                    defaultValue={input.jobCategory || undefined}
                                >
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
                                {errors.jobCategory && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.jobCategory}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="job-type">Job Type <span className="text-red-600">*</span></Label>
                                <Select name="jobType"
                                    onValueChange={(e) => selectValueChange(e, 'jobType')}
                                    defaultValue={input.jobType || undefined}
                                >
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
                                {errors.jobType && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.jobType}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="job-location">Job Location (Country) <span className="text-red-600">*</span></Label>
                                <LocationSelector value={value} setValue={setValue} />
                                {errors.jobLocationCountry && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.jobLocationCountry}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary-range">Job Location (City) <span className="text-red-600">*</span></Label>
                                <Input id="salary-range" onChange={changeEventHandler} name="jobLocationCity" value={input.jobLocationCity} placeholder="Job Location" />
                                {errors.jobLocationCity && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.jobLocationCity}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="salary-range">Salary Range <span className="text-red-600">*</span></Label>
                                <Input type="number" id="salary-range" onChange={changeEventHandler} name="salaryRange" value={input.salaryRange} placeholder="Salary Range" />
                                {errors.salaryRange && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.salaryRange}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience <span className="text-red-600">*</span> <span className="text-gray-500">(e.g., 2 years, 6 months)</span></Label>
                                <Input id="experience" onChange={changeEventHandler} name="experience" value={input.experience} placeholder="Experience" />
                                {errors.experience && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.experience}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="qualification">Qualification <span className="text-red-600">*</span> <span className="text-gray-500">(e.g., Matriculation, Intermediate, BSCS)</span></Label>
                                <Input id="qualification" onChange={changeEventHandler} name="qualification" value={input.qualification} placeholder="Qualification" />
                                {errors.qualification && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.qualification}</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="application-deadline">Application Deadline <span className="text-red-600">*</span></Label>
                                <DatePicker date={date} setDate={setDate} />
                                {errors.applicationDeadline && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.applicationDeadline}</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-semibold text-[18px]" htmlFor="job-description">Job Description <span className="text-red-600">*</span></Label>
                            <Textarea id="job-description" onChange={changeEventHandler} name="jobDescription" value={input.jobDescription} placeholder="Job Description" className="h-32" />
                            {errors.jobDescription && (
                                <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.jobDescription}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold text-[18px]" htmlFor="requirements">Requirements <span className="text-red-600">*</span></Label>
                            <ReqPointsList input={input} setInput={setInput} errorHandler={errorHandler} />
                            {errors.requirements && (
                                <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.requirements}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="font-semibold text-[18px]" htmlFor="responsibilities">Responsibilities <span className="text-red-600">*</span></Label>
                            <ResPointsList input={input} setInput={setInput} errorHandler={errorHandler} />
                            {errors.responsibilities && (
                                <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.responsibilities}</span>
                            )}
                        </div>

                        <div className="w-full flex items-center justify-end">
                            <Button type="submit" className="hover:scale-105 px-10">
                                Update Job
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Are you sure you want to discard them?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleKeepEditing}>Keep editing</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDiscard}>Discard changes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default EditJobDialog;