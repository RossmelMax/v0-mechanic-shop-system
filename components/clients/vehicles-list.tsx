'use client'

import { useClientVehicles, Client } from '@/hooks/use-clients'
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
import { Empty } from '@/components/ui/empty'
import { Trash2, Edit2, Plus, Gauge } from 'lucide-react'
import { useState } from 'react'
import { VehicleFormDialog } from './vehicle-form-dialog'

interface VehiclesListProps {
  client: Client
  onVehicleAdded: () => void
}

export function VehiclesList({ client, onVehicleAdded }: VehiclesListProps) {
  const { vehicles, isLoading, mutate } = useClientVehicles(client.id)
  const [showForm, setShowForm] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro que desea eliminar este vehículo?')) {
      try {
        await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
        mutate()
      } catch (error) {
        console.error('Error deleting vehicle:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner />
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="space-y-4">
        <Empty
          icon={<Plus className="w-8 h-8" />}
          title="Sin vehículos"
          description="Agrega el primer vehículo del cliente"
        />
        <VehicleFormDialog
          clientId={client.id}
          onSuccess={() => {
            mutate()
            onVehicleAdded()
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Tipo de Motor</TableHead>
              <TableHead>Kilometraje</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell className="font-mono">{vehicle.licensePlate}</TableCell>
                <TableCell className="capitalize">{vehicle.type}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {vehicle.engineType === 'WITH_COMPUTER' ? (
                      <>
                        <Gauge className="w-3 h-3" />
                        Con Computadora
                      </>
                    ) : (
                      <>Sin Computadora</>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  {vehicle.mileage ? (
                    `${vehicle.mileage.toLocaleString()} km`
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <VehicleFormDialog
        clientId={client.id}
        onSuccess={() => {
          mutate()
          onVehicleAdded()
        }}
      />
    </div>
  )
}
