import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useEffect } from 'react';
import type { IProjectIdea } from '../../types';

const ideaSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  problemStatement: z.string().min(20, 'Problem statement must be at least 20 characters'),
  solution: z.string().min(20, 'Solution must be at least 20 characters'),
  targetMarket: z.string().min(5, 'Target market is required'),
  techStack: z.array(z.string()).min(1, 'Select at least one technology'),
  teamDetails: z.string().min(10, 'Team details must be at least 10 characters'),
  pitchDeck: z.any().optional(),
});

export type IdeaFormData = z.infer<typeof ideaSchema>;

const TECH_OPTIONS = ['React', 'Node.js', 'Python', 'Django', 'Vue', 'Angular', 'Java', 'Spring', 'Go', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'];

interface IdeaFormProps {
  initialData?: Partial<IProjectIdea>;
  onSubmit: (data: FormData) => void;
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
    formState: { errors },
  } = useForm<IdeaFormData>({
    mode: 'onChange',
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      techStack: [],
      ...initialData as any,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        techStack: [],
        ...initialData as any,
      });
    }
  }, [initialData, reset]);

  const selectedTechs = watch('techStack');

  const toggleTech = (tech: string) => {
    const current = selectedTechs || [];
    if (current.includes(tech)) {
      setValue('techStack', current.filter(t => t !== tech), { shouldValidate: true });
    } else {
      setValue('techStack', [...current, tech], { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data: IdeaFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'techStack') {
        (value as string[]).forEach(tech => formData.append('techStack', tech));
      } else if (key === 'pitchDeck' && value?.[0]) {
        formData.append('pitchDeck', value[0]);
      } else {
        formData.append(key, value as string);
      }
    });
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Project Title"
        placeholder="e.g., AI-Powered Logistics"
        error={errors.title?.message}
        {...register('title')}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Input
          label="Target Market"
          placeholder="e.g., Small Businesses"
          error={errors.targetMarket?.message}
          {...register('targetMarket')}
          required
        />
      </div>

      <Textarea
        label="Team Details"
        placeholder="Who is on your team and what are their roles?"
        rows={3}
        error={errors.teamDetails?.message}
        {...register('teamDetails')}
        required
      />

      <Textarea
        label="Problem Statement"
        placeholder="Describe the problem you are solving..."
        rows={3}
        error={errors.problemStatement?.message}
        {...register('problemStatement')}
        required
      />

      <Textarea
        label="Proposed Solution"
        placeholder="Describe your solution..."
        rows={3}
        error={errors.solution?.message}
        {...register('solution')}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pitch Deck (PDF, optional)
        </label>
        <input
          type="file"
          accept=".pdf"
          {...register('pitchDeck')}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

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
        <Button type="submit" size="lg" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
