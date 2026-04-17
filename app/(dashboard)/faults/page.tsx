'use client'

import { FaultSearch } from '@/components/faults/fault-search'
import { FaultsTable } from '@/components/faults/faults-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function FaultsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Base de Fallas</h1>
        <p className="text-gray-600">
          Jurisprudencia de fallas comunes y sus soluciones inteligentes
        </p>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList>
          <TabsTrigger value="search">Buscador Inteligente</TabsTrigger>
          <TabsTrigger value="catalog">Catálogo Completo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-6">
          <FaultSearch />
        </TabsContent>
        
        <TabsContent value="catalog" className="space-y-6">
          <FaultsTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
