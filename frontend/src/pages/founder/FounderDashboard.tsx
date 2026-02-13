import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';
import { PlusCircle, Clock } from 'lucide-react';

export default function FounderDashboard() {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const fetchProjects = () => {
        setLoading(true);
        api.get(`/projects/my`, {
            params: {
                search: debouncedSearch,
                page,
                limit: 9
            }
        })
            .then(res => {
                setIdeas(res.data.projects);
                setTotalPages(res.data.totalPages);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchProjects();
    }, [debouncedSearch, page]);

    if (loading && page === 1 && !debouncedSearch) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Startup Ideas</h1>
                        <p className="mt-1 text-sm text-gray-500">Track the status of your submitted ideas</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative rounded-md shadow-sm w-full sm:w-64">
                            <input
                                type="text"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                        <Link
                            to="/founder/submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            New Idea
                        </Link>
                    </div>
                </div>

                {ideas.length === 0 && !loading ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
                        <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No ideas found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {search ? "Try adjusting your search terms." : "Get started by submitting your first startup idea."}
                        </p>
                        {!search && (
                            <div className="mt-6">
                                <Link
                                    to="/founder/submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                    Submit Idea
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {ideas.map((idea) => (
                                <div key={idea._id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col h-full">
                                    <div className="px-4 py-5 sm:p-6 flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 truncate flex-1 mr-2">
                                                <Link to={`/founder/projects/${idea._id}`} className="hover:text-indigo-600 block truncate">
                                                    {idea.title}
                                                </Link>
                                            </h3>
                                            <div className="flex-shrink-0">
                                                <StatusBadge status={idea.status} />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Problem</h4>
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{idea.problemStatement}</p>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Target Market</h4>
                                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{idea.targetMarket}</p>
                                        </div>

                                        {idea.adminComment && (
                                            <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                                <h4 className="text-xs font-semibold text-gray-500 flex items-center">
                                                    Admin Feedback
                                                </h4>
                                                <p className="mt-1 text-sm text-gray-700 italic line-clamp-2">"{idea.adminComment}"</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 sm:px-6 mt-auto">
                                        <div className="text-xs text-gray-500 flex items-center">
                                            <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                                            Submitted on {new Date(idea.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
