import { useQuery } from '@tanstack/react-query';
import { ideaService } from '../services/idea.service';

export const useIdeaStats = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['idea-stats'],
        queryFn: ideaService.getIdeaStats,
        initialData: { total: 0, pending: 0, approved: 0, rejected: 0 }
    });

    return { stats, isLoading, error };
};
