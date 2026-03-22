import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import TaskFilter from './components/TaskFilter'
import type { FilterType } from './types'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } }
})

function TasksApp() {
  const [filter, setFilter] = useState<FilterType>('all')
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My Tasks</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg
            hover:bg-indigo-700 transition-colors font-medium">
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && <TaskForm onSuccess={() => setShowForm(false)} />}
      <TaskFilter filter={filter} onChange={setFilter} />
      <TaskList filter={filter} />
    </div>
  )
}

// QueryClientProvider yahan wrap karo — shell se independent rehta hai
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TasksApp />
    </QueryClientProvider>
  )
}