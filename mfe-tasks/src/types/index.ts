export interface Task {
    id: string
    title: string
    description?: string
    status: 'pending' | 'completed'
    priority: 'low' | 'medium' | 'high'
    dueDate: string
    createdAt: string
    isDeleted: boolean
}

export type FilterType = 'all' | 'pending' | 'completed'

export interface CreateTaskPayload {
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high'
    dueDate: string
}

export interface UpdateTaskPayload {
    title?: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    dueDate?: string
    status?: 'pending' | 'completed'
}

export interface PaginatedResponse {
    tasks: Task[]
    total: number
    page: number
    limit: number
    totalPages: number
}