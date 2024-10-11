'use client'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

const NotAuthNavbar = () => {
    const pathname = usePathname();

    const renderAuthButton = () => {
        if (pathname === '/login') {
            return (
                <Link href="/signup">
                    <Button className='hover:scale-105'>Signup</Button>
                </Link>
            );
        }

        if (pathname === '/signup') {
            return (
                <Link href="/login">
                    <Button className='hover:scale-105'>Log in</Button>
                </Link>
            );
        }

        return (
            <>
                <Link className="mx-1" href="/login">
                    <Button variant="outline" className='hover:scale-105'>Log in</Button>
                </Link>
                <Link className="mx-1" href="/signup">
                    <Button className='hover:scale-105'>Signup</Button>
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
                <div>
                    {renderAuthButton()}
                </div>
            </div>
        </div>
    )
}

export default NotAuthNavbar