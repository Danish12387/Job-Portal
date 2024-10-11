import { z } from 'zod';

export const userSignupSchema = z.object({
    fullname: z.string().min(1, "Fullname is required"),
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
})

export type SignupInputState = z.infer<typeof userSignupSchema>

export const userLoginSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(6, "Password must be atleast 6 characters long")
})

export type LoginInputState = z.infer<typeof userLoginSchema>