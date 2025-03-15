'use client'
import React, { useEffect } from 'react';
import NotAuthNavbar from "@/components/NotAuthNavbar";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import AuthNavbar from './AuthNavbar';
import LoadingBar from 'react-top-loading-bar';
import { setProgress } from '@/lib/features/user/userSlice';
import { usePathname, useSearchParams } from 'next/navigation';

const MainNavbar = () => {
    const { isAuthenticated, progress } = useAppSelector(state => state.user);
    const pathname = usePathname();
    const params = useSearchParams();
    const dispatch = useAppDispatch();

    const pageTitles = {
        '/create-job': 'Create Job | Job Nexus',
        '/login': 'Login | Job Nexus',
        '/signup': 'Signup | Job Nexus',
        '/feed': 'Feed | Job Nexus',
        '/feed?create=post': 'Create Post | Job Nexus',
        '/job-search': 'Job Search | Job Nexus',
        '/manage-jobs': 'Manage Jobs | Job Nexus',
    } as const;

    useEffect(() => {
        let title: string = pageTitles[pathname as keyof typeof pageTitles] || 'Job Nexus';

        if (pathname.startsWith('/feed')) {
            if (params.get('create') === 'post') {
                title = 'Create Post | Job Nexus';
            }
        }

        if (pathname.startsWith('/profile')) {
            if (params.get('edit') === 'profile') {
                title = 'Edit Profile | Job Nexus';
            } else if (params.get('edit') === 'about') {
                title = 'Edit About | Job Nexus';
            } else if (params.get('edit') === 'hobbies') {
                title = 'Edit Hobbies | Job Nexus';
            } else if (params.get('edit') === 'additional-details') {
                title = 'Edit Additional Details | Job Nexus';
            } else if (params.get('edit') === 'job') {
                title = 'Edit Job | Job Nexus';
            } else {
                title = 'Profile | Job Nexus';
            }
        }

        if (pathname.startsWith('/job-details')) {
            title = 'Job Details | Job Nexus';
        }

        document.title = title;
    }, [pathname, params]);

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