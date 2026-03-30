'use client'

import { useState, useEffect } from 'react'
import { useFaultSearch } from '@/hooks/use-faults'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Search, AlertCircle, Clock, DollarSign, Gauge } from 'lucide-react'
import { FieldGroup, FieldLabel } from '@/components/ui/fieldgroup'

const systemsOptions = [
  'engine',
  'electrical',
  'transmission',
  'braking',
  'cooling',
  'fuel',
  'suspension',
  'steering',
]

const severityOptions = [
  { value: 'LOW', label: 'Baja' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'CRITICAL', label: 'Crítica' },
]

export function FaultSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSystem, setSelectedSystem] = useState<string>('')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('')
  const [computerRequired, setComputerRequired] = useState<boolean | undefined>(undefined)
  const [hasSearched, setHasSearched] = useState(false)

  const { faults, isLoading } = useFaultSearch(searchQuery, {
    system: selectedSystem,
    severity: selectedSeverity,
    computerRequired,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    }
    return colors[severity] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <FieldGroup>
          <FieldLabel>Buscar por síntomas, código o descripción</FieldLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Ej: motor no arranca, ruido detonación, pérdida de refrigerante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </FieldGroup>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldGroup>
            <FieldLabel>Sistema Afectado</FieldLabel>
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los sistemas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {systemsOptions.map((system) => (
                  <SelectItem key={system} value={system}>
                    {system.charAt(0).toUpperCase() + system.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Severidad</FieldLabel>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las severidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {severityOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Tipo de Diagnóstico</FieldLabel>
            <Select value={computerRequired === undefined ? '' : computerRequired ? 'with' : 'without'} onValueChange={(val) => {
              if (val === '') setComputerRequired(undefined)
              else setComputerRequired(val === 'with')
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="with">Requiere Computadora</SelectItem>
                <SelectItem value="without">Sin Computadora</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>
        </div>
      </form>

      {/* Results */}
      {isLoading && (
        <div className="flex items-center justify-center h-48">
          <Spinner />
        </div>
      )}

      {!isLoading && hasSearched && faults.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
          <p className="text-blue-900">No se encontraron fallas que coincidan con tu búsqueda</p>
        </div>
      )}

      {!isLoading && faults.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Se encontraron {faults.length} resultado(s)</p>
          {faults.map((fault) => (
            <div key={fault.id} className="border rounded-lg p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{fault.title}</h3>
                  {fault.code && (
                    <p className="text-sm text-gray-500 font-mono mt-1">Código: {fault.code}</p>
                  )}
                </div>
                <Badge className={getSeverityColor(fault.severity)}>
                  {fault.severity}
                </Badge>
              </div>

              <p className="text-gray-700 mb-3">{fault.description}</p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Síntomas:</p>
                <p className="text-sm text-gray-600">{fault.symptoms}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {fault.estimatedTime && (
                  <div className="flex items-center gap-2 text-sm bg-blue-50 p-3 rounded">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-gray-600">Tiempo estimado</p>
                      <p className="font-semibold">{fault.estimatedTime} min</p>
                    </div>
                  </div>
                )}

                {fault.estimatedCost && (
                  <div className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-gray-600">Costo estimado</p>
                      <p className="font-semibold">${fault.estimatedCost}</p>
                    </div>
                  </div>
                )}

                {fault.computerRequired && (
                  <div className="flex items-center gap-2 text-sm bg-orange-50 p-3 rounded">
                    <Gauge className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-gray-600">Requiere</p>
                      <p className="font-semibold">Diagnóstico computarizado</p>
                    </div>
                  </div>
                )}
              </div>

              {fault.requiredParts && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Partes necesarias:</p>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(fault.requiredParts).map((part: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {fault.commonCauses && JSON.parse(fault.commonCauses).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Causas comunes:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    {JSON.parse(fault.commonCauses).map((cause: string, idx: number) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!hasSearched && !isLoading && faults.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Search className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">Usa el buscador para encontrar fallas en la base de datos</p>
        </div>
      )}
    </div>
  )
}
