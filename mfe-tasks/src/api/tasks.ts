import type { Task, CreateTaskPayload } from '../types'

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(err.detail ?? 'Request failed')
    }
    return res.json()
}

export const tasksApi = {
    getAll: (status?: string) =>
        request<Task[]>(`/api/tasks/${status ? `?status=${status}` : ''}`),

    create: (data: CreateTaskPayload) =>
        request<Task>('/api/tasks/', { method: 'POST', body: JSON.stringify(data) }),

    toggleStatus: (id: string) =>
        request<Task>(`/api/tasks/${id}/status`, { method: 'PATCH' }),

    update: (id: string, data: Partial<CreateTaskPayload>) =>
        request<Task>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    delete: (id: string) =>
        request<{ message: string }>(`/api/tasks/${id}`, { method: 'DELETE' }),
}