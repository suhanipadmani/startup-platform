import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { User, Mail, Calendar, PenTool, Lock, Trash2, AlertTriangle } from 'lucide-react';
import { Loader } from '../../components/ui/Loader';
import { Modal } from '../../components/ui/Modal';

const ProfilePage = () => {
    const { user, isLoadingUser } = useAuth();
    const { deleteAccount, isDeletingAccount } = useUser();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteAccount = () => {
        deleteAccount();
    };

    if (isLoadingUser) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                        <div className="flex items-center text-gray-500 mt-1">
                            <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center text-gray-700">
                        <Mail className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Email:</span>
                        {user.email}
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Joined:</span>
                        {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link to="/profile/edit" className="flex-1">
                        <Button variant="outline" className="w-full">
                            <PenTool className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    </Link>
                    <Link to="/profile/change-password">
                        <Button variant="outline" className="w-full">
                            <Lock className="w-4 h-4 mr-2" />
                            Change Password
                        </Button>
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-red-800 font-medium">Delete Account</p>
                            <p className="text-sm text-red-600 mt-1">
                                Permanently delete your account and all data. This action cannot be undone.
                            </p>
                        </div>
                        <Button
                            variant="danger"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete 
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account"
            >
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-red-600 bg-red-50 p-3 rounded-lg">
                        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                        <p className="text-sm font-medium">
                            Warning: This action is irreversible.
                        </p>
                    </div>

                    <p className="text-gray-600">
                        Are you absolutely sure you want to delete your account? All your data, including profile information and any submitted ideas, will be permanently removed from our servers.
                    </p>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeletingAccount}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteAccount}
                            isLoading={isDeletingAccount}
                        >
                            Confirm Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProfilePage;
