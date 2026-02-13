import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectStatusProps {
    stats: {
        pending: number;
        approved: number;
        rejected: number;
    };
}

export default function ProjectStatusChart({ stats }: ProjectStatusProps) {
    const data = [
        { name: 'Pending', value: stats.pending, color: '#FFCE56' },
        { name: 'Approved', value: stats.approved, color: '#4BC0C0' },
        { name: 'Rejected', value: stats.rejected, color: '#FF6384' },
    ];

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%" debounce={200}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
