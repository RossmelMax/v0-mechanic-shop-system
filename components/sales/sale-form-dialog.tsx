'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useWorkOrders } from '@/hooks/use-orders'
import { toast } from '@/hooks/use-toast'
import { Calculator } from 'lucide-react'
import { Sale, WorkOrderWithRelations } from '@/lib/types'

const saleSchema = z.object({
    workOrderId: z.string().min(1, 'Debe seleccionar una orden de trabajo'),
    paymentMethod: z.string().min(1, 'El método de pago es requerido'),
    paymentStatus: z.enum(['pending', 'partial', 'paid', 'overdue']),
    discount: z.number().min(0).optional(),
    notes: z.string().optional(),
})

type SaleFormData = z.infer<typeof saleSchema>

const normalizeSalePaymentStatus = (status: string) => {
    const normalized = status.toLowerCase()
    return normalized === 'paid' || normalized === 'partial' || normalized === 'overdue'
        ? normalized
        : 'pending'
}

interface SaleFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    sale?: Sale
    onSuccess: () => void
}

const paymentMethods = [
    'Efectivo',
    'Tarjeta de Crédito',
    'Tarjeta de Débito',
    'Transferencia',
    'Cheque',
    'Crédito',
]

export function SaleFormDialog({
    open,
    onOpenChange,
    sale,
    onSuccess,
}: SaleFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderWithRelations | null>(null)
    const { workOrders } = useWorkOrders()

    const form = useForm<SaleFormData>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            workOrderId: '',
            paymentMethod: '',
            paymentStatus: 'pending',
            discount: 0,
            notes: '',
        },
    })

    useEffect(() => {
        if (sale) {
            form.reset({
                workOrderId: sale.workOrderId,
                paymentMethod: sale.paymentMethod,
                paymentStatus: normalizeSalePaymentStatus(sale.paymentStatus),
                discount: sale.discount || 0,
                notes: sale.notes || '',
            })
            // Buscar la orden de trabajo seleccionada
            const workOrder = workOrders.find(wo => wo.id === sale.workOrderId)
            setSelectedWorkOrder(workOrder || null)
        } else {
            form.reset({
                workOrderId: '',
                paymentMethod: '',
                paymentStatus: 'pending',
                discount: 0,
                notes: '',
            })
            setSelectedWorkOrder(null)
        }
    }, [sale, workOrders, form])

    // Filtrar solo órdenes completadas que no tienen venta
    const availableWorkOrders = workOrders.filter(wo => wo.status === 'COMPLETED' && !wo.sale)

    const handleWorkOrderChange = (workOrderId: string) => {
        const workOrder = workOrders.find(wo => wo.id === workOrderId)
        setSelectedWorkOrder(workOrder || null)
        form.setValue('workOrderId', workOrderId)
    }

    // Calcular totales
    const calculateTotals = () => {
        if (!selectedWorkOrder) return { subtotal: 0, tax: 0, discount: 0, total: 0 }

        const discount = form.watch('discount') || 0
        const subtotal = selectedWorkOrder.orderItems?.reduce((sum: number, item: any) =>
            sum + (item.quantity * item.unitPrice), 0
        ) || 0

        const tax = subtotal * 0.13 // IVA del 13%
        const total = subtotal + tax - discount

        return { subtotal, tax, discount, total }
    }

    const { subtotal, tax, discount, total } = calculateTotals()

    const onSubmit = async (data: SaleFormData) => {
        setIsLoading(true)
        try {
            const saleData = {
                ...data,
                subtotal,
                tax,
                total,
            }

            const url = sale ? `/api/sales/${sale.id}` : '/api/sales'
            const method = sale ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al guardar la venta')
            }

            toast({
                title: sale ? 'Venta actualizada' : 'Venta creada',
                description: sale
                    ? 'La venta ha sido actualizada exitosamente.'
                    : 'La venta ha sido creada exitosamente.',
            })

            onSuccess()
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Error desconocido',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {sale ? 'Editar Venta' : 'Crear Venta'}
                    </DialogTitle>
                    <DialogDescription>
                        {sale
                            ? 'Modifica los detalles de la venta.'
                            : 'Convierte una orden de trabajo completada en una venta.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="workOrderId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Orden de Trabajo</FormLabel>
                                    <Select
                                        onValueChange={handleWorkOrderChange}
                                        value={field.value}
                                        disabled={!!sale}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una orden completada" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableWorkOrders.map((workOrder) => (
                                                <SelectItem key={workOrder.id} value={workOrder.id}>
                                                    #{workOrder.workOrderNumber} - {workOrder.client.name} - {workOrder.vehicle.make} {workOrder.vehicle.model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Información de la orden seleccionada */}
                        {selectedWorkOrder && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">Información de la Orden</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Cliente:</span> {selectedWorkOrder.client.name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Vehículo:</span> {selectedWorkOrder.vehicle.make} {selectedWorkOrder.vehicle.model} ({selectedWorkOrder.vehicle.year})
                                        </div>
                                    </div>
                                    {selectedWorkOrder.orderItems && selectedWorkOrder.orderItems.length > 0 && (
                                        <div>
                                            <span className="font-medium text-sm">Productos/Servicios:</span>
                                            <div className="mt-2 space-y-1">
                                                {selectedWorkOrder.orderItems.map((item: any, index: number) => (
                                                    <div key={index} className="text-xs text-gray-600 flex justify-between">
                                                        <span>{item.product?.name || 'Producto no encontrado'}</span>
                                                        <span>{item.quantity} x ${item.unitPrice?.toLocaleString()} = ${(item.quantity * item.unitPrice).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Método de Pago</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona método de pago" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {paymentMethods.map((method) => (
                                                    <SelectItem key={method} value={method}>
                                                        {method}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado del Pago</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="pending">Pendiente</SelectItem>
                                                <SelectItem value="partial">Parcial</SelectItem>
                                                <SelectItem value="paid">Pagado</SelectItem>
                                                <SelectItem value="overdue">Vencido</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descuento</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Cálculo automático de totales */}
                        {selectedWorkOrder && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-sm">
                                        <Calculator className="h-4 w-4" />
                                        <span>Cálculo de Totales</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>${subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>IVA (13%):</span>
                                        <span>${tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Descuento:</span>
                                        <span>-${discount.toLocaleString()}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total:</span>
                                        <span className="text-lg">${total.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notas adicionales sobre la venta..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading || !selectedWorkOrder}>
                                {isLoading ? 'Guardando...' : (sale ? 'Actualizar' : 'Crear Venta')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}