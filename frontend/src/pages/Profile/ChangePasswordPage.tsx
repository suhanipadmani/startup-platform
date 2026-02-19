import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '../../hooks/useUser';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
    const { changePassword, isChangingPassword } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ChangePasswordFormData>({
        mode: 'onChange',
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        });
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-6">
                <Link to="/profile">
                    <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-blue-600">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Profile
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Current Password"
                        type="password"
                        error={errors.currentPassword?.message}
                        {...register('currentPassword')}
                        required
                    />

                    <Input
                        label="New Password"
                        type="password"
                        error={errors.newPassword?.message}
                        {...register('newPassword')}
                        required
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        error={errors.confirmNewPassword?.message}
                        {...register('confirmNewPassword')}
                        required
                    />

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={isChangingPassword} disabled={!isValid}>
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
