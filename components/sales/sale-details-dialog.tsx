'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { DollarSign, CreditCard, Calendar, User, Car, FileText, Receipt } from 'lucide-react'
import { SaleWithRelations } from '@/lib/types'

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

const normalizePaymentStatusKey = (status: string): keyof typeof paymentStatusColors => {
    const normalized = status.toLowerCase()

    if (normalized === 'paid') return 'paid'
    if (normalized === 'partial') return 'partial'
    if (normalized === 'overdue') return 'overdue'
    return 'pending'
}

interface SaleDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sale: SaleWithRelations | null
}

export function SaleDetailsDialog({
    open,
    onOpenChange,
    sale,
}: SaleDetailsDialogProps) {
    if (!sale) return null

    const paymentStatusKey = normalizePaymentStatusKey(sale.paymentStatus)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5" />
                        <span>Venta #{sale.saleNumber}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Detalles completos de la venta
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Información básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Información de la Venta
                                <Badge className={paymentStatusColors[paymentStatusKey]}>
                                    {paymentStatusLabels[paymentStatusKey]}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Receipt className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Número de Venta</p>
                                        <p className="text-sm text-gray-600">{sale.saleNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Fecha de Venta</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(sale.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Método de Pago</p>
                                        <p className="text-sm text-gray-600">{sale.paymentMethod}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Estado del Pago</p>
                                        <Badge variant="outline" className={paymentStatusColors[paymentStatusKey]}>
                                            {paymentStatusLabels[paymentStatusKey]}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            {sale.notes && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Notas</p>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                        {sale.notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Información del cliente */}
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
                                    <p className="text-sm text-gray-600">{sale.client.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-gray-600">{sale.client.email || 'No especificado'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Teléfono</p>
                                    <p className="text-sm text-gray-600">{sale.client.phone || 'No especificado'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Cliente desde</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(sale.client.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información del vehículo y orden de trabajo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Car className="h-5 w-5" />
                                <span>Información del Vehículo y Orden</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Vehículo</p>
                                    <p className="text-sm text-gray-600">
                                        {sale.workOrder.vehicle.make} {sale.workOrder.vehicle.model} ({sale.workOrder.vehicle.year})
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Placa</p>
                                    <p className="text-sm text-gray-600">{sale.workOrder.vehicle.licensePlate}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Número de Orden</p>
                                    <p className="text-sm text-gray-600">#{sale.workOrder.workOrderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Fecha de Orden</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(sale.workOrder.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Desglose de productos/servicios */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Productos y Servicios</CardTitle>
                            <CardDescription>
                                Detalle de los productos y servicios incluidos en esta venta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Aquí necesitaríamos acceder a los orderItems de la workOrder */}
                                {/* Por ahora, mostraremos un mensaje ya que no tenemos acceso directo */}
                                <div className="text-center py-8 text-gray-500">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Los detalles de productos/servicios están disponibles en la orden de trabajo asociada.</p>
                                    <p className="text-sm mt-2">
                                        Orden #{sale.workOrder.workOrderNumber} - {sale.workOrder.client.name}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resumen financiero */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5" />
                                <span>Resumen Financiero</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Subtotal:</span>
                                    <span className="text-sm">${sale.subtotal?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">IVA (13%):</span>
                                    <span className="text-sm">${sale.tax?.toLocaleString() || '0'}</span>
                                </div>
                                {sale.discount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Descuento:</span>
                                        <span className="text-sm text-red-600">-${sale.discount?.toLocaleString() || '0'}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total:</span>
                                    <span>${sale.total?.toLocaleString() || '0'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog >
    )
}