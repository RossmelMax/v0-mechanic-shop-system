'use client'

import React, { useState } from 'react'
import { useDashboardReport, useSalesReport, useProductsReport, useClientsReport } from '@/hooks/use-reports'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Users,
  Car,
  DollarSign,
  Download,
  FileText
} from 'lucide-react'

export default function ReportsPage() {
  const { report: dashboardReport, isLoading: dashboardLoading } = useDashboardReport()
  const [salesDateRange, setSalesDateRange] = useState({ startDate: '', endDate: '' })
  const { salesReport, isLoading: salesLoading, mutate: mutateSales } = useSalesReport(
    salesDateRange.startDate || undefined,
    salesDateRange.endDate || undefined
  )
  const { productsReport } = useProductsReport()
  const { clientsReport } = useClientsReport()

  const handleSalesReport = () => {
    mutateSales()
  }

  if (dashboardLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-gray-600">
            Visualiza reportes y estadísticas del taller
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {dashboardReport && (
            <>
              {/* Estadísticas principales */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardReport.totalClients}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardReport.pendingQuotations} cotizaciones pendientes
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardReport.totalVehicles}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardReport.pendingWorkOrders} órdenes pendientes
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${dashboardReport.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardReport.pendingPayments} pagos pendientes
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Órdenes de Trabajo</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardReport.totalWorkOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardReport.totalSales} ventas realizadas
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Estado de órdenes de trabajo */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Órdenes de Trabajo</CardTitle>
                  <CardDescription>
                    Distribución actual de las órdenes por estado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{dashboardReport.workOrderStatus.pending}</div>
                      <p className="text-sm text-muted-foreground">Pendientes</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{dashboardReport.workOrderStatus.inProgress}</div>
                      <p className="text-sm text-muted-foreground">En Progreso</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{dashboardReport.workOrderStatus.completed}</div>
                      <p className="text-sm text-muted-foreground">Completadas</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{dashboardReport.workOrderStatus.cancelled}</div>
                      <p className="text-sm text-muted-foreground">Canceladas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Productos más vendidos */}
              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                  <CardDescription>
                    Top 10 productos por ingresos generados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Cantidad Vendida</TableHead>
                        <TableHead>Ingresos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardReport.topProducts.slice(0, 10).map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.productName}</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>{product.totalSold}</TableCell>
                          <TableCell>${product.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Clientes más importantes */}
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Más Importantes</CardTitle>
                  <CardDescription>
                    Top 10 clientes por gasto total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Órdenes</TableHead>
                        <TableHead>Total Gastado</TableHead>
                        <TableHead>Último Servicio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardReport.topClients.slice(0, 10).map((client, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{client.clientName}</TableCell>
                          <TableCell>{client.workOrdersCount || 0}</TableCell>
                          <TableCell>${client.totalSpent.toLocaleString()}</TableCell>
                          <TableCell>-</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Ventas</CardTitle>
              <CardDescription>
                Análisis detallado de las ventas por período
              </CardDescription>
              <div className="flex space-x-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha Inicio</label>
                  <Input
                    type="date"
                    value={salesDateRange.startDate}
                    onChange={(e) => setSalesDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha Fin</label>
                  <Input
                    type="date"
                    value={salesDateRange.endDate}
                    onChange={(e) => setSalesDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSalesReport} disabled={salesLoading}>
                    {salesLoading ? 'Cargando...' : 'Generar Reporte'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {salesReport && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{salesReport.summary.totalSales}</div>
                        <p className="text-xs text-muted-foreground">Total Ventas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${salesReport.summary.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Ingresos Totales</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">${salesReport.summary.averageSale.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Venta Promedio</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Ventas por Estado de Pago</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {salesReport.salesByStatus.map((status: any) => (
                          <div key={status.status} className="flex justify-between py-2">
                            <span className="text-sm">{status.status}</span>
                            <span className="text-sm font-medium">{status.count} (${status.total.toLocaleString()})</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Ventas por Método de Pago</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {salesReport.salesByPaymentMethod.map((method: any) => (
                          <div key={method.method} className="flex justify-between py-2">
                            <span className="text-sm">{method.method}</span>
                            <span className="text-sm font-medium">{method.count} (${method.total.toLocaleString()})</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {productsReport && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{productsReport.summary.totalProducts}</div>
                    <p className="text-xs text-muted-foreground">Total Productos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-orange-600">{productsReport.summary.lowStockCount}</div>
                    <p className="text-xs text-muted-foreground">Stock Bajo</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-red-600">{productsReport.summary.outOfStockCount}</div>
                    <p className="text-xs text-muted-foreground">Sin Stock</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Productos con Stock Bajo</CardTitle>
                  <CardDescription>
                    Productos que necesitan reabastecimiento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock Actual</TableHead>
                        <TableHead>Stock Mínimo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsReport.lowStockProducts.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-orange-600">
                              {product.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.minStock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          {clientsReport && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{clientsReport.summary.totalClients}</div>
                    <p className="text-xs text-muted-foreground">Total Clientes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">{clientsReport.summary.activeClients}</div>
                    <p className="text-xs text-muted-foreground">Clientes Activos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">{clientsReport.summary.newClientsThisMonth}</div>
                    <p className="text-xs text-muted-foreground">Nuevos Este Mes</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Clientes Más Importantes</CardTitle>
                  <CardDescription>
                    Clientes con mayor gasto acumulado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Vehículos</TableHead>
                        <TableHead>Órdenes</TableHead>
                        <TableHead>Total Gastado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientsReport.clientsByVehicleCount.slice(0, 10).map((client: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{client.clientName}</TableCell>
                          <TableCell>{client.vehicleCount}</TableCell>
                          <TableCell>{client.workOrdersCount}</TableCell>
                          <TableCell>${client.totalSpent.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
