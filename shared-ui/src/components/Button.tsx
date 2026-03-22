import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'ghost'
    size?: 'sm' | 'md'
}

export default function Button({
    variant = 'primary', size = 'md', className = '', children, ...props
}: ButtonProps) {
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50'
    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' }
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100',
        ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    }
    return (
        <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    )
}