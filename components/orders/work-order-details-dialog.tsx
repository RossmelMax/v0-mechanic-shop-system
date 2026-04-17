'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, User, Car, FileText, DollarSign } from 'lucide-react'
import { WorkOrderWithRelations } from '@/lib/types'

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
}

const statusLabels = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Completada',
    cancelled: 'Cancelada',
}

const normalizeWorkOrderStatus = (status: string) => {
    const key = status.toLowerCase().replace(/\s+/g, '_') as keyof typeof statusColors
    return statusColors[key] || statusColors.pending
}

const normalizeWorkOrderStatusLabel = (status: string) => {
    const key = status.toLowerCase().replace(/\s+/g, '_') as keyof typeof statusLabels
    return statusLabels[key] || status
}

interface WorkOrderDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workOrder: WorkOrderWithRelations | null
}

export function WorkOrderDetailsDialog({
    open,
    onOpenChange,
    workOrder,
}: WorkOrderDetailsDialogProps) {
    if (!workOrder) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Orden de Trabajo #{workOrder.workOrderNumber || 'N/A'}</DialogTitle>
                    <DialogDescription>
                        Detalles completos de la orden de trabajo
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Información básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Información General
                                <Badge className={normalizeWorkOrderStatus(workOrder.status)}>
                                    {normalizeWorkOrderStatusLabel(workOrder.status)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Fecha de Creación</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(workOrder.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Fecha de Inicio</p>
                                        <p className="text-sm text-gray-600">
                                            {workOrder.startDate ? new Date(workOrder.startDate).toLocaleDateString() : 'No definida'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Fecha de Fin</p>
                                        <p className="text-sm text-gray-600">
                                            {workOrder.completionDate ? new Date(workOrder.completionDate).toLocaleDateString() : 'No definida'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Horas</p>
                                        <p className="text-sm text-gray-600">
                                            Estimadas: {workOrder.estimatedHours || 0}h | Reales: {workOrder.actualHours || 0}h
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {workOrder.notes && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Notas</p>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                        {workOrder.notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Información del cliente */}
                    {workOrder.client && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Información del Cliente</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Nombre</p>
                                    <p className="text-sm text-gray-600">{workOrder.client?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-gray-600">{workOrder.client?.email || 'No especificado'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Teléfono</p>
                                    <p className="text-sm text-gray-600">{workOrder.client?.phone || 'No especificado'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Cliente desde</p>
                                    <p className="text-sm text-gray-600">
                                        {workOrder.client?.createdAt ? new Date(workOrder.client.createdAt).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    )}

                    {/* Información del vehículo */}
                    {workOrder.vehicle && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Car className="h-5 w-5" />
                                <span>Información del Vehículo</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Marca y Modelo</p>
                                    <p className="text-sm text-gray-600">
                                        {workOrder.vehicle?.make || ''} {workOrder.vehicle?.model || ''}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Año</p>
                                    <p className="text-sm text-gray-600">{workOrder.vehicle?.year || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Placa</p>
                                    <p className="text-sm text-gray-600">{workOrder.vehicle?.licensePlate || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Color</p>
                                    <p className="text-sm text-gray-600">{workOrder.vehicle?.color || 'No especificado'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium">VIN</p>
                                    <p className="text-sm text-gray-600">{workOrder.vehicle?.vin || 'No especificado'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    )}

                    {/* Información de la cotización */}
                    {workOrder.quotation && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5" />
                                <span>Información de la Cotización</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Número de Cotización</p>
                                    <p className="text-sm text-gray-600">#{workOrder.quotation?.quotationNumber || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Estado de Cotización</p>
                                    <Badge variant="outline">
                                        {workOrder.quotation?.status === 'ACCEPTED' ? 'Aceptada' :
                                            workOrder.quotation?.status === 'PENDING' ? 'Pendiente' :
                                                workOrder.quotation?.status === 'REJECTED' ? 'Rechazada' : workOrder.quotation?.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Fecha de Cotización</p>
                                    <p className="text-sm text-gray-600">
                                        {workOrder.quotation?.createdAt ? new Date(workOrder.quotation.createdAt).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Total de Cotización</p>
                                    <p className="text-sm text-gray-600">
                                        ${workOrder.quotation?.estimatedTotal?.toLocaleString() || '0'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    )}

                    {/* Items de la orden */}
                    {workOrder.orderItems && workOrder.orderItems.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Productos Utilizados</CardTitle>
                                <CardDescription>
                                    Lista de productos y servicios utilizados en esta orden
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {workOrder.orderItems.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                            <div>
                                                <p className="font-medium">{item.product?.name || 'Producto no encontrado'}</p>
                                                <p className="text-sm text-gray-600">
                                                    Código: {item.product?.code || 'N/A'} | Cantidad: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${item.unitPrice?.toLocaleString() || '0'}</p>
                                                <p className="text-sm text-gray-600">
                                                    Subtotal: ${(item.quantity * (item.unitPrice || 0)).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between items-center font-semibold">
                                        <span>Total de Productos</span>
                                        <span>
                                            ${workOrder.orderItems.reduce((total: number, item: any) =>
                                                total + (item.quantity * (item.unitPrice || 0)), 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Información de venta si existe */}
                    {workOrder.sale && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <DollarSign className="h-5 w-5" />
                                    <span>Información de Venta</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium">Número de Venta</p>
                                        <p className="text-sm text-gray-600">#{workOrder.sale.saleNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Estado de Pago</p>
                                        <Badge variant={
                                            workOrder.sale.paymentStatus === 'paid' ? 'default' :
                                                workOrder.sale.paymentStatus === 'pending' ? 'secondary' :
                                                    workOrder.sale.paymentStatus === 'partial' ? 'outline' : 'destructive'
                                        }>
                                            {workOrder.sale.paymentStatus === 'paid' ? 'Pagado' :
                                                workOrder.sale.paymentStatus === 'pending' ? 'Pendiente' :
                                                    workOrder.sale.paymentStatus === 'partial' ? 'Parcial' :
                                                        workOrder.sale.paymentStatus === 'overdue' ? 'Vencido' : workOrder.sale.paymentStatus}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Método de Pago</p>
                                        <p className="text-sm text-gray-600">{workOrder.sale.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Total de Venta</p>
                                        <p className="text-sm text-gray-600">${workOrder.sale.total?.toLocaleString() || '0'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
