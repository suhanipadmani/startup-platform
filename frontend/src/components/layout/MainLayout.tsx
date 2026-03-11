import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header.tsx';
import Sidebar from '../common/Sidebar';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950 overflow-hidden transition-colors duration-200">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-col flex-1 overflow-hidden shrink-0">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-950 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
