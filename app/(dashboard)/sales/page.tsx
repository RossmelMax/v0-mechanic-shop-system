'use client'

import React, { useState } from 'react'
import { useSales } from '@/hooks/use-sales'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Eye, Edit, Trash2, CreditCard, Search, DollarSign } from 'lucide-react'
import { SaleFormDialog } from '@/components/sales/sale-form-dialog'
import { SaleDetailsDialog } from '@/components/sales/sale-details-dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  partial: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
}

const paymentStatusLabels = {
  pending: 'Pendiente',
  partial: 'Parcial',
  paid: 'Pagado',
  overdue: 'Vencido',
}

export default function SalesPage() {
  const { sales, isLoading, mutate } = useSales()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [editingSale, setEditingSale] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleCreateSale = () => {
    setEditingSale(null)
    setFormDialogOpen(true)
  }

  const handleEditSale = (sale: any) => {
    setEditingSale(sale)
    setFormDialogOpen(true)
  }

  const handleViewSale = (sale: any) => {
    setSelectedSale(sale)
    setDetailsDialogOpen(true)
  }

  const handleDeleteSale = async (saleId: string) => {
    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la venta')
      }

      toast({
        title: 'Venta eliminada',
        description: 'La venta ha sido eliminada exitosamente.',
      })

      mutate()
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la venta.',
        variant: 'destructive',
      })
    }
  }

  // Filtrar ventas
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.workOrder.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.workOrder.vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sale.paymentStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  // Estadísticas
  const totalSales = sales.length
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0)
  const pendingPayments = sales.filter(s => s.paymentStatus === 'pending' || s.paymentStatus === 'partial').length
  const paidSales = sales.filter(s => s.paymentStatus === 'paid').length

  // Estados únicos
  const statuses = Array.from(new Set(sales.map(s => s.paymentStatus)))

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-gray-600">Cargando ventas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
          <p className="text-gray-600">
            Registra y gestiona las ventas y facturación
          </p>
        </div>
        <Button onClick={handleCreateSale}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingPayments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Pagadas</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidSales}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Ventas</CardTitle>
          <CardDescription>
            Todas las ventas registradas en el sistema
          </CardDescription>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, cliente o vehículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {paymentStatusLabels[status as keyof typeof paymentStatusLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.number}</TableCell>
                  <TableCell>{sale.client.name}</TableCell>
                  <TableCell>
                    {sale.workOrder.vehicle.make} {sale.workOrder.vehicle.model} ({sale.workOrder.vehicle.year})
                  </TableCell>
                  <TableCell>
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${sale.total.toLocaleString()}</TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[sale.paymentStatus]}>
                      {paymentStatusLabels[sale.paymentStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSale(sale)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSale(sale)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar venta?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente
                              la venta {sale.number}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSale(sale.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SaleFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        sale={editingSale}
        onSuccess={() => {
          mutate()
          setFormDialogOpen(false)
        }}
      />

      <SaleDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        sale={selectedSale}
      />
    </div>
  )
}
