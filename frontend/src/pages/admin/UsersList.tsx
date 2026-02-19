import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { Trash2, Edit2 } from 'lucide-react';
import { showToast } from '../../utils/toast';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email'),
    role: z.enum(['admin', 'founder']),
});

type UserFormData = z.infer<typeof userSchema>;

const UsersList = () => {
    const queryClient = useQueryClient();
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: userService.getAllUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: userService.deleteUser,
        onSuccess: () => {
            showToast.success('User deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: UserFormData) => userService.updateUser(editingUser._id, data),
        onSuccess: () => {
            showToast.success('User updated successfully');
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            setEditingUser(null);
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });

    const handleEdit = (user: any) => {
        setEditingUser(user);
        reset({
            name: user.name,
            email: user.email,
            role: user.role,
        });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            deleteMutation.mutate(id);
        }
    };

    const onUpdate = (data: UserFormData) => {
        updateMutation.mutate(data);
    };

    if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users?.map((user: any) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(user)}>
                                            <Edit2 className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDelete(user._id)}>
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Edit User">
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
                    <Input label="Name" error={errors.name?.message} {...register('name')} />
                    <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
                    <Select
                        label="Role"
                        options={[
                            { value: 'founder', label: 'Founder' },
                            { value: 'admin', label: 'Admin' }
                        ]}
                        error={errors.role?.message}
                        {...register('role')}
                    />

                    <div className="flex justify-end pt-4 space-x-2">
                        <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
                        <Button type="submit" isLoading={updateMutation.isPending}>Save Changes</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersList;
