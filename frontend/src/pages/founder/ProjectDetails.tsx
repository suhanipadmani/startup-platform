import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, Clock, } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [idea, setIdea] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        api.get(`/projects/${id}`)
            .then(res => setIdea(res.data))
            .catch(err => {
                console.error(err);
                toast.error('Failed to load project details');
                navigate('/founder');
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!idea) return null;

    return (
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="mb-6">
                    <Link to="/founder" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-start bg-gray-50">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{idea.title}</h1>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                                Submitted on {new Date(idea.createdAt).toLocaleString()}
                            </div>
                        </div>
                        <StatusBadge status={idea.status} />
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Problem Statement</dt>
                                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded-md border border-gray-100">
                                    {idea.problemStatement}
                                </dd>
                            </div>

                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Proposed Solution</dt>
                                <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-4 rounded-md border border-gray-100">
                                    {idea.solution}
                                </dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Target Market</dt>
                                <dd className="mt-1 text-sm text-gray-900">{idea.targetMarket}</dd>
                            </div>

                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Technology Stack</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {Array.isArray(idea.techStack) ? idea.techStack.join(', ') : idea.techStack}
                                </dd>
                            </div>

                            {idea.adminComment && (
                                <div className="sm:col-span-2 mt-4">
                                    <dt className="text-sm font-medium text-gray-500">Admin Feedback</dt>
                                    <dd className="mt-1 text-sm text-gray-900 bg-yellow-50 p-4 rounded-md border border-yellow-100 italic">
                                        "{idea.adminComment}"
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}



