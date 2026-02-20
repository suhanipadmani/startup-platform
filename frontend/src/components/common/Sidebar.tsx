import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { X, Home, Users, PlusCircle, Settings, LogOut, FileText, ChevronDown, ChevronRight, Clock, History } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
        'reviews': true 
    });

    const toggleMenu = (key: string) => {
        setExpandedMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
        }
    };

    const founderLinks = [
        { name: 'Dashboard', to: '/founder', icon: Home, end: true },
        { name: 'Submit Idea', to: '/founder/submit', icon: PlusCircle },
        { name: 'My Profile', to: '/profile', icon: Settings },
    ];

    const adminLinks = [
        { name: 'Dashboard', to: '/admin', icon: Home, end: true },
        {
            name: 'Reviews',
            icon: FileText,
            key: 'reviews',
            children: [
                { name: 'Pending Reviews', to: '/admin/reviews/pending', icon: Clock },
                { name: 'Review History', to: '/admin/reviews/history', icon: History },
            ]
        },
        { name: 'Users', to: '/admin/users', icon: Users },
        { name: 'My Profile', to: '/profile', icon: Settings },
    ];

    const links = user?.role === 'admin' ? adminLinks : founderLinks;

    const renderLink = (link: any) => {
        if (link.children) {
            const isExpanded = expandedMenus[link.key];
            const isActive = location.pathname.startsWith(link.to) || link.children.some((child: any) => location.pathname === child.to);

            return (
                <div key={link.name}>
                    <button
                        onClick={() => toggleMenu(link.key)}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive ? "text-blue-700 bg-blue-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <div className="flex items-center">
                            <link.icon className="w-5 h-5 mr-3" />
                            {link.name}
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {isExpanded && (
                        <div className="mt-1 ml-4 space-y-1 pl-4 border-l border-gray-200">
                            {link.children.map((child: any) => (
                                <NavLink
                                    key={child.to}
                                    to={child.to}
                                    onClick={() => { if (window.innerWidth < 768) onClose() }}
                                    className={({ isActive }) => cn(
                                        "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "text-blue-700 bg-blue-50"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <child.icon className="w-4 h-4 mr-3" />
                                    {child.name}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => { if (window.innerWidth < 768) onClose() }}
                className={({ isActive }) => cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
            >
                <link.icon className="w-5 h-5 mr-3" />
                {link.name}
            </NavLink>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 opacity-80 md:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b shrink-0">
                    <Link to="/" className="text-xl font-bold text-gray-800">
                        Startup Platform
                    </Link>
                    <button className="md:hidden" onClick={onClose}>
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <nav className="px-4 py-6 space-y-2 flex-1 overflow-y-auto">
                    {links.map((link) => renderLink(link))}
                </nav>

                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
