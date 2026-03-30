'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FileText,
  BarChart3,
  AlertCircle,
} from 'lucide-react'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/clients',
    label: 'Clientes',
    icon: Users,
  },
  {
    href: '/quotations',
    label: 'Cotizaciones',
    icon: FileText,
  },
  {
    href: '/orders',
    label: 'Órdenes',
    icon: ShoppingCart,
  },
  {
    href: '/products',
    label: 'Productos',
    icon: Package,
  },
  {
    href: '/faults',
    label: 'Base de Fallas',
    icon: AlertCircle,
  },
  {
    href: '/sales',
    label: 'Ventas',
    icon: BarChart3,
  },
  {
    href: '/reports',
    label: 'Reportes',
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen overflow-y-auto fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold">🔧 Taller Mecánico</h1>
        <p className="text-gray-400 text-sm mt-1">Sistema de Gestión</p>
      </div>

      <nav className="space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          <p>Sistema Local</p>
          <p className="mt-1">Versión 1.0</p>
        </div>
      </div>
    </aside>
  )
}
