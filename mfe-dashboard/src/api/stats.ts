export interface Stats {
    total: number
    completed: number
    pending: number
    overdue: number
}

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function fetchStats(): Promise<Stats> {
    const res = await fetch(`${BASE}/api/tasks/stats`)
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
}