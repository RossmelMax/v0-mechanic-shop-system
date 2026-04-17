"use client";

import { useQuotations } from "@/hooks/use-quotations";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Trash2, ArrowRightCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

export function QuotationsTable() {
  const { quotations, isLoading, mutate } = useQuotations();
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro que desea eliminar esta cotización?")) {
      try {
        await fetch(`/api/quotations/${id}`, { method: "DELETE" });
        mutate();
      } catch (error) {
        console.error("Error deleting quotation:", error);
      }
    }
  };

  const handleConvertToOrder = async (id: string) => {
    if (
      !confirm(
        "¿El cliente aprobó el presupuesto? Esto creará una Orden de Trabajo automáticamente.",
      )
    )
      return;

    setConvertingId(id);
    try {
      const res = await fetch(`/api/quotations/${id}/convert`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error al convertir");

      const newOrder = await res.json();

      toast({
        title: "¡Orden de Trabajo Generada! 🛠️",
        description: `El vehículo ya está en cola de trabajo (${newOrder.workOrderNumber}).`,
      });

      // FIX: Usamos window.location.href para forzar un refresh total y que
      // la página de órdenes cargue la nueva info de la DB.
      window.location.href = "/orders";
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar la orden de trabajo.",
        variant: "destructive",
      });
    } finally {
      setConvertingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (quotations.length === 0) {
    return (
      <div className="space-y-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText className="w-8 h-8 text-gray-400" />
            </EmptyMedia>
            <EmptyTitle>Sin cotizaciones</EmptyTitle>
            <EmptyDescription>
              Comienza creando una nueva cotización rápida desde arriba.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Mostrando{" "}
          <span className="text-gray-900 font-bold">{quotations.length}</span>{" "}
          registros
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Total Estimado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((quotation) => {
              const statusInfo = statusLabels[quotation.status] || {
                label: "Desconocido",
                color: "bg-gray-100 text-gray-800",
              };
              const isConverted = quotation.status === "converted_to_order";

              return (
                <TableRow
                  key={quotation.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="font-mono font-semibold text-blue-600">
                    {quotation.quotationNumber}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {quotation.client.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {quotation.vehicle.make} {quotation.vehicle.model}
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">
                        {quotation.vehicle.licensePlate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusInfo.color} border-none font-medium`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {quotation.estimatedTotal ? (
                      `$${quotation.estimatedTotal.toLocaleString()}`
                    ) : (
                      <span className="text-gray-400 italic">Por definir</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(quotation.quotationDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* Botón de Conversión (Mágico) */}
                    {!isConverted && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-purple-50 hover:text-purple-600 border-purple-200 text-purple-600 shadow-sm"
                        onClick={() => handleConvertToOrder(quotation.id)}
                        disabled={convertingId === quotation.id}
                        title="Aprobar y crear Orden de Trabajo"
                      >
                        {convertingId === quotation.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowRightCircle className="w-4 h-4" />
                        )}
                      </Button>
                    )}

                    <Link href={`/quotations/${quotation.id}?edit=true`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:text-blue-600"
                        title="Editar cotización"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(quotation.id)}
                      className="opacity-80 hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
