import { useParams, Link } from 'react-router-dom';
import { useIdea } from '../../hooks/useIdeas';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Calendar, Code, FileText, Download, Upload } from 'lucide-react';
import { cn } from '../../utils/cn';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { showToast } from '../../utils/toast';
import { ideaService } from '../../services/idea.service';

/* Document Upload Component */
const DocumentUploadForm = ({ ideaId }: { ideaId: string }) => {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<{ name: string; document: FileList }>();
    const queryClient = useQueryClient();

    const onSubmit = async (data: { name: string; document: FileList }) => {
        if (!data.document?.[0]) return;
        try {
            await ideaService.uploadDocument(ideaId, data.name, data.document[0]);
            showToast.success('Document uploaded successfully');
            queryClient.invalidateQueries({ queryKey: ['idea', ideaId] });
            reset();
        } catch (err) {
            showToast.error('Failed to upload document');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <input
                        {...register('name')}
                        placeholder="Document Name (e.g., Team Resume)"
                        className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="relative">
                    <input
                        type="file"
                        {...register('document')}
                        required
                        className="block w-full text-xs text-gray-500
                            file:mr-3 file:py-2 file:px-3
                            file:rounded-md file:border-0
                            file:text-xs file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100 cursor-pointer"
                    />
                </div>
            </div>
            <Button type="submit" size="sm" isLoading={isSubmitting} className="w-full sm:w-auto">
                <Upload className="w-3 h-3 mr-2" /> Upload Document
            </Button>
        </form>
    );
};

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

                    {/* Tech Stack */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
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

                {/* Documents Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            Additional Documents
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {idea.documents && idea.documents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {idea.documents.map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm transition-all hover:bg-gray-100">
                                        <div className="flex items-center overflow-hidden">
                                            <div className="bg-white p-2 rounded border border-gray-200 mr-3">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`http://localhost:5000${doc.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm italic">No additional documents uploaded yet.</p>
                            </div>
                        )}

                        {/* Quick Upload Form */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Upload New Document</h4>
                            <DocumentUploadForm ideaId={idea._id} />
                        </div>
                    </div>
                </div>

                {/* Admin Feedback */}
                {idea.adminComment && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Admin Feedback</h3>
                            <div className={cn(
                                "p-4 rounded-lg border flex flex-col",
                                idea.status === 'approved' ? 'bg-green-50 border-green-200 text-green-800' :
                                    idea.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' :
                                        'bg-gray-50 border-gray-200 text-gray-800'
                            )}>
                                <span className="font-semibold mb-1">Feedback received on {new Date(idea.updatedAt).toLocaleDateString()}:</span>
                                <span className="text-sm leading-relaxed whitespace-pre-wrap">{idea.adminComment}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
