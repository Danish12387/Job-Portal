import { z } from "zod";

export const jobPostSchema = z.object({
    companyName: z.string().min(1, "Company Name is required"),
    websiteLink: z.string().min(1, "Website Link is required"),
    jobTitle: z.string().min(1, "Job Title is required"),
    jobLocationCountry: z.string().min(1, "Job Location is required"),
    jobLocationCity: z.string().min(1, "Job Location is required"),
    salaryRange: z.string().min(1, "Salary Range is required"),
    experience: z.string().min(1, "Experience is required"),
    qualification: z.string().min(1, "Qualification is required"),
    applicationDeadline: z.string().min(1, "Application Deadline is required"),
    jobDescription: z.string().min(300, "Job Description should be atleast 300 characters long"),
});

export type jobPostSchemaType = z.infer<typeof jobPostSchema>

export const jobPostSelectSchema = z.object({
    jobCategory: z.string().min(1, "Job Category is required"),
    jobType: z.string().min(1, "Job Type is required"),
})

export type jobPostSelectSchemaType = z.infer<typeof jobPostSelectSchema>

const jobCombinedSchema = jobPostSchema.merge(jobPostSelectSchema);

export type CombinedJobPostSchemaType = z.infer<typeof jobCombinedSchema>;