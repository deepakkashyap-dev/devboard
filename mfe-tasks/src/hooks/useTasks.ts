import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks'
import type { Task, FilterType, CreateTaskPayload, UpdateTaskPayload } from '../types'

const QUERY_KEY = 'tasks'

export function useTasks(filter: FilterType, page: number) {
    const status = filter === 'all' ? undefined : filter
    return useQuery({
        queryKey: [QUERY_KEY, filter, page],
        queryFn: () => tasksApi.getAll(status, page, 10),
        staleTime: 30_000,
        placeholderData: (prev) => prev,
    })
}

export function useCreateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateTaskPayload) => tasksApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    })
}

export function useUpdateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
            tasksApi.update(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    })
}

export function useToggleStatus() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => tasksApi.toggleStatus(id),
        // Optimistic update
        onMutate: async (id: string) => {
            await qc.cancelQueries({ queryKey: [QUERY_KEY] })
            const prev = qc.getQueriesData({ queryKey: [QUERY_KEY] })
            qc.setQueriesData<any>({ queryKey: [QUERY_KEY] }, (old: any) => {
                if (!old?.tasks) return old
                return {
                    ...old,
                    tasks: old.tasks.map((t: Task) =>
                        t.id === id
                            ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' }
                            : t
                    ),
                }
            })
            return { prev }
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.prev) {
                ctx.prev.forEach(([key, data]: any) => qc.setQueryData(key, data))
            }
        },
        onSettled: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    })
}

export function useDeleteTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => tasksApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    })
}