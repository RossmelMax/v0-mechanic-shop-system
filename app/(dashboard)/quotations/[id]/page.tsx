"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Save, Edit, X, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/use-products";

interface Quotation {
    id: string;
    quotationNumber: string;
    status: string;
    estimatedTotal: number | null;
    diagnosisDate: string | null;
    diagnosisMechanicNotes: string | null;
    externalDiagnosisCode: string | null;
    quotationDate: string;
    createdAt: string;
    updatedAt: string;
    client: {
        id: string;
        name: string;
        phone: string;
        email: string | null;
    };
    vehicle: {
        id: string;
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        vin: string | null;
        color: string | null;
    };
    diagnostics: Array<{
        id: string;
        faultType: string;
        faultCodes: string | null;
        relatedFaultId: string | null;
    }>;
    quotationItems: Array<{
        id: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
        product: {
            id: string;
            name: string;
            description: string | null;
        };
    }>;
}

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    in_diagnosis: { label: "En Diagnóstico", color: "bg-blue-100 text-blue-800" },
    quoted: { label: "Cotizada", color: "bg-green-100 text-green-800" },
    accepted: { label: "Aceptada", color: "bg-emerald-100 text-emerald-800" },
    rejected: { label: "Rechazada", color: "bg-red-100 text-red-800" },
    converted_to_order: {
        label: "En Taller (Orden)",
        color: "bg-purple-100 text-purple-800",
    },
};

const statusOptions = [
    { value: "pending", label: "Pendiente" },
    { value: "in_diagnosis", label: "En Diagnóstico" },
    { value: "quoted", label: "Cotizada" },
    { value: "accepted", label: "Aceptada" },
    { value: "rejected", label: "Rechazada" },
    { value: "converted_to_order", label: "Convertida a Orden" },
];

