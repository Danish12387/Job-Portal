import React, { ReactNode } from 'react';
import Footer from './Footer';
import MainNavbar from './MainNavbar';
import AuthCheck from './AuthCheck';
import { Toaster } from 'react-hot-toast';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className='bg-white'>
            <MainNavbar />
            <AuthCheck>
                <main className='pt-[75px] min-h-screen'>{children}</main>
                <Toaster
                    toastOptions={{
                        duration: 5000,
                    }}
                />
            </AuthCheck>
            <Footer />
        </div>
    );
};

export default MainLayout;