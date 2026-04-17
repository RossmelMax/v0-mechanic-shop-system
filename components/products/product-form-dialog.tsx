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
import { toast } from '@/hooks/use-toast'

const productSchema = z.object({
    code: z.string().min(1, 'El código es requerido'),
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().optional(),
    category: z.string().min(1, 'La categoría es requerida'),
    price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
    cost: z.number().min(0).optional(),
    quantity: z.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
    unit: z.string().min(1, 'La unidad es requerida'),
    supplier: z.string().optional(),
    minStock: z.number().min(0, 'El stock mínimo debe ser mayor o igual a 0'),
    maxStock: z.number().min(0, 'El stock máximo debe ser mayor o igual a 0'),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product?: any
    onSuccess: () => void
}

const categories = [
    'Repuestos',
    'Aceites y Lubricantes',
    'Filtros',
    'Baterías',
    'Neumáticos',
    'Herramientas',
    'Accesorios',
    'Otros',
]

const units = [
    'pieza',
    'litro',
    'kg',
    'metro',
    'caja',
    'paquete',
    'unidad',
]

export function ProductFormDialog({
    open,
    onOpenChange,
    product,
    onSuccess,
}: ProductFormDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            code: '',
            name: '',
            description: '',
            category: '',
            price: 0,
            cost: 0,
            quantity: 0,
            unit: 'pieza',
            supplier: '',
            minStock: 5,
            maxStock: 100,
        },
    })

    useEffect(() => {
        if (product) {
            form.reset({
                code: product.code,
                name: product.name,
                description: product.description || '',
                category: product.category,
                price: product.price,
                cost: product.cost || 0,
                quantity: product.quantity,
                unit: product.unit,
                supplier: product.supplier || '',
                minStock: product.minStock,
                maxStock: product.maxStock,
            })
        } else {
            form.reset({
                code: '',
                name: '',
                description: '',
                category: '',
                price: 0,
                cost: 0,
                quantity: 0,
                unit: 'pieza',
                supplier: '',
                minStock: 5,
                maxStock: 100,
            })
        }
    }, [product, form])

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true)
        try {
            const url = product ? `/api/products/${product.id}` : '/api/products'
            const method = product ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Error al guardar el producto')
            }

            toast({
                title: product ? 'Producto actualizado' : 'Producto creado',
                description: product
                    ? 'El producto ha sido actualizado exitosamente.'
                    : 'El producto ha sido creado exitosamente.',
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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Editar Producto' : 'Crear Producto'}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? 'Modifica los detalles del producto.'
                            : 'Agrega un nuevo producto al inventario.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: REP001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del producto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descripción del producto..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>
                                                        {category}
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
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidad</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {units.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>
                                                        {unit}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio de Venta</FormLabel>
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

                            <FormField
                                control={form.control}
                                name="cost"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Costo</FormLabel>
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

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="1"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="minStock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Mínimo</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="1"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxStock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Máximo</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="1"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="supplier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proveedor</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre del proveedor" {...field} />
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
                                {isLoading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}