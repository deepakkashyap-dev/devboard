import type { FilterType } from '../types'

const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
]

export default function TaskFilter({
    filter, onChange
}: { filter: FilterType; onChange: (f: FilterType) => void }) {
    return (
        <div className="flex gap-2 mb-5">
            {filters.map((f) => (
                <button
                    key={f.value}
                    onClick={() => onChange(f.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors
            ${filter === f.value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {f.label}
                </button>
            ))}
        </div>
    )
}