'use client';

import React, { ReactNode } from 'react';
import { useAppSelector } from '@/lib/hooks';
import Loader from './Loader/Loader';
import useCheckAuth from '@/hooks/useCheckAuth';
import { usePathname } from "next/navigation";

interface AuthCheckProps {
    children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
    const { loading, user } = useAppSelector(state => state.user);
    const pathname = usePathname();

    useCheckAuth();

    if (loading) {
        return <Loader />;
    }

    if (user?.userRole !== "Recruiter") {
        if (pathname.includes('manage-jobs') || pathname.includes('create-job')) {
            return <Loader />;
        }
    }

    return <>{children}</>;
};

export default AuthCheck;
