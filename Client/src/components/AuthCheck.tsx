'use client';

import React, { ReactNode } from 'react';
import { useAppSelector } from '@/lib/hooks';
import Loader from './Loader/Loader';
import useCheckAuth from '@/hooks/useCheckAuth';

interface AuthCheckProps {
    children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
    const { loading } = useAppSelector(state => state.user);

    useCheckAuth();

    if (loading) {
        return <Loader />;
    }

    return <>{children}</>;
};

export default AuthCheck;
