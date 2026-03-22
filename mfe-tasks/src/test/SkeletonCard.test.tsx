import { describe, it, expect } from 'vitest'
import { render, container } from '@testing-library/react'
import SkeletonCard from '../components/SkeletonCard'

describe('SkeletonCard Component', () => {
    it('render hota hai without crash', () => {
        const { container } = render(<SkeletonCard />)
        expect(container.firstChild).toBeTruthy()
    })

    it('animate-pulse class honi chahiye', () => {
        const { container } = render(<SkeletonCard />)
        expect(container.firstChild).toHaveClass('animate-pulse')
    })
})