export default function QuotationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { products } = useProducts();
    const [quotation, setQuotation] = useState<Quotation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [status, setStatus] = useState("");
    const [estimatedTotal, setEstimatedTotal] = useState("");
    const [diagnosisMechanicNotes, setDiagnosisMechanicNotes] = useState("");
    const [externalDiagnosisCode, setExternalDiagnosisCode] = useState("");

    // Items management
    const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [itemQuantity, setItemQuantity] = useState("1");
    const [itemUnitPrice, setItemUnitPrice] = useState("");

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const res = await fetch(`/api/quotations/${params.id}`);
                if (!res.ok) throw new Error("Cotización no encontrada");
                const data = await res.json();
                setQuotation(data);

                // Initialize form state
                setStatus(data.status);
                setEstimatedTotal(data.estimatedTotal?.toString() || "");
                setDiagnosisMechanicNotes(data.diagnosisMechanicNotes || "");
                setExternalDiagnosisCode(data.externalDiagnosisCode || "");

                // Check if we should start in edit mode
                const editParam = searchParams.get('edit');
                if (editParam === 'true') {
                    setIsEditing(true);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "No se pudo cargar la cotización",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchQuotation();
        }
    }, [params.id, searchParams, toast]);

    const handleSave = async () => {
        if (!quotation) return;

        setIsSaving(true);
        try {
            const updateData = {
                status,
                estimatedTotal: estimatedTotal ? parseFloat(estimatedTotal) : null,
                diagnosisMechanicNotes: diagnosisMechanicNotes || null,
                externalDiagnosisCode: externalDiagnosisCode || null,
            };

            const res = await fetch(`/api/quotations/${quotation.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) throw new Error("Error al actualizar");

            const updatedQuotation = await res.json();
            setQuotation(updatedQuotation);
            setIsEditing(false);

            toast({
                title: "¡Actualizado!",
                description: "La cotización se actualizó correctamente",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar la cotización",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!quotation) return;
        setStatus(quotation.status);
        setEstimatedTotal(quotation.estimatedTotal?.toString() || "");
        setDiagnosisMechanicNotes(quotation.diagnosisMechanicNotes || "");
        setExternalDiagnosisCode(quotation.externalDiagnosisCode || "");
        setIsEditing(false);
    };

    // Item management functions
    const handleAddItem = () => {
        setEditingItem(null);
        setSelectedProductId("");
        setItemQuantity("1");
        setItemUnitPrice("");
        setIsItemDialogOpen(true);
    };

    const handleEditItem = (item: any) => {
        setEditingItem(item);
        setSelectedProductId(item.product.id);
        setItemQuantity(item.quantity.toString());
        setItemUnitPrice(item.unitPrice.toString());
        setIsItemDialogOpen(true);
    };

    const handleSaveItem = async () => {
        if (!quotation || !selectedProductId) return;

        const quantity = parseInt(itemQuantity);
        const unitPrice = parseFloat(itemUnitPrice);
        const subtotal = quantity * unitPrice;

        try {
            if (editingItem) {
                // Update existing item
                const res = await fetch(`/api/quotations/${quotation.id}/items/${editingItem.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: selectedProductId,
                        quantity,
                        unitPrice,
                        subtotal,
                    }),
                });

                if (!res.ok) throw new Error("Error al actualizar item");
            } else {
                // Add new item
                const res = await fetch(`/api/quotations/${quotation.id}/items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: selectedProductId,
                        quantity,
                        unitPrice,
                        subtotal,
                    }),
                });

                if (!res.ok) throw new Error("Error al agregar item");
            }

            // Refresh quotation data
            const res = await fetch(`/api/quotations/${quotation.id}`);
            const updatedQuotation = await res.json();
            setQuotation(updatedQuotation);

            setIsItemDialogOpen(false);
            toast({
                title: "¡Éxito!",
                description: editingItem ? "Item actualizado correctamente" : "Item agregado correctamente",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: editingItem ? "No se pudo actualizar el item" : "No se pudo agregar el item",
                variant: "destructive",
            });
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!quotation) return;

        if (!confirm("¿Está seguro que desea eliminar este item?")) return;

        try {
            const res = await fetch(`/api/quotations/${quotation.id}/items/${itemId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al eliminar item");

            // Refresh quotation data
            const refreshRes = await fetch(`/api/quotations/${quotation.id}`);
            const updatedQuotation = await refreshRes.json();
            setQuotation(updatedQuotation);

            toast({
                title: "¡Eliminado!",
                description: "Item eliminado correctamente",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo eliminar el item",
                variant: "destructive",
            });
        }
    };

    const handleProductChange = (productId: string) => {
        setSelectedProductId(productId);
        const product = products.find(p => p.id === productId);
        if (product && !editingItem) {
            setItemUnitPrice(product.price?.toString() || "");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Spinner />
            </div>
        );
    }

    if (!quotation) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Cotización no encontrada</h2>
                <p className="text-gray-600 mt-2">La cotización que buscas no existe o fue eliminada.</p>
                <Button onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
            </div>
        );
    }

    const statusInfo = statusLabels[quotation.status] || {
        label: "Desconocido",
        color: "bg-gray-100 text-gray-800",
    };

    const totalItems = quotation.quotationItems.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Cotización {quotation.quotationNumber}
                        </h1>
                        <p className="text-gray-600">
                            Creada el {format(new Date(quotation.quotationDate), "dd/MM/yyyy")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <Spinner className="w-4 h-4 mr-2" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Guardar
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Estado y Total */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Estado</Label>
                                    {isEditing ? (
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge className={`${statusInfo.color} border-none font-medium mt-1`}>
                                            {statusInfo.label}
                                        </Badge>
                                    )}
                                </div>

                                <div>
                                    <Label>Total Estimado</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={estimatedTotal}
                                            onChange={(e) => setEstimatedTotal(e.target.value)}
                                            placeholder="0.00"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold mt-1">
                                            {quotation.estimatedTotal ? (
                                                `$${quotation.estimatedTotal.toLocaleString()}`
                                            ) : (
                                                <span className="text-gray-400 italic">Por definir</span>
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Diagnóstico */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Diagnóstico</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Notas del Mecánico</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={diagnosisMechanicNotes}
                                        onChange={(e) => setDiagnosisMechanicNotes(e.target.value)}
                                        placeholder="Notas del diagnóstico..."
                                        rows={3}
                                    />
                                ) : (
                                    <p className="mt-1 text-gray-700">
                                        {quotation.diagnosisMechanicNotes || (
                                            <span className="text-gray-400 italic">Sin notas</span>
                                        )}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label>Código de Diagnóstico Externo</Label>
                                {isEditing ? (
                                    <Input
                                        value={externalDiagnosisCode}
                                        onChange={(e) => setExternalDiagnosisCode(e.target.value)}
                                        placeholder="Código DTC..."
                                    />
                                ) : (
                                    <p className="mt-1 text-gray-700">
                                        {quotation.externalDiagnosisCode || (
                                            <span className="text-gray-400 italic">Sin código</span>
                                        )}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items de Cotización */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Items de la Cotización</CardTitle>
                            {isEditing && (
                                <Button onClick={handleAddItem} size="sm" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Agregar Item
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {quotation.quotationItems.length > 0 ? (
                                <div className="space-y-3">
                                    {quotation.quotationItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product.name}</p>
                                                {item.product.description && (
                                                    <p className="text-sm text-gray-600">{item.product.description}</p>
                                                )}
                                                <p className="text-sm text-gray-600">
                                                    Cantidad: {item.quantity} × ${item.unitPrice.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">${item.subtotal.toLocaleString()}</p>
                                                {isEditing && (
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditItem(item)}
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total Items:</span>
                                        <span>${totalItems.toLocaleString()}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-gray-500 italic mb-4">No hay items registrados</p>
                                    {isEditing && (
                                        <Button onClick={handleAddItem} variant="outline" className="gap-2">
                                            <Plus className="w-4 h-4" />
                                            Agregar primer item
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Información del Cliente y Vehículo */}
                <div className="space-y-6">
                    {/* Cliente */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Cliente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-semibold text-lg">{quotation.client.name}</p>
                            <p className="text-gray-600">📞 {quotation.client.phone}</p>
                            {quotation.client.email && (
                                <p className="text-gray-600">✉️ {quotation.client.email}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Vehículo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Vehículo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-semibold text-lg">
                                {quotation.vehicle.make} {quotation.vehicle.model}
                            </p>
                            <p className="text-gray-600">📅 {quotation.vehicle.year}</p>
                            <p className="text-gray-600 font-mono">
                                🚗 {quotation.vehicle.licensePlate}
                            </p>
                            {quotation.vehicle.vin && (
                                <p className="text-gray-600 text-sm">
                                    VIN: {quotation.vehicle.vin}
                                </p>
                            )}
                            {quotation.vehicle.color && (
                                <p className="text-gray-600">🎨 {quotation.vehicle.color}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Diagnósticos */}
                    {quotation.diagnostics.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Diagnósticos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {quotation.diagnostics.map((diag) => (
                                        <div key={diag.id} className="p-2 bg-gray-50 rounded">
                                            <p className="font-medium capitalize">
                                                {diag.faultType === "COMPUTER_ERROR" ? "Error de Computadora" : "Inspección Manual"}
                                            </p>
                                            {diag.faultCodes && (
                                                <p className="text-sm text-gray-600">
                                                    Códigos: {diag.faultCodes}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Item Management Dialog */}
            <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? "Editar Item" : "Agregar Item"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Producto</Label>
                            <Select value={selectedProductId} onValueChange={handleProductChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar producto..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name} - ${product.price?.toLocaleString() || "0"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Cantidad</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={itemQuantity}
                                    onChange={(e) => setItemQuantity(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label>Precio Unitario</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={itemUnitPrice}
                                    onChange={(e) => setItemUnitPrice(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Subtotal:</span>
                            <span className="font-semibold">
                                ${(parseInt(itemQuantity || "0") * parseFloat(itemUnitPrice || "0")).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsItemDialogOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleSaveItem}>
                                {editingItem ? "Actualizar" : "Agregar"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}