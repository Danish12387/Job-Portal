'use client'
import React, { useEffect } from 'react';
import NotAuthNavbar from "@/components/NotAuthNavbar";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import AuthNavbar from './AuthNavbar';
import LoadingBar from 'react-top-loading-bar';
import { setProgress } from '@/lib/features/user/userSlice';
import { usePathname } from 'next/navigation';

const MainNavbar = () => {
    const { isAuthenticated, progress } = useAppSelector(state => state.user);
    const pathname = usePathname();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setProgress(100));
    }, [pathname]);

    return (
        <>
            <LoadingBar
                height={3}
                color='#f11946'
                progress={progress}
                onLoaderFinished={() => dispatch(setProgress(0))}
            />
            {
                isAuthenticated ? < AuthNavbar /> : <NotAuthNavbar />
            }
        </>
    )
}

export default MainNavbar