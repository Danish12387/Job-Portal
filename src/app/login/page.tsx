'use client'
import MainLayout from '@/components/MainLayout';
import Link from 'next/link';
import React, { useState } from 'react'
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-separator';

function Login() {
    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    return (
        <MainLayout>
            <div className='flex flex-col justify-between pt-[72px] min-h-screen'>
                <h1 className='text-3xl w-ful font-semibold text-center bg-gray-100 py-6'>Login</h1>
                <div className='flex-1 flex items-center justify-center'>
                    <form
                        className="md:p-8 w-full max-w-md rounded-lg m-auto my-5" >
                        <div className="mb-4">
                            <h1 className='text-[16px] font-semibold my-2'>Email</h1>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    // value={input.password}
                                    // onChange={changeEventHandler}
                                    className="pl-10 h-12 focus-visible:ring-transparent"
                                />
                                <Mail className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                {/* {errors && (
                                <span className="text-xs text-red-500">{errors.email}</span>
                            )} */}
                            </div>
                        </div>
                        <div className="mb-4">
                            <h1 className='text-[16px] font-semibold my-2'>Password</h1>
                            <div className="relative">
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    // value={input.password}
                                    // onChange={changeEventHandler}
                                    className="pl-10 h-12 focus-visible:ring-transparent"
                                />
                                <LockKeyhole className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                {/* {errors && (
                                <span className="text-xs text-red-500">{errors.password}</span>
                            )} */}
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
                        <p className="mt-6 text-center font-semibold">
                            Don't have an account?{" "}
                            <Link href="/" className="text-blue-500">
                                Signup
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}

export default Login;