import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { PlusCircle, FileText, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { useIdeaStats } from '../../hooks/useIdeaStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const FounderDashboard = () => {
    const { stats, isLoading } = useIdeaStats();

    if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

    const statCards = [
        { label: 'Total Ideas', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Founder Dashboard</h1>
                <Link to="/founder/submit">
                    <Button>
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Submit New Idea
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Idea Status Distribution</h2>
                    </div>
                    <div className="p-0 sm:p-6">
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={[
                                        { name: 'Pending', value: stats.pending, fill: '#CA8A04' },
                                        { name: 'Approved', value: stats.approved, fill: '#16A34A' },
                                        { name: 'Rejected', value: stats.rejected, fill: '#DC2626' },
                                    ]}
                                    margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50} >
                                        {
                                            [
                                                { name: 'Pending', value: stats.pending, fill: '#CA8A04' },
                                                { name: 'Approved', value: stats.approved, fill: '#16A34A' },
                                                { name: 'Rejected', value: stats.rejected, fill: '#DC2626' },
                                            ].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Startup Ideas</h2>
                    <Link to="/founder/ideas">
                        <Button variant="ghost" className="text-blue-500 hover:text-blue-700">
                            View All Ideas <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
                <p className="text-gray-500">
                    Manage and track the status of your submitted startup ideas. Click "View All Ideas" to see the full list.
                </p>
            </div>
        </div>
    );
};

export default FounderDashboard;
