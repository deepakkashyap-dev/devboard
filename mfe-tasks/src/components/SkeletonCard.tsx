export default function SkeletonCard() {
    return (
        <div className="animate-pulse bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-5 bg-gray-200 rounded-full w-16" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-4/5 mb-4" />
            <div className="flex gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-14" />
                <div className="h-5 bg-gray-200 rounded-full w-20" />
            </div>
        </div>
    )
}