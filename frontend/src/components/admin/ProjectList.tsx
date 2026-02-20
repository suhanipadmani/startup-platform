import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ideaService } from '../../services/idea.service';
import { Loader } from '../ui/Loader';
import { Eye, Check, X, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { showToast } from '../../utils/toast';
import type { IProjectIdea } from '../../types';

interface ProjectListProps {
    initialStatus?: string;
    showFilters?: boolean;
    title?: string;
    showActions?: boolean;
}

const ProjectList = ({ initialStatus = '', showFilters = true, title = 'Project Reviews', showActions = true }: ProjectListProps) => {
    const queryClient = useQueryClient();
    const [selectedIdea, setSelectedIdea] = useState<IProjectIdea | null>(null);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [comment, setComment] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

    const reviewMutation = useMutation({
        mutationFn: async () => {
            if (!selectedIdea || !action) return;
            if (action === 'approve') {
                return ideaService.approveIdea(selectedIdea._id, comment);
            } else {
                return ideaService.rejectIdea(selectedIdea._id, comment);
            }
        },
        onSuccess: () => {
            showToast.success(`Project ${action}d successfully`);
            queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            closeActionModal();
            closeViewModal();
        },
        onError: () => {
            showToast.error('Failed to update project status');
        }
    });

    const openViewModal = (idea: IProjectIdea) => {
        setSelectedIdea(idea);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setSelectedIdea(null);
        setIsViewModalOpen(false);
    };

    const openActionModal = (actionType: 'approve' | 'reject') => {
        setAction(actionType);
        setComment('');
    };

    const closeActionModal = () => {
        setAction(null);
        setComment('');
    };

    // Filter Change Handlers - Reset Page to 1
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

    // Generate Page Numbers
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= page - 2 && i <= page + 2)
            ) {
                pages.push(i);
            } else if (
                i === page - 3 ||
                i === page + 3
            ) {
                pages.push('...');
            }
        }
        return pages.filter((val, index, arr) => arr.indexOf(val) === index);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full"> {/* Ensure full height if needed, keeping simple */}
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
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${idea.status === 'approved' ? 'bg-green-100 text-green-800' :
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
                                        <Button size="sm" variant="outline" onClick={() => openViewModal(idea)}>
                                            <Eye className="w-4 h-4 mr-1" /> View
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isLoadingProjects && totalPages > 1 && (
                <div className="px-6 py-4 border-t flex justify-center">
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>

                        {getPageNumbers().map((pageNum, idx) => (
                            <button
                                key={idx}
                                onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                                disabled={typeof pageNum !== 'number'}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${pageNum === page
                                    ? 'bg-blue-600 text-white'
                                    : typeof pageNum === 'number'
                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        : 'text-gray-500 cursor-default'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* View Idea Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={closeViewModal}
                title="Project Details"
            >
                {selectedIdea && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Project Title</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900 break-words">{selectedIdea.title}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Problem Statement</h3>
                            <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md break-words whitespace-pre-wrap">{selectedIdea.problemStatement}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Solution</h3>
                            <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md break-words whitespace-pre-wrap">{selectedIdea.solution}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Target Market</h3>
                                <p className="mt-1 text-gray-700 break-words whitespace-pre-wrap">{selectedIdea.targetMarket}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Tech Stack</h3>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {selectedIdea.techStack.map((tech, i) => (
                                        <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedIdea.status === 'pending' && showActions && (
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => openActionModal('reject')}>
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </Button>
                                <Button variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => openActionModal('approve')}>
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                            </div>
                        )}
                        {selectedIdea.status !== 'pending' && (
                            <div className="pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    This project was <span className={`font-semibold ${selectedIdea.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{selectedIdea.status}</span> on {new Date(selectedIdea.updatedAt).toLocaleDateString()}.
                                </p>
                                {selectedIdea.adminComment && (
                                    <p className="text-sm text-gray-600 mt-2 break-words whitespace-pre-wrap">
                                        <strong>Admin Comment:</strong> {selectedIdea.adminComment}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Action Modal (Approve/Reject confirmation) */}
            <Modal
                isOpen={!!action}
                onClose={closeActionModal}
                title={`${action === 'approve' ? 'Approve' : 'Reject'} Project`}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 break-words">
                        You are about to {action} <strong>{selectedIdea?.title}</strong>. Please provide a comment for the founder.
                    </p>
                    <Textarea
                        label="Admin Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Enter your feedback..."
                    />
                    <div className="flex justify-end space-x-3 pt-2">
                        <Button variant="ghost" onClick={closeActionModal} disabled={reviewMutation.isPending}>Cancel</Button>
                        <Button
                            variant={action === 'approve' ? 'primary' : 'danger'}
                            onClick={() => reviewMutation.mutate()}
                            isLoading={reviewMutation.isPending}
                            disabled={!comment.trim()}
                        >
                            Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProjectList;
