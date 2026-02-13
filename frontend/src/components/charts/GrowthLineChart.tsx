import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface GrowthChartProps {
    userGrowth: { _id: number; count: number }[];
    projectGrowth: { _id: number; count: number }[];
}

export default function GrowthLineChart({ userGrowth, projectGrowth }: GrowthChartProps) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Merge data
    const allMonths = Array.from(new Set([
        ...userGrowth.map(d => d._id),
        ...projectGrowth.map(d => d._id)
    ])).sort((a, b) => a - b);

    const data = allMonths.map(m => ({
        name: months[m - 1],
        users: userGrowth.find(d => d._id === m)?.count || 0,
        projects: projectGrowth.find(d => d._id === m)?.count || 0,
    }));

    return (
        <div className="w-full">
            <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Platform Growth (Last 6 Months)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%" debounce={200}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" stroke="#4f46e5" activeDot={{ r: 8 }} name="New Users" />
                        <Line type="monotone" dataKey="projects" stroke="#ec4899" name="New Projects" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
