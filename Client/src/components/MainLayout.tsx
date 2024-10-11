'use client'
import React, { ReactNode } from 'react';
import Footer from './Footer';
import MainNavbar from './MainNavbar';
import { useAppSelector } from '@/lib/hooks';
import Loader from './Loader/loader';
import useCheckAuth from '@/hooks/useCheckAuth';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { loading } = useAppSelector(state => state.user);

    useCheckAuth();

    if (loading) {
        return <Loader />
    }
    return (
        <div>
            <MainNavbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;
