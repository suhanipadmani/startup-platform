import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/axios';
import { getSystemStats, getGrowthStats } from '../../api/analytics';
import StatusBadge from '../../components/StatusBadge';
import GrowthLineChart from '../../components/charts/GrowthLineChart';
import ProjectStatusChart from '../../components/charts/ProjectStatusChart';
import { Check, X, Clock, Users, FileText, TrendingUp } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

export default function AdminDashboard() {
    const { socket } = useSocket();
    const [ideas, setIdeas] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [growth, setGrowth] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'reviewed'>('pending');

    const load = () => {
        setLoading(true);
        Promise.all([
            api.get('/admin/projects'),
            getSystemStats(),
            getGrowthStats()
        ])
            .then(([resProjects, resStats, resGrowth]) => {
                setIdeas(resProjects.data);
                setStats(resStats);
                setGrowth(resGrowth);
            })
            .catch(() => toast.error('Failed to load dashboard data'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();

        if (socket) {
            socket.on('project:created', () => {
                toast('New project received!', { icon: '🔔' });
                load();
            });
        }

        return () => {
            if (socket) socket.off('project:created');
        };
    }, [socket]);

    const review = async (id: string, action: 'approve' | 'reject') => {
        const comment = prompt(`Enter reason for ${action}ing this idea: `);
        if (comment === null) return;

        try {
            await api.put(`/admin/projects/${id}/${action}`, { comment });
            if (action === 'approve') {
                toast.success(`Idea approved successfully`);
            } else {
                toast.success(`Idea rejected successfully`);
            }
            load();
        } catch (err: any) {
            toast.error('Action failed');
        }
    };

    const filteredIdeas = ideas.filter(i =>
        filter === 'pending' ? i.status === 'pending' : i.status !== 'pending'
    );

    if (loading && !stats) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Analytics Section */}
                {stats && (
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Platform Analytics
                        </h2>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
                                <div className="p-3 bg-indigo-100 rounded-full mr-4">
                                    <Users className="text-indigo-600 w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.users.total}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
                                <div className="p-3 bg-pink-100 rounded-full mr-4">
                                    <Users className="text-pink-600 w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Founders</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.users.founders}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
                                <div className="p-3 bg-purple-100 rounded-full mr-4">
                                    <FileText className="text-purple-600 w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Projects</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.projects.total}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-full mr-4">
                                    <Clock className="text-yellow-600 w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pending Review</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.projects.pending}</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 lg:col-span-2">
                                {growth && (
                                    <GrowthLineChart
                                        userGrowth={growth.userGrowth}
                                        projectGrowth={growth.projectGrowth}
                                    />
                                )}
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex flex-col items-center">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">Project Status</h3>
                                <div className="w-full max-w-xs">
                                    <ProjectStatusChart stats={stats.projects} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setFilter('pending')}
                            className={`${filter === 'pending'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Pending Review ({ideas.filter(i => i.status === 'pending').length})
                        </button>
                        <button
                            onClick={() => setFilter('reviewed')}
                            className={`${filter === 'reviewed'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Reviewed History
                        </button>
                    </nav>
                </div>

                <div className="space-y-6">
                    {filteredIdeas.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
                            <p className="text-gray-500">No {filter} ideas found.</p>
                        </div>
                    ) : (
                        filteredIdeas.map((idea) => (
                            <div key={idea._id} className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-100">
                                <div className="px-4 py-5 sm:px-6 flex justify-between items-start bg-gray-50">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{idea.title}</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Submitted by: {idea.founderId?.name} ({idea.founderId?.email})
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <StatusBadge status={idea.status} />
                                        <span className="ml-4 text-xs text-gray-400 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(idea.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Problem Statement</dt>
                                            <dd className="mt-1 text-sm text-gray-900 border-l-2 border-gray-200 pl-4 bg-gray-50 p-2 rounded-r">
                                                {idea.problemStatement}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-gray-500">Proposed Solution</dt>
                                            <dd className="mt-1 text-sm text-gray-900 border-l-2 border-gray-200 pl-4 bg-gray-50 p-2 rounded-r">
                                                {idea.solution}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Target Market</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{idea.targetMarket}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">Tech Stack</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {Array.isArray(idea.techStack) ? idea.techStack.join(', ') : idea.techStack}
                                            </dd>
                                        </div>

                                        {idea.adminComment && (
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-gray-500">Admin Comment</dt>
                                                <dd className="mt-1 text-sm text-gray-900 italic bg-yellow-50 p-2 rounded border border-yellow-100">
                                                    {idea.adminComment}
                                                </dd>
                                            </div>
                                        )}
                                    </div>

                                    {idea.status === 'pending' && (
                                        <div className="mt-8 flex justify-end space-x-3 border-t pt-4">
                                            <button
                                                onClick={() => review(idea._id, 'reject')}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            >
                                                <X className="mr-2 h-4 w-4" />
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => review(idea._id, 'approve')}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                <Check className="mr-2 h-4 w-4" />
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
