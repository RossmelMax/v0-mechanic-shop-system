'use client'

import { useState } from 'react'
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
import { Plus } from 'lucide-react'
import {
  FieldGroup,
  FieldLabel,
} from '@/components/ui/fieldgroup'
import { toast } from 'sonner'

interface VehicleFormDialogProps {
  clientId: string
  onSuccess?: () => void
}

export function VehicleFormDialog({
  clientId,
  onSuccess,
}: VehicleFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    licensePlate: '',
    type: 'auto',
    fuelType: '',
    transmission: '',
    mileage: '',
    color: '',
    engineType: 'NO_COMPUTER',
    notes: '',
    vin: '',
  })

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
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear vehículo')
      }

      toast.success('Vehículo creado exitosamente')
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear().toString(),
        licensePlate: '',
        type: 'auto',
        fuelType: '',
        transmission: '',
        mileage: '',
        color: '',
        engineType: 'NO_COMPUTER',
        notes: '',
        vin: '',
      })
      setIsOpen(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar Vehículo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
          <DialogDescription>
            Ingresa los datos del vehículo del cliente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Marca *</FieldLabel>
              <Input
                name="make"
                placeholder="Toyota, Ford, etc"
                value={formData.make}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Modelo *</FieldLabel>
              <Input
                name="model"
                placeholder="Corolla, F-150, etc"
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Tipo de Vehículo</FieldLabel>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
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
              <Select value={formData.engineType} onValueChange={(value) => handleSelectChange('engineType', value)}>
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

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Combustible</FieldLabel>
              <Select value={formData.fuelType} onValueChange={(value) => handleSelectChange('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
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
              <Select value={formData.transmission} onValueChange={(value) => handleSelectChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automática">Automática</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldGroup>
              <FieldLabel>Kilometraje</FieldLabel>
              <Input
                name="mileage"
                type="number"
                placeholder="0"
                value={formData.mileage}
                onChange={handleInputChange}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Color</FieldLabel>
              <Input
                name="color"
                placeholder="Blanco, Negro, etc"
                value={formData.color}
                onChange={handleInputChange}
              />
            </FieldGroup>
          </div>

          <FieldGroup>
            <FieldLabel>VIN (Número de Serie)</FieldLabel>
            <Input
              name="vin"
              placeholder="Número de identificación del vehículo"
              value={formData.vin}
              onChange={handleInputChange}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Notas</FieldLabel>
            <textarea
              name="notes"
              placeholder="Notas adicionales sobre el vehículo"
              value={formData.notes}
              onChange={handleInputChange}
              className="min-h-20 px-3 py-2 border rounded-md"
            />
          </FieldGroup>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Vehículo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
