import { useTasks } from '../hooks/useTasks'
import TaskCard from './TaskCard'
import SkeletonCard from './SkeletonCard'
import type { FilterType } from '../types'

export default function TaskList({ filter }: { filter: FilterType }) {
    const { data: tasks, isLoading, isError, error } = useTasks(filter)

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-center py-12 text-red-500">
                <p className="text-lg">⚠ Failed to load tasks</p>
                <p className="text-sm mt-1">{(error as Error).message}</p>
            </div>
        )
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📋</p>
                <p className="font-medium">No tasks found</p>
                <p className="text-sm mt-1">Add a task above to get started</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
    )
}