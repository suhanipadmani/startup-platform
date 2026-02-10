import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function Navbar() {
    const logout = useLogout();
    const { user } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600">Incubator</h1>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {user.role === 'founder' && (
                                <>
                                    <Link
                                        to="/founder"
                                        className={clsx(
                                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                            isActive('/founder')
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        )}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/founder/submit"
                                        className={clsx(
                                            'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                            isActive('/founder/submit')
                                                ? 'border-indigo-500 text-gray-900'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        )}
                                    >
                                        Submit Idea
                                    </Link>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className={clsx(
                                        'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                                        isActive('/admin')
                                            ? 'border-indigo-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    )}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-4">
                            {user.name} ({user.role})
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
