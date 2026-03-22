import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useToggleStatus, useDeleteTask } from '../hooks/useTasks'
import TaskEditModal from './TaskEditModal'
import type { Task } from '../types'

const priorityConfig = {
    high: { label: 'High', cls: 'bg-red-100 text-red-700' },
    medium: { label: 'Medium', cls: 'bg-yellow-100 text-yellow-700' },
    low: { label: 'Low', cls: 'bg-green-100 text-green-700' },
}

function isOverdue(task: Task): boolean {
    return task.status === 'pending' && new Date(task.dueDate) < new Date()
}

export default function TaskCard({ task }: { task: Task }) {
    const [showEdit, setShowEdit] = useState(false)
    const toggle = useToggleStatus()
    const remove = useDeleteTask()
    const overdue = isOverdue(task)
    const pConfig = priorityConfig[task.priority]

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : undefined,
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={`bg-white rounded-xl border p-4 shadow-sm transition-all
          ${task.status === 'completed' ? 'opacity-60' : ''}
          ${overdue ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}
          ${isDragging ? 'shadow-lg' : ''}`}>

                <div className="flex items-start gap-2">
                    {/* Drag Handle */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab
              active:cursor-grabbing touch-none shrink-0"
                        title="Drag to reorder">
                        ⣿
                    </button>

                    <div className="flex-1 min-w-0">
                        {/* Title + Priority */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className={`font-medium text-sm text-gray-900 leading-snug
                ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                                {task.title}
                            </h3>
                            <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${pConfig.cls}`}>
                                {pConfig.label}
                            </span>
                        </div>

                        {/* Description */}
                        {task.description && (
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                        )}

                        {/* Date + Status badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${overdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                {overdue ? '⚠ Overdue' : '📅'} {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full
                ${task.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-indigo-100 text-indigo-700'}`}>
                                {task.status === 'completed' ? '✓ Done' : '○ Pending'}
                            </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => toggle.mutate(task.id)}
                                disabled={toggle.isPending}
                                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700
                  hover:bg-indigo-100 transition-colors disabled:opacity-50 font-medium">
                                {task.status === 'pending' ? 'Mark Done' : 'Reopen'}
                            </button>

                            {/* Edit button — NAYA */}
                            <button
                                onClick={() => setShowEdit(true)}
                                className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700
                  hover:bg-gray-100 transition-colors font-medium">
                                ✎ Edit
                            </button>

                            <button
                                onClick={() => remove.mutate(task.id)}
                                disabled={remove.isPending}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600
                  hover:bg-red-100 transition-colors disabled:opacity-50 font-medium">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEdit && (
                <TaskEditModal task={task} onClose={() => setShowEdit(false)} />
            )}
        </>
    )
}