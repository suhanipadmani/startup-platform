import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ideaService } from '../services/idea.service';
import type { IProjectIdea } from '../types';
import { showToast } from '../utils/toast';
import { useNavigate } from 'react-router-dom';

export const useIdeas = (params?: any) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: ideasData, isLoading, error } = useQuery({
        queryKey: ['ideas', params],
        queryFn: () => ideaService.getAllIdeas(params),
        placeholderData: (prev) => prev,
    });

    const createIdeaMutation = useMutation({
        mutationFn: (data: Partial<IProjectIdea>) => ideaService.createIdea(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ideas'] });
            showToast.success('Idea submitted successfully');
            navigate('/founder');
        },
    });

    const deleteIdeaMutation = useMutation({
        mutationFn: (id: string) => ideaService.deleteIdea(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ideas'] });
            showToast.success('Idea deleted successfully');
        },
    });

    const updateIdeaMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IProjectIdea> }) => ideaService.updateIdea(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ideas'] });
            queryClient.invalidateQueries({ queryKey: ['idea'] });
            showToast.success('Idea updated successfully');
            navigate('/founder');
        },
    });

    return {
        ideas: ideasData,
        isLoading,
        error,
        createIdea: createIdeaMutation.mutate,
        isCreating: createIdeaMutation.isPending,
        deleteIdea: deleteIdeaMutation.mutate,
        isDeleting: deleteIdeaMutation.isPending,
        updateIdea: updateIdeaMutation.mutate,
        isUpdating: updateIdeaMutation.isPending,
    };
};

export const useIdea = (id: string) => {
    return useQuery({
        queryKey: ['idea', id],
        queryFn: () => ideaService.getIdeaById(id),
        enabled: !!id,
    });
};
