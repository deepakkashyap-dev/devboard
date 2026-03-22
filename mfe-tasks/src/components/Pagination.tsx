interface Props {
    page: number
    totalPages: number
    total: number
    limit: number
    onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, total, limit, onChange }: Props) {
    if (totalPages <= 1) return null

    const start = (page - 1) * limit + 1
    const end = Math.min(page * limit, total)

    return (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
                Showing {start}–{end} of {total} tasks
            </span>

            <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600
            hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors font-medium">
                    ← Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | '...')[]>((acc, p, i, arr) => {
                        if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...')
                        acc.push(p)
                        return acc
                    }, [])
                    .map((p, i) =>
                        p === '...' ? (
                            <span key={`dots-${i}`} className="px-2 text-xs text-gray-400">…</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onChange(p as number)}
                                className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors
                  ${page === p
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {p}
                            </button>
                        )
                    )}

                {/* Next */}
                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-600
            hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors font-medium">
                    Next →
                </button>
            </div>
        </div>
    )
}