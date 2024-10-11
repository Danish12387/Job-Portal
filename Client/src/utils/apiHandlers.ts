import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import axios from "axios";

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

export interface ResponseData {
    success: boolean;
    message: string;
    user: User;
}

const API_END_POINT = "http://localhost:8000/api/v1";

export async function userLogin(input: LoginInputState): Promise<ResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/login`, input, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        });
        if (res.data.success) {
            alert('Logged in successfully!');
            return res.data;
        }
    } catch (error) {
        console.log(error);
        alert(error?.response?.data?.message);
    }
}

export async function userSignup(input: SignupInputState): Promise<ResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/signup`, input, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
        });
        if (res.data.success) {
            alert('Signuped in successfully!');
            return res.data;
        }
    } catch (error) {
        console.log(error);
        alert(error?.response?.data?.message);
    }
}