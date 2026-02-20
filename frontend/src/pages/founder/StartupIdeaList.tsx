import { useState } from 'react';
import { useIdeas } from '../../hooks/useIdeas';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Pagination } from '../../components/ui/Pagination';
import { Select } from '../../components/ui/Select';
import { PlusCircle, Search, Edit2, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import type { IProjectIdea } from '../../types';

const StartupIdeaList = () => {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>('');
    const [search, setSearch] = useState('');

    const queryParams = {
        page,
        limit: 10,
        ...(status && { status }),
        ...(search && { search }),
    };

    const { ideas: response, isLoading, deleteIdea } = useIdeas(queryParams);

    const ideas = (response as any)?.data || (Array.isArray(response) ? response : []);
    const pagination = (response as any)?.pagination || {};
    const totalPages = pagination.pages || 1;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this idea? This action cannot be undone.')) {
            deleteIdea(id);
        }
    };

    return (
        <div className="space-y-6 pb-24">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Link to="/founder">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Startup Ideas</h1>
                </div>
                <Link to="/founder/submit">
                    <Button>
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Submit New Idea
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search ideas..."
                        className="pl-10"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        options={[
                            { value: '', label: 'All Status' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'approved', label: 'Approved' },
                            { value: 'rejected', label: 'Rejected' },
                        ]}
                        value={status}
                        onChange={handleStatusChange}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center">
                                        <div className="flex justify-center"><Loader size="lg" /></div>
                                    </td>
                                </tr>
                            ) : ideas.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        No ideas found.
                                    </td>
                                </tr>
                            ) : (
                                ideas.map((idea: IProjectIdea) => (
                                    <tr key={idea._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/founder/projects/${idea._id}`} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                                                {idea.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(idea.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={
                                                idea.status === 'approved' ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800' :
                                                    idea.status === 'rejected' ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800' :
                                                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
                                            }>
                                                {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link to={`/founder/projects/${idea._id}`}>
                                                <Button size="sm" variant="ghost" title="View Details">
                                                    <Eye className="w-4 h-4 text-blue-600" />
                                                </Button>
                                            </Link>

                                            {idea.status === 'pending' && (
                                                <>
                                                    <Link to={`/founder/ideas/${idea._id}/edit`}>
                                                        <Button size="sm" variant="ghost" title="Edit Idea">
                                                            <Edit2 className="w-4 h-4 text-yellow-600" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        title="Delete Idea"
                                                        onClick={() => handleDelete(idea._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};

export default StartupIdeaList;
