import { useState } from 'react'
import { useCreateTask } from '../hooks/useTasks'
import type { CreateTaskPayload } from '../types'

export default function TaskForm({ onSuccess }: { onSuccess: () => void }) {
    const create = useCreateTask()
    const [form, setForm] = useState<CreateTaskPayload>({
        title: '', description: '', priority: 'medium', dueDate: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await create.mutateAsync(form)
            onSuccess()
        } catch (err) {
            alert((err as Error).message)
        }
    }

    return (
        <form onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
            <h2 className="font-medium text-gray-800 mb-4">New Task</h2>
            <div className="grid gap-3">
                <input
                    required
                    placeholder="Task title *"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-400" />

                <textarea
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />

                <div className="grid grid-cols-2 gap-3">
                    <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <input
                        required
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                <button type="submit" disabled={create.isPending}
                    className="bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium
            hover:bg-indigo-700 transition-colors disabled:opacity-50">
                    {create.isPending ? 'Creating...' : 'Create Task'}
                </button>
            </div>
        </form>
    )
}