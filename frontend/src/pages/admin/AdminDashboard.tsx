import { useQuery } from '@tanstack/react-query';
import { Loader } from '../../components/ui/Loader';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import apiInstance from '../../services/api';
import ProjectList from '../../components/admin/ProjectList';

const AdminDashboard = () => {
    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const res = await apiInstance.get('/admin/analytics/stats');
            return res.data;
        }
    });

    const { data: growth, isLoading: isLoadingGrowth } = useQuery({
        queryKey: ['admin', 'growth'],
        queryFn: async () => {
            const res = await apiInstance.get('/admin/analytics/growth');
            return res.data;
        }
    });

    if (isLoadingStats || isLoadingGrowth) {
        return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-blue-600', borderColor: 'border-blue-500' },
                    { label: 'Total Ideas', value: stats?.totalIdeas || 0, color: 'text-purple-600', borderColor: 'border-purple-500' },
                    { label: 'Pending Reviews', value: stats?.pendingIdeas || 0, color: 'text-yellow-600', borderColor: 'border-yellow-500' },
                    { label: 'Approved Ideas', value: stats?.approvedIdeas || 0, color: 'text-green-600', borderColor: 'border-green-500' },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${stat.borderColor} transition-all hover:shadow-md`}>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        User & Idea Growth
                        <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">All Time</span>
                    </h2>
                </div>
                <div className="p-0 sm:p-6">
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={Array.isArray(growth) ? growth : []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorIdeas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="ideas" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorIdeas)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pending Reviews Section */}
            <div>
                <ProjectList
                    initialStatus="pending"
                    title="Pending Reviews"
                    showFilters={false}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
