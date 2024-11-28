import { AdditionalDetailsState } from "@/components/EditAdditionalDetailsDialog";
import { jobPostSchemaType } from "@/schema/jobSchema";
import { ProfileEditState } from "@/schema/updateProfile";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import axios from "axios";
import toast from "react-hot-toast";

export interface User {
    _id: string;
    fullname: string;
    email: string
    profilePicture: string;
    profileBanner: string;
    city: string;
    country: string;
    lastLogin: Date;
    jobs?: Job[];
    headline?: string;
    websiteLink?: string;
    linkText?: string;
    about?: string;
    hobbies?: string[];
    languages?: string[];
    pronouns?: string;
    nickname?: string;
    workHistory?: string[];
    education?: string;
    createdAt: Date;
    updatedAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
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
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
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
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
}

export async function logout() {
    try {
        const res = await axios.post(`${API_END_POINT}/user/logout`);

        if (res.data.success) {
            toast.success(res.data.message);
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
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
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
}

export async function updateJob(data: jobPostSchemaType, id: string): Promise<JobResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/job/update-job/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
}

export async function deleteJob(id: string): Promise<void> {
    try {
        const res = await axios.delete(`${API_END_POINT}/job/delete-job/${id}`);

        if (res.data.success) {
            toast.success(res.data.message);
        }

    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
}

export async function deleteAllJobs(data: string[]): Promise<any> {
    try {
        const res = await axios.post(`${API_END_POINT}/job/delete-all-jobs`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }

    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function getSearchedJobs(query: string) {
    try {
        const res = await axios.get(`${API_END_POINT}/job/searchedJobs?q=${query}`);

        if (res.data.success) {
            return res.data;
        }

    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function getUserDetails(slug: string): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.get(`${API_END_POINT}/user/${slug}/details/`);
        if (res.data.success) {
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function editProfile(data: ProfileEditState): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/edit-profile`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function editProfileAbout(data: string): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/edit-profile-about`, { about: data }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function editHobbies(data: string[]): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/edit-hobbies`, { hobbies: data }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function editAdditionalDetails(data: AdditionalDetailsState): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/edit-additional-details`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function editProfilePic(data: FormData): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/edit-profile-pic`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function deleteProfilePic(url: string): Promise<UserResponseData | undefined> {
    try {
        const urlParts = url.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExtension.split('.')[0];
        const folder = urlParts.slice(-2, -1);

        const publicId = `${folder}/${fileName}`;

        const res = await axios.post(`${API_END_POINT}/user/delete-profile-pic`, { publicId }, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function editProfileBanner(data: FormData): Promise<UserResponseData | undefined> {
    try {
        const res = await axios.post(`${API_END_POINT}/user/edit-profile-banner`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function deleteProfileBanner(url: string): Promise<UserResponseData | undefined> {
    try {
        const urlParts = url.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExtension.split('.')[0];
        const folder = urlParts.slice(-2, -1);

        const publicId = `${folder}/${fileName}`;

        const res = await axios.post(`${API_END_POINT}/user/delete-profile-banner`, { publicId }, {
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (res.data.success) {
            toast.success(res.data.message);
            return res.data;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data?.message || 'Something went wrong');
    }
}

export async function getUserJobs(): Promise<Job[] | undefined> {
    try {
        const res = await axios.get(`${API_END_POINT}/user/get-user-jobs`);

        if (res.data.success) {
            return res.data.userJobs.jobs;
        }
    } catch (error: any) {
        console.log(error);
        toast.error(error?.resonse?.data?.message || "Something went wrong");
    }
}