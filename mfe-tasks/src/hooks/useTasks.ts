import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks'
import type { Task, FilterType, CreateTaskPayload } from '../types'

const QUERY_KEY = 'tasks'

export function useTasks(filter: FilterType) {
    const status = filter === 'all' ? undefined : filter

    return useQuery<Task[]>({
        queryKey: [QUERY_KEY, filter],
        queryFn: () => tasksApi.getAll(status),
        staleTime: 30_000,
    })
}

export function useCreateTask() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateTaskPayload) => tasksApi.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
    })
}

export function useToggleStatus() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => tasksApi.toggleStatus(id),
        // Optimistic update — toggle immediately, rollback on error
        onMutate: async (id: string) => {
            await qc.cancelQueries({ queryKey: [QUERY_KEY] })
            const prev = qc.getQueriesData<Task[]>({ queryKey: [QUERY_KEY] })

            qc.setQueriesData<Task[]>({ queryKey: [QUERY_KEY] }, (old) =>
                old?.map((t) =>
                    t.id === id
                        ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' }
                        : t
                )
            )
            return { prev }
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.prev) {
                ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data))
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