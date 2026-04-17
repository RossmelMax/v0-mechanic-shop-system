'use client'

import { FaultSearch } from '@/components/faults/fault-search'

export default function FaultsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Base de Fallas</h1>
        <p className="text-gray-600">
          Jurisprudencia de fallas comunes y sus soluciones
        </p>
      </div>

      <FaultSearch />
    </div>
  )
}
