import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; name: string }
interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, message: '' }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, message: error.message }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
                    <p className="text-4xl mb-3">⚠</p>
                    <p className="font-medium text-gray-800 mb-1">
                        Failed to load {this.props.name}
                    </p>
                    <p className="text-sm text-gray-500">{this.state.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, message: '' })}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                        Retry
                    </button>
                </div>
            )
        }
        return this.props.children
    }
}