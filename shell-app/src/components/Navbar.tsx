import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
            <span className="font-semibold text-indigo-600 text-lg">DevBoard</span>
            <div className="flex gap-1">
                {[
                    { to: '/dashboard', label: '📊 Dashboard' },
                    { to: '/tasks', label: '✅ Tasks' },
                ].map(({ to, label }) => (
                    <NavLink key={to} to={to}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-600 hover:bg-gray-50'}`}>
                        {label}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}