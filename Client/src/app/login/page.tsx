'use client'
import MainLayout from '@/components/MainLayout';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { Eye, EyeIcon, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { LoginInputState, userLoginSchema } from '@/schema/userSchema';
import { userLogin } from '@/utils/apiHandlers';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { NextPage } from 'next';
import { setUser } from '@/lib/features/user/userSlice';
import Link from 'next/link';

const Login: NextPage = () => {
    const [input, setInput] = useState<LoginInputState>({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<Partial<LoginInputState>>({});
    const [hide, setHide] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });

        setErrors((prevErrors: Partial<LoginInputState>) => {
            const newErros = { ...prevErrors };

            if (name === "email" && value.includes('@')) {
                delete newErros.email;
            } else if (name === "password" && value.length >= 6) {
                delete newErros.password;
            }
            return newErros;
        });
    }

    const loginSubmitHandler = async (e: FormEvent) => {
        e.preventDefault();
        const result = userLoginSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        try {
            const res = await userLogin(input);
            if (res) {
                dispatch(setUser(res.user));
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <MainLayout>
            <div className='flex flex-col justify-between min-h-screen'>
                <h1 className='text-3xl w-ful font-semibold text-center bg-gray-100 py-6'>Login</h1>
                <div className='flex-1 flex items-center justify-center'>
                    <form
                        onSubmit={loginSubmitHandler}
                        className="sm:p-8 p-3 w-full max-w-md rounded-lg m-auto my-5" >
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
                                Login
                            </Button>
                            {/* )} */}
                        </div>
                        <Separator />
                        <p className="mt-6 text-center font-semibold text-sm sm:text-[16px]">
                            Don't have an account?{" "}
                            <Link href="/signup" className="text-blue-500">
                                Create Account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}

export default Login;