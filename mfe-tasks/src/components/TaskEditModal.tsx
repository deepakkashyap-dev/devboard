import { useState, useEffect } from 'react'
import { useUpdateTask } from '../hooks/useTasks'
import type { Task, UpdateTaskPayload } from '../types'

interface Props {
    task: Task
    onClose: () => void
}

export default function TaskEditModal({ task, onClose }: Props) {
    const update = useUpdateTask()
    const [form, setForm] = useState<UpdateTaskPayload>({
        title: task.title,
        description: task.description ?? '',
        priority: task.priority,
        dueDate: task.dueDate.split('T')[0],
    })

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await update.mutateAsync({ id: task.id, data: form })
            onClose()
        } catch (err) {
            alert((err as Error).message)
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>

            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-gray-900 text-base">Edit Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-3">
                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Title *</label>
                        <input
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Priority</label>
                            <select
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-400">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Due Date</label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 text-sm rounded-lg bg-gray-100 text-gray-600
                hover:bg-gray-200 transition-colors font-medium">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={update.isPending}
                            className="flex-1 py-2 text-sm rounded-lg bg-indigo-600 text-white
                hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50">
                            {update.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}