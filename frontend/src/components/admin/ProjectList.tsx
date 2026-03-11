import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ideaService } from '../../services/idea.service';
import { Loader } from '../ui/Loader';
import { Eye, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';
import type { IProjectIdea } from '../../types';
import { useSocket } from '../../context/SocketContext';

interface ProjectListProps {
    initialStatus?: string;
    showFilters?: boolean;
    title?: string;
}

const ProjectList = ({ initialStatus = '', showFilters = true, title = 'Project Reviews' }: ProjectListProps) => {
    const queryClient = useQueryClient();
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleIdeaCreated = () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
        };

        socket.on('idea:created', handleIdeaCreated);

        return () => {
            socket.off('idea:created', handleIdeaCreated);
        };
    }, [socket, queryClient]);

    // Filters & Pagination
    const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
    const [techFilter, setTechFilter] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);

    const { data: paginationData, isLoading: isLoadingProjects } = useQuery({
        queryKey: ['admin', 'projects', statusFilter, techFilter, search, page, limit],
        queryFn: () => ideaService.getAdminIdeas({
            status: statusFilter || undefined,
            tech: techFilter || undefined,
            search: search || undefined,
            page,
            limit
        }),
    });

    const projectList = paginationData?.docs || [];
    const totalPages = paginationData?.totalPages || 1;

    // Filters & Pagination
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const handleTechChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTechFilter(e.target.value);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setStatusFilter(initialStatus);
        setTechFilter('');
        setSearch('');
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-gray-500" />
                        {title}
                    </h2>

                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={handleStatusChange}
                                className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            <input
                                type="text"
                                placeholder="Search by Title..."
                                value={search}
                                onChange={handleSearchChange}
                                className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500 outline-none w-48"
                            />

                            <input
                                type="text"
                                placeholder="Filter by Tech..."
                                value={techFilter}
                                onChange={handleTechChange}
                                className="border border-gray-300 rounded-md text-sm py-1.5 px-3 focus:ring-blue-500 focus:border-blue-500 outline-none w-32"
                            />

                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
                                Clear
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Founder</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tech Stack</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoadingProjects ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center">
                                    <div className="flex justify-center"><Loader size="md" /></div>
                                </td>
                            </tr>
                        ) : projectList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No projects found matching filters</td>
                            </tr>
                        ) : (
                            projectList.map((idea: IProjectIdea) => (
                                <tr key={idea._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{idea.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {(idea.founderId && typeof idea.founderId === 'object' && 'name' in idea.founderId)
                                            ? (idea.founderId as any).name
                                            : 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${idea.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            idea.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {idea.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-gray-500 text-xs">
                                        {idea.techStack?.join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(idea.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Link to={`/admin/projects/${idea._id}`}>
                                            <Button size="sm" variant="outline">
                                                <Eye className="w-4 h-4 mr-1" /> View
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isLoadingProjects && totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
            {/* Actions previously handled via modals are now accessed from the detail page */}
        </div>
    );
};

export default ProjectList;
