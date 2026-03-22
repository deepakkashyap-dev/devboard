interface StatCardProps {
    label: string
    value: number
    icon: string
    color: 'blue' | 'green' | 'yellow' | 'red'
}

const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
    return (
        <div className={`rounded-xl border p-5 ${colors[color]}`}>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium opacity-80">{label}</span>
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-3xl font-semibold">{value}</p>
        </div>
    )
}