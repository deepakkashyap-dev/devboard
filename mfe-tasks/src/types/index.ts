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