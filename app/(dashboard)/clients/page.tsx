'use client'

import { ClientsTable } from '@/components/clients/clients-table'

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-gray-600">
          Gestiona el registro de clientes y sus vehículos
        </p>
      </div>

      <ClientsTable />
    </div>
  )
}
