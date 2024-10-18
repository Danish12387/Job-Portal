'use client';

import React, { ReactNode } from 'react';
import { useAppSelector } from '@/lib/hooks';
import Loader from './Loader/loader';
import useCheckAuth from '@/hooks/useCheckAuth';
import useGetAllJobs from '@/hooks/usegetAllJobs';

interface AuthCheckProps {
    children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
    const { loading } = useAppSelector(state => state.user);

    useCheckAuth();
    useGetAllJobs();

    if (loading) {
        return <Loader />;
    }

    return <>{children}</>;
};

export default AuthCheck;
