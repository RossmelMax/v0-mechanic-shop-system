'use client'

import { useClients } from '@/hooks/use-clients'
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
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Trash2, Edit2, Plus, Phone, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { ClientFormDialog } from './client-form-dialog'

export function ClientsTable() {
  const { clients, isLoading, mutate } = useClients()
  const [showForm, setShowForm] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar este cliente?')) {
      try {
        await fetch(`/api/clients/${id}`, { method: 'DELETE' })
        mutate()
      } catch (error) {
        console.error('Error deleting client:', error)
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

  if (clients.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <Plus className="w-8 h-8" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Sin clientes</EmptyTitle>
          <EmptyDescription>Comienza agregando un nuevo cliente</EmptyDescription>
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
              <TableHead>Nombre</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Vehículos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  {client.phone ? (
                    <a href={`tel:${client.phone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Phone className="w-4 h-4" />
                      {client.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {client.email ? (
                    <a href={`mailto:${client.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Mail className="w-4 h-4" />
                      {client.email}
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {client.address ? (
                    <div className="flex items-start gap-1 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {client.vehicles && client.vehicles.length > 0 ? (
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {client.vehicles.length} {client.vehicles.length === 1 ? 'vehículo' : 'vehículos'}
                    </Link>
                  ) : (
                    <span className="text-gray-400">0 vehículos</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/clients/${client.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(client.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ClientFormDialog
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
