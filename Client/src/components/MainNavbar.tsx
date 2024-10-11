'use client'
import React from 'react';
import NotAuthNavbar from "@/components/NotAuthNavbar";
import { useAppSelector } from '@/lib/hooks';
import AuthNavbar from './AuthNavbar';

const MainNavbar = () => {
    const { isAuthenticated } = useAppSelector(state => state.user);

    return (
        <>
            {
                isAuthenticated ? < AuthNavbar /> : <NotAuthNavbar />
            }
        </>
    )
}

export default MainNavbar