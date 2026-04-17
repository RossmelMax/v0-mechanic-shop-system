'use client'

import { useState } from 'react'
import { useVehicles, useClients } from '@/hooks/use-clients'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { Trash2, Edit2, Plus, MapPin, User, Car, ShieldCheck } from 'lucide-react'
import { VehicleFormDialog } from '@/components/vehicles/vehicle-form-dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

export function VehiclesTable() {
  const { vehicles, isLoading, mutate } = useVehicles()
  const { clients } = useClients()
  const [selectedVehicle, setSelectedVehicle] = useState<null | any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este vehículo?')) return

    try {
      const response = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('No se pudo eliminar el vehículo')
      toast.success('Vehículo eliminado correctamente')
      mutate()
    } catch (error) {
      console.error(error)
      toast.error('Error al eliminar el vehículo')
    }
  }

  const handleEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedVehicle(null)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="space-y-6">
        <Empty>
          <EmptyMedia variant="icon">
            <Plus className="w-8 h-8" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Sin vehículos</EmptyTitle>
            <EmptyDescription>No se han registrado vehículos en el sistema aún.</EmptyDescription>
          </EmptyHeader>
        </Empty>
        <Button onClick={handleNew} className="mx-auto">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Vehículo
        </Button>
        <VehicleFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={() => {
            mutate()
            setSelectedVehicle(null)
          }}
          clientOptions={clients.map((client) => ({ id: client.id, name: client.name }))}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehículos</h1>
          <p className="text-gray-600">Gestiona el parque vehicular de tus clientes.</p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Vehículo
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{vehicle.client?.name ?? 'Sin cliente'}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{vehicle.make}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell className="font-mono">{vehicle.licensePlate}</TableCell>
              <TableCell className="capitalize">{vehicle.type}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(vehicle.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <VehicleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        vehicle={selectedVehicle ?? undefined}
        onSuccess={() => {
          mutate()
          setSelectedVehicle(null)
        }}
        clientOptions={clients.map((client) => ({ id: client.id, name: client.name }))}
        defaultClientId={selectedVehicle?.clientId}
      />
    </div>
  )
}
