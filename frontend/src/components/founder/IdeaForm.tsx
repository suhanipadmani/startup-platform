import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useEffect } from 'react';

const ideaSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    problemStatement: z.string().min(20, 'Problem statement must be at least 20 characters'),
    solution: z.string().min(20, 'Solution must be at least 20 characters'),
    targetMarket: z.string().min(5, 'Target market is required'),
    techStack: z.array(z.string()).min(1, 'Select at least one technology'),
});

export type IdeaFormData = z.infer<typeof ideaSchema>;

const TECH_OPTIONS = ['React', 'Node.js', 'Python', 'Django', 'Vue', 'Angular', 'Java', 'Spring', 'Go', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'];

interface IdeaFormProps {
    initialData?: Partial<IdeaFormData>;
    onSubmit: (data: IdeaFormData) => void;
    isLoading: boolean;
    submitLabel?: string;
}

export const IdeaForm = ({ initialData, onSubmit, isLoading, submitLabel = 'Submit Idea' }: IdeaFormProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm<IdeaFormData>({
        mode: 'onChange',
        resolver: zodResolver(ideaSchema),
        defaultValues: {
            techStack: [],
            ...initialData,
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                techStack: [],
                ...initialData,
            });
        }
    }, [initialData, reset]);

    const selectedTechs = watch('techStack');

    const toggleTech = (tech: string) => {
        const current = selectedTechs || [];
        if (current.includes(tech)) {
            setValue('techStack', current.filter(t => t !== tech));
        } else {
            setValue('techStack', [...current, tech]);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Project Title"
                placeholder="e.g., AI-Powered Logistics"
                error={errors.title?.message}
                {...register('title')}
                required
            />

            <Textarea
                label="Problem Statement"
                placeholder="Describe the problem you are solving..."
                rows={4}
                error={errors.problemStatement?.message}
                {...register('problemStatement')}
                required
            />

            <Textarea
                label="Proposed Solution"
                placeholder="Describe your solution..."
                rows={4}
                error={errors.solution?.message}
                {...register('solution')}
                required
            />

            <Input
                label="Target Market"
                placeholder="e.g., Small Businesses, Remote Workers"
                error={errors.targetMarket?.message}
                {...register('targetMarket')}
                required
            />

            {/* Custom Multi-Select for Tech Stack */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technology Stack <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {TECH_OPTIONS.map(tech => (
                        <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTech(tech)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTechs?.includes(tech)
                                ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tech}
                        </button>
                    ))}
                </div>
                {errors.techStack && <p className="mt-1 text-xs text-red-500">{errors.techStack.message}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" isLoading={isLoading} disabled={!isValid}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};
