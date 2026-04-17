'use client'

import { QuotationsTable } from '@/components/quotations/quotations-table'

export default function QuotationsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
        <p className="text-gray-600">
          Crea y gestiona las cotizaciones de los clientes
        </p>
      </div>

      <QuotationsTable />
    </div>
  )
}
