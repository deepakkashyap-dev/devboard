import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { useStats } from './hooks/useStats'
import StatCard from './components/StatCard'
import TaskChart from './components/TaskChart'
import './index.css'

const queryClient = new QueryClient()

function DashboardApp() {
  const { data: stats, isLoading, isError, dataUpdatedAt } = useStats()
  const qc = useQueryClient()

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="p-6 text-center text-red-500">
        ⚠ Failed to load dashboard stats
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Updated {new Date(dataUpdatedAt).toLocaleTimeString()}
          </span>
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ['stats'] })}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200
              text-gray-600 rounded-lg transition-colors font-medium">
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total"     value={stats.total}     icon="📋" color="blue"   />
        <StatCard label="Completed" value={stats.completed} icon="✅" color="green"  />
        <StatCard label="Pending"   value={stats.pending}   icon="🕐" color="yellow" />
        <StatCard label="Overdue"   value={stats.overdue}   icon="⚠" color="red"    />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Task Distribution</h2>
        <TaskChart stats={stats} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardApp />
    </QueryClientProvider>
  )
}