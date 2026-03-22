interface BadgeProps {
    label: string
    color: 'green' | 'yellow' | 'red' | 'gray' | 'orange'
}

const colors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-600',
    orange: 'bg-orange-100 text-orange-800',
}

export default function Badge({ label, color }: BadgeProps) {
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
            {label}
        </span>
    )
}