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
import { useQuotations } from '@/hooks/use-quotations'
import { toast } from '@/hooks/use-toast'
import { WorkOrder } from '@/lib/types'

const workOrderSchema = z.object({
    quotationId: z.string().min(1, 'Debe seleccionar una cotización'),
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    estimatedHours: z.number().min(0).optional(),
    actualHours: z.number().min(0).optional(),
    notes: z.string().optional(),
})

const normalizeWorkOrderStatus = (status: string) => {
    switch (status.toUpperCase()) {
        case 'PENDING':
            return 'pending'
        case 'IN_PROGRESS':
            return 'in_progress'
        case 'COMPLETED':
            return 'completed'
        case 'CANCELLED':
            return 'cancelled'
        default:
            return 'pending'
    }
}

type WorkOrderFormData = z.infer<typeof workOrderSchema>

interface WorkOrderFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workOrder?: WorkOrder
    onSuccess: () => void
}

export function WorkOrderFormDialog({
    open,
    onOpenChange,
    workOrder,
    onSuccess,
}: WorkOrderFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { quotations } = useQuotations()

    const form = useForm<WorkOrderFormData>({
        resolver: zodResolver(workOrderSchema),
        defaultValues: {
            quotationId: '',
            status: 'pending',
            startDate: '',
            endDate: '',
            estimatedHours: 0,
            actualHours: 0,
            notes: '',
        },
    })

    useEffect(() => {
        if (workOrder) {
            form.reset({
                quotationId: workOrder.quotationId,
                status: normalizeWorkOrderStatus(workOrder.status),
                startDate: workOrder.startDate ? new Date(workOrder.startDate).toISOString().split('T')[0] : '',
                endDate: workOrder.completionDate ? new Date(workOrder.completionDate).toISOString().split('T')[0] : '',
                estimatedHours: workOrder.estimatedHours || 0,
                actualHours: workOrder.actualHours || 0,
                notes: workOrder.notes || '',
            })
        } else {
            form.reset({
                quotationId: '',
                status: 'pending',
                startDate: '',
                endDate: '',
                estimatedHours: 0,
                actualHours: 0,
                notes: '',
            })
        }
    }, [workOrder, form])

    // Filtrar solo cotizaciones aceptadas que no tienen orden de trabajo
    const availableQuotations = quotations.filter(q => q.status === 'ACCEPTED')

    const onSubmit = async (data: WorkOrderFormData) => {
        setIsLoading(true)
        try {
            const url = workOrder ? `/api/orders/${workOrder.id}` : '/api/orders'
            const method = workOrder ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    startDate: data.startDate || null,
                    endDate: data.endDate || null,
                    estimatedHours: data.estimatedHours || null,
                    actualHours: data.actualHours || null,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al guardar la orden de trabajo')
            }

            toast({
                title: workOrder ? 'Orden actualizada' : 'Orden creada',
                description: workOrder
                    ? 'La orden de trabajo ha sido actualizada exitosamente.'
                    : 'La orden de trabajo ha sido creada exitosamente.',
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
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle>
                        {workOrder ? 'Editar Orden de Trabajo' : 'Crear Orden de Trabajo'}
                    </DialogTitle>
                    <DialogDescription>
                        {workOrder
                            ? 'Modifica los detalles de la orden de trabajo.'
                            : 'Crea una nueva orden de trabajo basada en una cotización aceptada.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="quotationId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cotización</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!!workOrder}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una cotización aceptada" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableQuotations.map((quotation) => (
                                                <SelectItem key={quotation.id} value={quotation.id}>
                                                    #{quotation.quotationNumber} - {quotation.client.name} - {quotation.vehicle.make} {quotation.vehicle.model}
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
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="in_progress">En Progreso</SelectItem>
                                            <SelectItem value="completed">Completada</SelectItem>
                                            <SelectItem value="cancelled">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Inicio</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Fin</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="estimatedHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Horas Estimadas</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="actualHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Horas Reales</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.5"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notas</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Notas adicionales sobre la orden de trabajo..."
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Guardando...' : (workOrder ? 'Actualizar' : 'Crear')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}