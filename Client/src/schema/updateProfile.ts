import { z } from 'zod';

export const userProfileEdit = z.object({
    fullname: z.string().min(1, "Fullname is required").max(25, "Fullname should not exceed 25 characters"),
    headline: z.string().optional(),
    websiteLink: z.string().optional(),
    linkText: z.string().optional(),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
})

export type ProfileEditState = z.infer<typeof userProfileEdit>;