'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit3 } from 'lucide-react'
import {
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { toast } from 'sonner'

interface ClientOption {
  id: string
  name: string
}

interface VehicleFormDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  vehicle?: {
    id: string
    clientId: string
    make: string
    model: string
    year: number
    licensePlate: string
    vin?: string | null
    type: string
    fuelType?: string | null
    transmission?: string | null
    mileage?: number | null
    color?: string | null
    engineType: string
    notes?: string | null
  }
  clientOptions?: ClientOption[]
  clientId?: string
  defaultClientId?: string
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  onSuccess,
  vehicle,
  clientOptions = [],
  clientId,
  defaultClientId,
}: VehicleFormDialogProps) {
  const initialClientId = vehicle?.clientId ?? clientId ?? defaultClientId ?? ''
  const [isOpen, setIsOpen] = useState(open ?? false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientId: initialClientId,
    make: vehicle?.make ?? '',
    model: vehicle?.model ?? '',
    year: vehicle?.year?.toString() ?? new Date().getFullYear().toString(),
    licensePlate: vehicle?.licensePlate ?? '',
    vin: vehicle?.vin ?? '',
    type: vehicle?.type ?? 'auto',
    fuelType: vehicle?.fuelType ?? '',
    transmission: vehicle?.transmission ?? '',
    mileage: vehicle?.mileage?.toString() ?? '',
    color: vehicle?.color ?? '',
    engineType: vehicle?.engineType ?? 'NO_COMPUTER',
    notes: vehicle?.notes ?? '',
  })

  useEffect(() => {
    setIsOpen(open ?? false)
  }, [open])

  useEffect(() => {
    setFormData({
      clientId: vehicle?.clientId ?? defaultClientId ?? '',
      make: vehicle?.make ?? '',
      model: vehicle?.model ?? '',
      year: vehicle?.year?.toString() ?? new Date().getFullYear().toString(),
      licensePlate: vehicle?.licensePlate ?? '',
      vin: vehicle?.vin ?? '',
      type: vehicle?.type ?? 'auto',
      fuelType: vehicle?.fuelType ?? '',
      transmission: vehicle?.transmission ?? '',
      mileage: vehicle?.mileage?.toString() ?? '',
      color: vehicle?.color ?? '',
      engineType: vehicle?.engineType ?? 'NO_COMPUTER',
      notes: vehicle?.notes ?? '',
    })
  }, [vehicle, defaultClientId])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = vehicle ? `/api/vehicles/${vehicle.id}` : '/api/vehicles'
      const method = vehicle ? 'PUT' : 'POST'
      const payload = {
        ...formData,
        year: parseInt(formData.year, 10),
        mileage: formData.mileage ? parseInt(formData.mileage, 10) : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar vehículo')
      }

      toast.success(vehicle ? 'Vehículo actualizado correctamente' : 'Vehículo creado correctamente')
      onSuccess?.()
      handleOpenChange(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={vehicle ? 'outline' : 'default'} className="gap-2">
          {vehicle ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}</DialogTitle>
          <DialogDescription>
            {vehicle ? 'Actualiza los datos del vehículo.' : 'Ingresa los datos del vehículo para registrarlo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!defaultClientId && (
            <FieldGroup>
              <FieldLabel>Cliente *</FieldLabel>
              <Select
                value={formData.clientId}
                onValueChange={(value) => handleSelectChange('clientId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Marca *</FieldLabel>
              <Input
                name="make"
                placeholder="Toyota"
                value={formData.make}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Modelo *</FieldLabel>
              <Input
                name="model"
                placeholder="Corolla"
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Año *</FieldLabel>
              <Input
                name="year"
                type="number"
                placeholder="2024"
                value={formData.year}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Placa *</FieldLabel>
              <Input
                name="licensePlate"
                placeholder="ABC-1234"
                value={formData.licensePlate}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>VIN</FieldLabel>
              <Input
                name="vin"
                placeholder="1HGBH41JXMN109186"
                value={formData.vin}
                onChange={handleInputChange}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Color</FieldLabel>
              <Input
                name="color"
                placeholder="Blanco"
                value={formData.color}
                onChange={handleInputChange}
              />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Tipo de Vehículo</FieldLabel>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="camión">Camión</SelectItem>
                  <SelectItem value="moto">Moto</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Tipo de Motor</FieldLabel>
              <Select
                value={formData.engineType}
                onValueChange={(value) => handleSelectChange('engineType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_COMPUTER">Sin Computadora</SelectItem>
                  <SelectItem value="WITH_COMPUTER">Con Computadora</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Combustible</FieldLabel>
              <Select
                value={formData.fuelType}
                onValueChange={(value) => handleSelectChange('fuelType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasolina">Gasolina</SelectItem>
                  <SelectItem value="diésel">Diésel</SelectItem>
                  <SelectItem value="híbrido">Híbrido</SelectItem>
                  <SelectItem value="eléctrico">Eléctrico</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Transmisión</FieldLabel>
              <Select
                value={formData.transmission}
                onValueChange={(value) => handleSelectChange('transmission', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automática">Automática</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Kilometraje</FieldLabel>
              <Input
                name="mileage"
                type="number"
                placeholder="k m"
                value={formData.mileage}
                onChange={handleInputChange}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Notas</FieldLabel>
              <Textarea
                name="notes"
                placeholder="Observaciones del vehículo"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </FieldGroup>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || (!vehicle && !formData.clientId)}>
              {isLoading ? 'Guardando...' : vehicle ? 'Actualizar Vehículo' : 'Crear Vehículo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
