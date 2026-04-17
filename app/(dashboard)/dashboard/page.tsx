'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
    Users,
    Car,
    Wrench,
    Receipt,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    Plus
} from 'lucide-react'
import Link from 'next/link'
import { useClients } from '@/hooks/use-clients'
import { useWorkOrders } from '@/hooks/use-orders'
import { useSales } from '@/hooks/use-sales'
import { useProducts } from '@/hooks/use-products'

export default function DashboardPage() {
    const { clients, isLoading: clientsLoading } = useClients()
    const { workOrders, isLoading: ordersLoading } = useWorkOrders()
    const { sales, isLoading: salesLoading } = useSales()
    const { products, isLoading: productsLoading } = useProducts()

    const isLoading = clientsLoading || ordersLoading || salesLoading || productsLoading

    // Calculate stats from real data
    const stats = {
        totalClients: clients?.length || 0,
        totalVehicles: clients?.reduce((sum, client) => sum + (client.vehicles?.length || 0), 0) || 0,
        totalOrders: workOrders?.length || 0,
        totalSales: sales?.length || 0,
        pendingOrders: workOrders?.filter((o: any) => o.status === 'pending')?.length || 0,
        completedOrders: workOrders?.filter((o: any) => o.status === 'completed')?.length || 0,
        totalRevenue: sales?.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0) || 0,
        lowStockItems: products?.filter((p: any) => p.quantity <= p.minStock)?.length || 0
    }

    const recentOrders = workOrders?.slice(0, 2).map((order: any) => ({
        id: order.id,
        number: order.workOrderNumber || `ORD-${order.id}`,
        client: order.client?.name || 'Cliente desconocido',
        vehicle: `${order.vehicle?.make || ''} ${order.vehicle?.model || ''}`.trim() || 'Vehículo desconocido',
        status: order.status || 'pending',
        total: 0
    })) || []

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'in_progress':
                return 'bg-blue-100 text-blue-800'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'COMPLETED'
            case 'in_progress':
                return 'En Progreso'
            case 'pending':
                return 'Pendiente'
            default:
                return status
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Bienvenido a tu sistema de gestión de taller</p>
                </div>
                <div className="flex space-x-4">
                    <Link href="/quotations">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Cotización
                        </Button>
                    </Link>
                    <Link href="/orders">
                        <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Orden
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 mr-1" />
                            +2 este mes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vehículos Registrados</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                        <p className="text-xs text-muted-foreground">
                            Activos en el sistema
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Órdenes de Trabajo</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.pendingOrders} pendientes, {stats.completedOrders} completadas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 mr-1" />
                            +12% vs mes anterior
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes Recientes</CardTitle>
                        <CardDescription>
                            Últimas órdenes de trabajo procesadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <p className="font-medium">{order.number}</p>
                                            <Badge className={getStatusColor(order.status)}>
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{order.client} - {order.vehicle}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${order.total.toLocaleString()}</p>
                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="ghost" size="sm">
                                                Ver detalles
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link href="/orders">
                                <Button variant="outline" className="w-full">
                                    Ver todas las órdenes
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts and Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alertas y Acciones Rápidas</CardTitle>
                        <CardDescription>
                            Elementos que requieren tu atención
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.lowStockItems > 0 && (
                                <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                                    <div className="flex-1">
                                        <p className="font-medium text-yellow-800">Productos con stock bajo</p>
                                        <p className="text-sm text-yellow-700">{stats.lowStockItems} productos requieren reposición</p>
                                    </div>
                                    <Link href="/products">
                                        <Button variant="outline" size="sm">
                                            Gestionar
                                        </Button>
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                                <div className="flex-1">
                                    <p className="font-medium text-blue-800">Órdenes pendientes</p>
                                    <p className="text-sm text-blue-700">{stats.pendingOrders} órdenes requieren atención</p>
                                </div>
                                <Link href="/orders">
                                    <Button variant="outline" size="sm">
                                        Ver órdenes
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                <div className="flex-1">
                                    <p className="font-medium text-green-800">Sistema operativo</p>
                                    <p className="text-sm text-green-700">Todas las funcionalidades están activas</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Ventas del Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-sm text-gray-600 mt-2">
                            {stats.totalSales} ventas realizadas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Eficiencia del Taller</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Tasa de completación de órdenes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Clientes Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-600">{stats.totalClients}</div>
                        <p className="text-sm text-gray-600 mt-2">
                            Clientes registrados en el sistema
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
