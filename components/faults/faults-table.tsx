'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFaults, useFaultSearch } from '@/hooks/use-faults'
import { Zap, AlertTriangle, Wrench, Search } from 'lucide-react'

export function FaultsTable() {
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSystem, setSelectedSystem] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [computerRequired, setComputerRequired] = useState<boolean | undefined>()

  // Use search if there's a query, otherwise use regular list
  const { faults: searchResults } = useFaultSearch(searchQuery, {
    system: selectedSystem,
    severity: selectedSeverity,
    computerRequired,
  })

  const { faults: listFaults, pagination, isLoading } = useFaults(page)

  const faults = searchQuery || selectedSystem || selectedSeverity !== '' || computerRequired !== undefined
    ? searchResults
    : listFaults

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Base de Datos de Fallas</h2>
        <p className="text-gray-600 mt-2">Diagnóstico y soluciones inteligentes para problemas comunes</p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Buscar por síntomas, código..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        <Select value={selectedSystem} onValueChange={setSelectedSystem}>
          <SelectTrigger>
            <SelectValue placeholder="Sistema afectado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los sistemas</SelectItem>
            <SelectItem value="MOTOR">Motor</SelectItem>
            <SelectItem value="TRANSMISION">Transmisión</SelectItem>
            <SelectItem value="ELECTRICO">Eléctrico</SelectItem>
            <SelectItem value="FRENOS">Frenos</SelectItem>
            <SelectItem value="SUSPENSION">Suspensión</SelectItem>
            <SelectItem value="AIRE">Aire Acondicionado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
          <SelectTrigger>
            <SelectValue placeholder="Severidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las severidades</SelectItem>
            <SelectItem value="CRITICAL">Crítica</SelectItem>
            <SelectItem value="HIGH">Alta</SelectItem>
            <SelectItem value="MEDIUM">Media</SelectItem>
            <SelectItem value="LOW">Baja</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={computerRequired === undefined ? '' : computerRequired ? 'si' : 'no'}
          onValueChange={(val) => {
            if (val === '') setComputerRequired(undefined)
            else setComputerRequired(val === 'si')
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Computadora" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Cualquiera</SelectItem>
            <SelectItem value="si">Requiere computadora</SelectItem>
            <SelectItem value="no">Sin computadora</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código/Título</TableHead>
              <TableHead>Síntomas</TableHead>
              <TableHead>Severidad</TableHead>
              <TableHead>Sistema</TableHead>
              <TableHead>Tiempo Est.</TableHead>
              <TableHead>Costo Est.</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Cargando fallas...
                </TableCell>
              </TableRow>
            ) : faults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No hay fallas que coincidan con tu búsqueda
                </TableCell>
              </TableRow>
            ) : (
              faults.map((fault: any) => (
                <TableRow key={fault.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div>
                      {fault.code && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{fault.code}</span>}
                      <div className="mt-1">{fault.title}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate">{fault.symptoms}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(fault.severity)}>
                      {fault.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {fault.affectedSystems && (
                      <div className="flex gap-1 flex-wrap">
                        {JSON.parse(fault.affectedSystems || '[]').map((sys: string) => (
                          <Badge key={sys} variant="outline" className="text-xs">
                            {sys}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {fault.estimatedTime && (
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{fault.estimatedTime}h</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {fault.estimatedCost && (
                      <span className="text-sm font-medium">${fault.estimatedCost}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {pagination && !searchQuery && (
        <div className="flex justify-center gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {page} de {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
