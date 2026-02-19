import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const editProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

const EditProfilePage = () => {
    const { user } = useAuth();
    const { updateProfile, isUpdating } = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<EditProfileFormData>({
        mode: 'onChange',
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const onSubmit = (data: EditProfileFormData) => {
        updateProfile(data);
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
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Full Name"
                        error={errors.name?.message}
                        {...register('name')}
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                        required
                    />

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={isUpdating} disabled={!isValid}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
