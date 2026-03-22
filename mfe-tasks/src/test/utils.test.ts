import { describe, it, expect } from 'vitest'
import type { Task } from '../types'

function isOverdue(task: Task): boolean {
    return task.status === 'pending' && new Date(task.dueDate) < new Date()
}

function getPriorityLabel(priority: 'low' | 'medium' | 'high'): string {
    const labels = { low: 'Low', medium: 'Medium', high: 'High' }
    return labels[priority]
}

const mockTask = (overrides: Partial<Task> = {}): Task => ({
    id: '123',
    title: 'Test Task',
    description: 'Test description',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isDeleted: false,
    ...overrides,
})

// ─── isOverdue tests ───────────────────────────────────────
describe('isOverdue()', () => {
    it('past due date + pending = overdue', () => {
        const task = mockTask({
            status: 'pending',
            dueDate: '2020-01-01T00:00:00.000Z', // past date
        })
        expect(isOverdue(task)).toBe(true)
    })

    it('past due date + completed = NOT overdue', () => {
        const task = mockTask({
            status: 'completed',
            dueDate: '2020-01-01T00:00:00.000Z',
        })
        expect(isOverdue(task)).toBe(false)
    })

    it('future due date + pending = NOT overdue', () => {
        const task = mockTask({
            status: 'pending',
            dueDate: '2099-01-01T00:00:00.000Z', // future date
        })
        expect(isOverdue(task)).toBe(false)
    })

    it('completed task is never overdue', () => {
        const task = mockTask({ status: 'completed' })
        expect(isOverdue(task)).toBe(false)
    })
})

// ─── getPriorityLabel tests ────────────────────────────────
describe('getPriorityLabel()', () => {
    it('low priority label sahi ho', () => {
        expect(getPriorityLabel('low')).toBe('Low')
    })
    it('medium priority label sahi ho', () => {
        expect(getPriorityLabel('medium')).toBe('Medium')
    })
    it('high priority label sahi ho', () => {
        expect(getPriorityLabel('high')).toBe('High')
    })
})