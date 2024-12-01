'use client'
import MainLayout from '@/components/MainLayout';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { CircleMinus, EyeIcon, EyeOff, Loader2, LockKeyhole, Mail, MapPin, MapPinned, MoveRight, User } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LocationSelector } from '@/components/LocationSelector';

const Signup: NextPage = () => {
    const [input, setInput] = useState<SignupInputState>({
        fullname: '',
        email: '',
        password: '',
        city: '',
        country: '',
        userRole: '',
    })

    const [errors, setErrors] = useState<Partial<SignupInputState>>({});
    const [hide, setHide] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showNextForm, setShowNextForm] = useState<boolean>(false);
    const [btnDisabled, setBtnDisabled] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (value) {
            setInput((prevInput) => ({
                ...prevInput,
                country: value,
            }));

            setErrors((prevErrors: Partial<SignupInputState>) => {
                const newErrors = { ...prevErrors };
                delete newErrors.country;
                return newErrors;
            })
        }
    }, [value]);

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
            } else if (name === "userRole" && value.length >= 1) {
                delete newErrors.userRole;
            }

            return newErrors;
        });
    }

    const selectValueChange = (value: string) => {
        setInput({
            ...input, userRole: value
        });

        setErrors((prevErrors: Partial<SignupInputState>) => {
            const newErrors = { ...prevErrors };
            delete newErrors.userRole;
            return newErrors;
        })
    };

    const nextFormHandler = () => {
        const result = userSignupSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;

            if (fieldErrors.city || fieldErrors.country || fieldErrors.userRole) {
                setErrors(fieldErrors as Partial<SignupInputState>);
                return;
            } else {
                setErrors({});
            }
        }
        setBtnDisabled(true);
        setTimeout(() => {
            setErrors({});
            setShowNextForm(true);
            setBtnDisabled(true);
        }, 1000);
    }

    const signupSubmitHandler = async () => {
        const result = userSignupSchema.safeParse(input);
        if (!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<SignupInputState>);
            return;
        }
        try {
            setLoading(true);
            const res = await userSignup(input);
            if (res) {
                dispatch(setUser(res.user));
                router.push('/');
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <MainLayout>
            <div className='flex flex-col justify-between min-h-screen'>
                <h1 className='text-3xl w-ful font-semibold text-center bg-gray-100 py-6'>Sign up</h1>
                <div className='flex-1 flex items-center justify-center'>
                    <div
                        className="sm:px-8 sm:py-2 p-3 w-full max-w-md rounded-lg m-auto my-2" >
                        <div className={`${showNextForm ? 'hidden' : ''}`}>
                            <div className="space-y-2">
                                <Label htmlFor="work-experience" className='text-[16px] font-semibold my-2'>User Roles <span className="text-red-600">*</span></Label>
                                <Select name="workExperience" onValueChange={(e) => selectValueChange(e)}>
                                    <SelectTrigger id="work-experience">
                                        <SelectValue placeholder="----Select Role----" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Applicant">Applicant</SelectItem>
                                        <SelectItem value="Recruiter">Recruiter</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.userRole && (
                                    <span className="text-xs flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.userRole}</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <h1 className='text-[16px] font-semibold my-2'>City <span className="text-red-600">*</span></h1>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Enter your city name"
                                        name="city"
                                        value={input.city}
                                        onChange={changeEventHandler}
                                        className="pl-10 h-12 focus-visible:ring-transparent"
                                    />
                                    <MapPinned className="absolute inset-y-2 top-3 left-2 text-gray-500 pointer-events-none" />
                                    {errors.city && (
                                        <span className="text-xs my-2 flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.city}</span>
                                    )}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h1 className='text-[16px] font-semibold my-2'>Country <span className="text-red-600">*</span></h1>
                                <div className="relative">
                                    <LocationSelector value={value} setValue={setValue} />
                                    {errors.country && (
                                        <span className="text-xs my-2 flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.country}</span>
                                    )}
                                </div>
                            </div>
                            <Button className="w-full group" onClick={nextFormHandler} disabled={btnDisabled}>
                                <span className='relative w-[30%]'>
                                    Next <MoveRight className="group-hover:translate-x-3 absolute right-0 top-[2px] h-5 transition duration-300" />
                                </span>
                            </Button>
                        </div>
                        <div className={`${showNextForm ? '' : 'hidden'}`}>
                            <div className="mb-4">
                                <h1 className='text-[16px] font-semibold my-2'>Fullname <span className="text-red-600">*</span></h1>
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
                                    {errors.fullname && (
                                        <span className="text-xs my-2 flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.fullname}</span>
                                    )}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h1 className='text-[16px] font-semibold my-2'>Email <span className="text-red-600">*</span></h1>
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
                                    {errors.email && (
                                        <span className="text-xs my-2 flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.email}</span>
                                    )}
                                </div>
                            </div>
                            <div className="mb-4">
                                <h1 className='text-[16px] font-semibold my-2'>Password <span className="text-red-600">*</span></h1>
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
                                    {errors.password && (
                                        <span className="text-xs my-2 flex items-center text-red-500"><CircleMinus className="w-4 h-4 mr-1" /> {errors.password}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                {loading ? (
                                    <Button disabled className="w-full bg-primary">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={signupSubmitHandler}
                                        className="w-full"
                                    >
                                        Create Account
                                    </Button>
                                )}
                            </div>
                        </div>
                        <Separator />
                        <p className="mt-6 text-center font-semibold text-sm sm:text-[16px]">
                            Already have an account?{" "}
                            <Link href="/login" className="text-blue-500">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Signup;