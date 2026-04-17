'use client'

import { useQuotations } from '@/hooks/use-quotations'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { FileText, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { QuotationFormDialog } from './quotation-form-dialog'
import { format } from 'date-fns'

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  IN_DIAGNOSIS: { label: 'En Diagnóstico', color: 'bg-blue-100 text-blue-800' },
  QUOTED: { label: 'Cotizada', color: 'bg-green-100 text-green-800' },
  ACCEPTED: { label: 'Aceptada', color: 'bg-emerald-100 text-emerald-800' },
  REJECTED: { label: 'Rechazada', color: 'bg-red-100 text-red-800' },
  CONVERTED_TO_ORDER: { label: 'Convertida a Orden', color: 'bg-purple-100 text-purple-800' },
}

export function QuotationsTable() {
  const { quotations, isLoading, mutate } = useQuotations()
  const [showForm, setShowForm] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar esta cotización?')) {
      try {
        await fetch(`/api/quotations/${id}`, { method: 'DELETE' })
        mutate()
      } catch (error) {
        console.error('Error deleting quotation:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  if (quotations.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileText className="w-8 h-8" />
          </EmptyMedia>
          <EmptyTitle>Sin cotizaciones</EmptyTitle>
          <EmptyDescription>
            Comienza creando una nueva cotización
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Total Estimado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((quotation) => {
              const statusInfo = statusLabels[quotation.status] || { label: 'Desconocido', color: 'bg-gray-100 text-gray-800' }
              return (
                <TableRow key={quotation.id}>
                  <TableCell className="font-mono font-semibold">{quotation.quotationNumber}</TableCell>
                  <TableCell>{quotation.client.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{quotation.vehicle.make} {quotation.vehicle.model}</p>
                      <p className="text-gray-500 text-xs">{quotation.vehicle.licensePlate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {quotation.estimatedTotal ? (
                      `$${quotation.estimatedTotal.toLocaleString()}`
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(quotation.quotationDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/quotations/${quotation.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(quotation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <QuotationFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={() => {
          mutate()
          setShowForm(false)
        }}
      />
    </div>
  )
}
