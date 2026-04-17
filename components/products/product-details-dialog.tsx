'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'

interface ProductDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: any
}

export function ProductDetailsDialog({
    open,
    onOpenChange,
    product,
}: ProductDetailsDialogProps) {
    if (!product) return null

    const stockStatus = product.quantity === 0 ? 'out' :
        product.quantity <= product.minStock ? 'low' : 'good'

    const stockStatusColor = {
        out: 'bg-red-100 text-red-800',
        low: 'bg-yellow-100 text-yellow-800',
        good: 'bg-green-100 text-green-800',
    }

    const stockStatusLabel = {
        out: 'Sin Stock',
        low: 'Stock Bajo',
        good: 'En Stock',
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>{product.name}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Código: {product.code} | Categoría: {product.category}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Información básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Información del Producto
                                <Badge className={stockStatusColor[stockStatus]}>
                                    {stockStatusLabel[stockStatus]}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium">Código</p>
                                    <p className="text-sm text-gray-600">{product.code}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Nombre</p>
                                    <p className="text-sm text-gray-600">{product.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Categoría</p>
                                    <p className="text-sm text-gray-600">{product.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Unidad</p>
                                    <p className="text-sm text-gray-600">{product.unit}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Proveedor</p>
                                    <p className="text-sm text-gray-600">{product.supplier || 'No especificado'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Fecha de Creación</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {product.description && (
                                <div>
                                    <p className="text-sm font-medium mb-2">Descripción</p>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Información de precios y stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <DollarSign className="h-5 w-5" />
                                    <span>Precios</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Precio de Venta:</span>
                                    <span className="text-sm">${product.price.toLocaleString()}</span>
                                </div>
                                {product.cost && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Costo:</span>
                                        <span className="text-sm">${product.cost.toLocaleString()}</span>
                                    </div>
                                )}
                                {product.cost && (
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Margen:</span>
                                        <span className="text-sm">
                                            ${((product.price - product.cost) || 0).toLocaleString()}
                                            ({product.cost > 0 ? (((product.price - product.cost) / product.cost) * 100).toFixed(1) : 0}%)
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Package className="h-5 w-5" />
                                    <span>Inventario</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Cantidad Actual:</span>
                                    <span className="text-sm font-semibold">{product.quantity} {product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Stock Mínimo:</span>
                                    <span className="text-sm">{product.minStock} {product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Stock Máximo:</span>
                                    <span className="text-sm">{product.maxStock} {product.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Valor Total:</span>
                                    <span className="text-sm font-semibold">
                                        ${(product.quantity * (product.cost || 0)).toLocaleString()}
                                    </span>
                                </div>
                                {product.quantity <= product.minStock && (
                                    <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-md">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm text-yellow-800">
                                            ¡Stock bajo! Considera reabastecer.
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Estadísticas de uso */}
                    {product._count && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <TrendingUp className="h-5 w-5" />
                                    <span>Estadísticas de Uso</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium">Órdenes de Trabajo</p>
                                        <p className="text-2xl font-bold">{product._count.orderItems || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Cotizaciones</p>
                                        <p className="text-2xl font-bold">{product._count.quotationItems || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Movimientos de stock recientes */}
                    {product.stockMovements && product.stockMovements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Movimientos de Stock Recientes</CardTitle>
                                <CardDescription>
                                    Últimos movimientos registrados para este producto
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {product.stockMovements.slice(0, 10).map((movement: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                            <div>
                                                <p className="font-medium">{movement.type}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(movement.createdAt).toLocaleDateString()} {new Date(movement.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Stock final: {movement.finalStock}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}