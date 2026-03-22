import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

const TasksApp = lazy(() => import('mfeTasks/App'))
const DashboardApp = lazy(() => import('mfeDashboard/App'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[300px] text-gray-400">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent
          rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading module...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={
              <ErrorBoundary name="Dashboard">
                <Suspense fallback={<LoadingFallback />}>
                  <DashboardApp />
                </Suspense>
              </ErrorBoundary>
            } />

            <Route path="/tasks" element={
              <ErrorBoundary name="Tasks">
                <Suspense fallback={<LoadingFallback />}>
                  <TasksApp />
                </Suspense>
              </ErrorBoundary>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}