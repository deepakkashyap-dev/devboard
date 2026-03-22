import {
    PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts'
import type { Stats } from '../api/stats'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b']

export default function TaskChart({ stats }: { stats: Stats }) {
    const data = [
        { name: 'Completed', value: stats.completed },
        { name: 'Pending', value: stats.pending - stats.overdue },
        { name: 'Overdue', value: stats.overdue },
    ].filter((d) => d.value > 0)

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                No data to display
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={3} dataKey="value">
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} tasks`]} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}