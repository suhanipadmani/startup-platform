import { useParams, Link } from 'react-router-dom';
import { useIdea } from '../../hooks/useIdeas';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Calendar, Code, Target, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';

import { AxiosError } from 'axios';

const ProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { data: idea, isLoading, error } = useIdea(id!);

    if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

    if (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.status === 404) {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-center px-4">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-500 mb-6 max-w-md">
                        {axiosError.response.data?.message || "The project you are looking for does not exist or has been removed."}
                    </p>
                    <Link to="/founder">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            );
        }
        return <div className="text-center text-red-500 mt-10">Error loading project details.</div>;
    }

    if (!idea) return null;
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/founder">
                    <Button variant="ghost" size="sm" className="pl-0 hover:bg-transparent hover:text-blue-600">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                {/* Admin Feedback */}
                {idea.adminComment && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Admin Feedback</h3>
                            <div className={cn(
                                "p-4 rounded-lg border flex items-start",
                                idea.status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' :
                                    idea.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' :
                                        'bg-gray-50 border-gray-200 text-gray-800'
                            )}>
                                <span className="text-sm leading-relaxed">{idea.adminComment}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
