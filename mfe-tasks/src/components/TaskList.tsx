import { useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable'
import { useTasks } from '../hooks/useTasks'
import TaskCard from './TaskCard'
import SkeletonCard from './SkeletonCard'
import Pagination from './Pagination'
import type { FilterType, Task } from '../types'

export default function TaskList({
    filter,
    page,
    onPageChange,
}: {
    filter: FilterType
    page: number
    onPageChange: (p: number) => void
}) {
    const { data, isLoading, isError, error } = useTasks(filter, page)
    const [localOrder, setLocalOrder] = useState<Task[] | null>(null)
    const tasks = localOrder ?? data?.tasks ?? []

    // useEffect(() => setLocalOrder(null), [filter, page]) — optional

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const currentTasks = localOrder ?? data?.tasks ?? []
        const oldIndex = currentTasks.findIndex((t) => t.id === active.id)
        const newIndex = currentTasks.findIndex((t) => t.id === over.id)
        setLocalOrder(arrayMove(currentTasks, oldIndex, newIndex))
    }

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
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {data && (
                <Pagination
                    page={data.page}
                    totalPages={data.totalPages}
                    total={data.total}
                    limit={data.limit}
                    onChange={(p) => {
                        setLocalOrder(null)
                        onPageChange(p)
                    }}
                />
            )}
        </>
    )
}