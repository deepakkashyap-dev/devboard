import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskFilter from '../components/TaskFilter'

describe('TaskFilter Component', () => {
    it('teenon filter buttons render hon', () => {
        render(<TaskFilter filter="all" onChange={vi.fn()} />)

        expect(screen.getByText('All')).toBeInTheDocument()
        expect(screen.getByText('Pending')).toBeInTheDocument()
        expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('active filter button highlighted ho', () => {
        render(<TaskFilter filter="pending" onChange={vi.fn()} />)

        const pendingBtn = screen.getByText('Pending')
        expect(pendingBtn).toHaveClass('bg-indigo-600')
    })

    it('filter click karne pe onChange call ho', () => {
        const mockOnChange = vi.fn()
        render(<TaskFilter filter="all" onChange={mockOnChange} />)

        fireEvent.click(screen.getByText('Completed'))
        expect(mockOnChange).toHaveBeenCalledWith('completed')
    })

    it('all filter by default active ho', () => {
        render(<TaskFilter filter="all" onChange={vi.fn()} />)

        const allBtn = screen.getByText('All')
        expect(allBtn).toHaveClass('bg-indigo-600')
    })
})