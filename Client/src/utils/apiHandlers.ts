import { jobPostSchemaType } from "@/schema/jobSchema";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import axios from "axios";
import toast from "react-hot-toast";

export interface User {
    _id: string;
    fullname: string;
    email: string;
    city: string;
    country: string;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface UserResponseData {
    success: boolean;
    message: string;
    user: User;
}

export interface Job {
    _id: string;
    companyName: string;
    websiteLink: string;
    jobTitle: string;
    jobLocationCountry: string;
    jobLocationCity: string;
    salaryRange: string;
    experience: string;
    qualification: string;
    applicationDeadline: string;
    jobDescription: string;
    jobCategory: string;
    jobType: string;
    workExperience: string;
    salary: string;
    requirements: string[];
    responsibilities: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface JobResponseData {
    success: boolean;
    message: string;
    job: Job;
}

const API_END_POINT = "http://localhost:8000/api/v1";
axios.defaults.withCredentials = true;

export async function userLogin(input: LoginInputState): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/login`, input, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.data.success) {
            toast.success(res.data.message, {
                icon: '👏',
            });
            return res.data;
        }
    } catch (error) {
        console.log(error);
        // toast.error(error?.response?.data?.message);
    }
}

export async function userSignup(input: SignupInputState): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/signup`, input, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error) {
        console.log(error);
        // toast.error(error?.response?.data?.message);
    }
}

export async function logout() {
    try {
        const res = await axios.post(`${API_END_POINT}/user/logout`);

        if (res.data.success) {
            toast.success(res.data.message);
        }
    } catch (error) {
        console.log(error);
        // toast.error(error?.response?.data?.message);
    }
}

export async function createJob(data: jobPostSchemaType): Promise<JobResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/job/create-job`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error) {
        console.log(error);
        // toast.error(error?.response?.data?.message);
    }
}