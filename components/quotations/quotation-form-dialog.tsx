'use client'

import { useState } from 'react'
import { useClients } from '@/hooks/use-clients'
import { useClientVehicles } from '@/hooks/use-clients'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import {
  FieldGroup,
  FieldLabel,
} from '@/components/ui/fieldgroup'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

interface QuotationFormDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function QuotationFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuotationFormDialogProps) {
  const [isOpen, setIsOpen] = useState(open || false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [formData, setFormData] = useState({
    vehicleId: '',
    estimatedTotal: '',
  })

  const { clients, isLoading: clientsLoading } = useClients()
  const { vehicles, isLoading: vehiclesLoading } = useClientVehicles(selectedClientId)

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedClientId || !formData.vehicleId) {
        throw new Error('Por favor selecciona cliente y vehículo')
      }

      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: selectedClientId,
          vehicleId: formData.vehicleId,
          estimatedTotal: formData.estimatedTotal ? parseFloat(formData.estimatedTotal) : 0,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear cotización')
      }

      toast.success('Cotización creada exitosamente')
      setFormData({ vehicleId: '', estimatedTotal: '' })
      setSelectedClientId('')
      handleOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Cotización
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Cotización</DialogTitle>
          <DialogDescription>
            Selecciona el cliente y vehículo para la cotización
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <FieldLabel>Cliente *</FieldLabel>
            {clientsLoading ? (
              <div className="flex items-center justify-center h-10">
                <Spinner className="w-5 h-5" />
              </div>
            ) : (
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Vehículo *</FieldLabel>
            {vehiclesLoading ? (
              <div className="flex items-center justify-center h-10">
                <Spinner className="w-5 h-5" />
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-sm text-gray-500 p-2">
                {selectedClientId ? 'Este cliente no tiene vehículos registrados' : 'Selecciona un cliente primero'}
              </div>
            ) : (
              <Select value={formData.vehicleId} onValueChange={(value) => setFormData({ ...formData, vehicleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un vehículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Total Estimado (opcional)</FieldLabel>
            <input
              type="number"
              placeholder="0.00"
              value={formData.estimatedTotal}
              onChange={(e) => setFormData({ ...formData, estimatedTotal: e.target.value })}
              step="0.01"
              min="0"
              className="px-3 py-2 border rounded-md"
            />
          </FieldGroup>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !selectedClientId || !formData.vehicleId}>
              {isLoading ? 'Creando...' : 'Crear Cotización'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
