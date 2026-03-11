import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ideaService } from '../../services/idea.service';
import { useIdea } from '../../hooks/useIdeas';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { showToast } from '../../utils/toast';
import { ArrowLeft, Calendar, Code, Target, FileText, Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const AdminProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: idea, isLoading, error } = useIdea(id!);

    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [comment, setComment] = useState('');

    const reviewMutation = useMutation({
        mutationFn: async () => {
            if (!idea || !action) return;
            if (action === 'approve') {
                return ideaService.approveIdea(idea._id, comment);
            } else if (action === 'reject') {
                return ideaService.rejectIdea(idea._id, comment);
            }
        },
        onSuccess: () => {
            showToast.success(`Action processed successfully`);
            queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
            queryClient.invalidateQueries({ queryKey: ['idea', id] });
            closeActionModal();
            navigate('/admin');
        },
        onError: () => {
            showToast.error('Failed to update project status');
        }
    });

    const openActionModal = (actionType: 'approve' | 'reject') => {
        setAction(actionType);
        setComment('');
    };

    const closeActionModal = () => {
        setAction(null);
        setComment('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
            <div className="mb-6">
                <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-blue-600" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            {isLoading ? (
                                <div className="animate-pulse space-y-2">
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                </div>
                            ) : idea ? (
                                <>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                                            {idea.title}
                                        </h1>
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-xs font-medium w-fit",
                                            idea.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                idea.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                        )}>
                                            {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-3 flex items-center text-sm text-gray-500">
                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        <span>Submitted on {new Date(idea.createdAt).toLocaleDateString()}</span>
                                        <span className="mx-2">•</span>
                                        <span>By {(idea.founderId && typeof idea.founderId === 'object' && 'name' in idea.founderId)
                                            ? (idea.founderId as any).name
                                            : 'Unknown Founder'}</span>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {!isLoading && idea?.status === 'pending' && (
                            <div className="flex justify-end space-x-3 sm:mt-0 mt-4">
                                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => openActionModal('reject')}>
                                    <X className="w-4 h-4 mr-1" /> Reject
                                </Button>
                                <Button variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => openActionModal('approve')}>
                                    <Check className="w-4 h-4 mr-1" /> Approve
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200">
                    <Loader size="lg" />
                </div>
            ) : idea ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Summary Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Target Market</h4>
                                <p className="text-lg font-semibold text-gray-900">{idea.targetMarket}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Pitch Deck</h4>
                                {idea.pitchDeckUrl ? (
                                    <a
                                        href={`http://localhost:5000${idea.pitchDeckUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <FileText className="w-4 h-4 mr-1" /> View PDF
                                    </a>
                                ) : (
                                    <p className="text-gray-400">Not uploaded</p>
                                )}
                            </div>
                        </div>

                        {/* Team Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
                            <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                Team Details
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{idea.teamDetails}</p>
                        </div>
                        {/* Problem Statement */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                            <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                Problem Statement
                            </h3>
                            <div className="prose prose-sm text-gray-600 flex-grow">
                                <p className="leading-relaxed whitespace-pre-wrap">{idea.problemStatement}</p>
                            </div>
                        </div>

                        {/* Solution */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                            <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                Proposed Solution
                            </h3>
                            <div className="prose prose-sm text-gray-600 flex-grow">
                                <p className="leading-relaxed whitespace-pre-wrap">{idea.solution}</p>
                            </div>
                        </div>

                        {/* Target Market */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-1">
                            <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                                <div className="bg-red-100 p-2 rounded-lg mr-3">
                                    <Target className="w-5 h-5 text-red-600" />
                                </div>
                                Target Market
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{idea.targetMarket}</p>
                        </div>

                        {/* Tech Stack */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-1">
                            <h3 className="text-base font-semibold text-gray-900 flex items-center mb-4">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Code className="w-5 h-5 text-purple-600" />
                                </div>
                                Technology Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {idea.techStack.map(tech => (
                                    <span key={tech} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Admin Dashboard */}
                    {idea.status !== 'pending' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
                            <div className="p-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Review Result</h3>
                                <div className={cn(
                                    "p-4 rounded-lg border",
                                    idea.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                                )}>
                                    <p className={cn(
                                        "font-semibold mb-2",
                                        idea.status === 'approved' ? 'text-green-800' : 'text-red-800'
                                    )}>
                                        This project was {idea.status} on {new Date(idea.updatedAt!).toLocaleDateString()}.
                                    </p>
                                    {idea.adminComment && (
                                        <div className="mt-3 text-sm text-gray-700">
                                            <strong className="block text-gray-900 mb-1">Feedback provided:</strong>
                                            <p className="whitespace-pre-wrap leading-relaxed">{idea.adminComment}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Modal (Approve/Reject confirmation) */}
                    <Modal
                        isOpen={!!action}
                        onClose={closeActionModal}
                        title={
                            action === 'approve' ? 'Approve Project' : 'Reject Project'
                        }
                    >
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 break-words">
                                You are about to {action?.replace('-', ' ')} <strong>{idea.title}</strong>. Please provide a comment for the founder.
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
                                    variant={
                                        action === 'approve' ? 'primary' : 'danger'
                                    }
                                    onClick={() => reviewMutation.mutate()}
                                    isLoading={reviewMutation.isPending}
                                    disabled={!comment.trim()}
                                >
                                    Confirm {
                                        action === 'approve' ? 'Approval' : 'Rejection'
                                    }
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </>
            ) : !isLoading && (error || !idea) && (
                <div className="flex flex-col items-center justify-center h-96 text-center px-4">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-500 mb-6 max-w-md">
                        The project you are looking for does not exist or has been removed.
                    </p>
                    <Link to="/admin">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminProjectDetails;
