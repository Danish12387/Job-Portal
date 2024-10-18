'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import { Menu } from 'lucide-react';

const NotAuthNavbar = () => {
    const pathname = usePathname();

    const renderAuthButton = () => {
        if (pathname === '/login') {
            return (
                <Link href="/signup">
                    <Button className='hover:scale-105 w-full sm:w-auto'>Signup</Button>
                </Link>
            );
        }

        if (pathname === '/signup') {
            return (
                <Link href="/login">
                    <Button className='hover:scale-105 w-full sm:w-auto'>Log in</Button>
                </Link>
            );
        }

        return (
            <>
                <Link className="mx-1" href="/login">
                    <Button variant="outline" className='hover:scale-105 w-full sm:w-auto'>Log in</Button>
                </Link>
                <Link className="mx-1" href="/signup">
                    <Button className='hover:scale-105 w-full sm:w-auto'>Signup</Button>
                </Link>
            </>
        );
    };

    return (
        <div className='px-5 py-4 fixed top-0 right-0 left-0 z-50 bg-white shadow-sm'>
            <div className='flex items-center justify-between container mx-auto'>
                <Link href={`/`} className='flex items-center justify-between gap-2 cursor-pointer'>
                    <img className='w-10' src="/logo.png" alt="Logo" />
                    <h1 className='font-semibold text-xl'>Jobless</h1>
                </Link>
                <div className="hidden sm:flex">
                    {renderAuthButton()}
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="sm:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="flex flex-col py-5 space-y-4 mt-4">
                            {renderAuthButton()}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default NotAuthNavbar