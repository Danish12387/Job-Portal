'use client'
import MainLayout from '@/components/MainLayout';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { EyeIcon, EyeOff, Loader2, LockKeyhole, Mail, User } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { SignupInputState, userSignupSchema } from '@/schema/userSchema';
import { userSignup } from '@/utils/apiHandlers';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { setUser } from '@/lib/features/user/userSlice';
import { NextPage } from 'next';
import Link from 'next/link';

const Signup: NextPage = () => {
    const [input, setInput] = useState<SignupInputState>({
        fullname: '',
        email: '',
        password: '',
        city: '',
        country: '',
    })

    const [errors, setErrors] = useState<Partial<SignupInputState>>({});
    const [hide, setHide] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });

        setErrors((prevErrors: Partial<SignupInputState>) => {
            const newErrors = { ...prevErrors };
            if (name === "fullname" && value.length >= 1) {
                delete newErrors.fullname;
            } else if (name === "email" && value.includes('@')) {
                delete newErrors.email;
            } else if (name === "password" && value.length >= 6) {
                delete newErrors.password;
            } else if (name === "city" && value.length >= 1) {
                delete newErrors.city;
            } else if (name === "country" && value.length >= 1) {
                delete newErrors.country;
            }

            return newErrors;
        });
    }

    const signupSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const result = userSignupSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<SignupInputState>);
            return;
        }
        try {
            const res = await userSignup(input);
            if (res) {
                dispatch(setUser(res.user));
                router.push('/');
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <MainLayout>
            <div className='flex flex-col justify-between pt-[72px] min-h-screen'>
                <h1 className='text-3xl w-ful font-semibold text-center bg-gray-100 py-6'>Sign up</h1>
                <div className='flex-1 flex items-center justify-center'>
                    <form
                        onSubmit={signupSubmitHandler}
                        className="sm:px-8 sm:py-2 p-3 w-full max-w-md rounded-lg m-auto my-2" >
                        <div className="mb-4">
                            <h1 className='text-[16px] font-semibold my-2'>Fullname</h1>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Enter your fullname"
                                    name="fullname"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="pl-10 h-12 focus-visible:ring-transparent"
                                />
                                <User className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                {errors && (
                                    <span className="text-xs text-red-500">{errors.fullname}</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h1 className='text-[16px] font-semibold my-2'>Email</h1>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="pl-10 h-12 focus-visible:ring-transparent"
                                />
                                <Mail className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                {errors && (
                                    <span className="text-xs text-red-500">{errors.email}</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h1 className='text-[16px] font-semibold my-2'>Password</h1>
                            <div className="relative">
                                <Input
                                    type={hide ? "text" : "password"}
                                    placeholder="Enter your password"
                                    name="password"
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    className="pl-10 h-12 focus-visible:ring-transparent"
                                />
                                <LockKeyhole className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                {
                                    hide ?
                                        <EyeOff onClick={() => setHide(!hide)} className="absolute inset-y-2 top-3 right-2 text-gray-500 cursor-pointer" />
                                        :
                                        <EyeIcon onClick={() => setHide(!hide)} className="absolute inset-y-2 top-3 right-2 text-gray-500 cursor-pointer" />
                                }
                                {errors && (
                                    <span className="text-xs text-red-500">{errors.password}</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h1 className='text-[16px] font-semibold my-2'>City</h1>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Enter your city name"
                                    name="city"
                                    value={input.city}
                                    onChange={changeEventHandler}
                                    className="pl-10 h-12 focus-visible:ring-transparent"
                                />
                                <Mail className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                {errors && (
                                    <span className="text-xs text-red-500">{errors.city}</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h1 className='text-[16px] font-semibold my-2'>Country</h1>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Enter your country name"
                                    name="country"
                                    value={input.country}
                                    onChange={changeEventHandler}
                                    className="pl-10 h-12 focus-visible:ring-transparent"
                                />
                                <Mail className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                {errors && (
                                    <span className="text-xs text-red-500">{errors.country}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            {/* {loading ? (
                            <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </Button>
                        ) : ( */}
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Create Account
                            </Button>
                            {/* )} */}
                        </div>
                        <Separator />
                        <p className="mt-6 text-center font-semibold text-sm sm:text-[16px]">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-500">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}

export default Signup;