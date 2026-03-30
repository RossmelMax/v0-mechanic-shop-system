'use client'

import { useClients } from '@/hooks/use-clients'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, FileText, ShoppingCart, Package, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const { clients } = useClients()

  const stats = [
    {
      label: 'Clientes Totales',
      value: clients.length,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Cotizaciones',
      value: '0',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Órdenes Activas',
      value: '0',
      icon: ShoppingCart,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Productos',
      value: '0',
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido al sistema de gestión del taller mecánico
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg border p-6 space-y-2"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/clients" className="block">
            <Button variant="outline" className="w-full justify-start h-auto py-6">
              <div className="flex flex-col gap-2 items-start">
                <Users className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Gestionar Clientes</p>
                  <p className="text-xs text-gray-600">Ver y crear clientes</p>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/quotations" className="block">
            <Button variant="outline" className="w-full justify-start h-auto py-6">
              <div className="flex flex-col gap-2 items-start">
                <FileText className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Nueva Cotización</p>
                  <p className="text-xs text-gray-600">Crear presupuesto</p>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/faults" className="block">
            <Button variant="outline" className="w-full justify-start h-auto py-6">
              <div className="flex flex-col gap-2 items-start">
                <TrendingUp className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Base de Fallas</p>
                  <p className="text-xs text-gray-600">Consultar jurisprudencia</p>
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-2">
        <h3 className="font-semibold text-blue-900">Información del Sistema</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Sistema de gestión completo para talleres mecánicos</li>
          <li>✓ Base de datos local SQLite (escalable a PostgreSQL)</li>
          <li>✓ Registro de clientes y vehículos</li>
          <li>✓ Sistema de cotizaciones y diagnósticos avanzados</li>
          <li>✓ Base de fallas con búsqueda full-text</li>
          <li>✓ Gestión de órdenes y ventas</li>
        </ul>
      </div>
    </div>
  )
}
