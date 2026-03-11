import { Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';


interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const { user } = useAuth();

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm transition-colors duration-200">
            <button
                className="p-1 -ml-2 rounded-md md:hidden hover:bg-gray-100 text-gray-600 transition-colors"
                onClick={onMenuClick}
            >
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center ml-auto gap-4">

                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center transition-colors">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="hidden sm:inline-block font-medium">{user?.name}</span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
