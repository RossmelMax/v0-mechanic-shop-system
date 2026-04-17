import { QuotationsTable } from "@/components/quotations/quotations-table";
import { QuickIntakeDialog } from "@/components/quotations/quick-intake-dialog";

export const metadata = {
  title: "Cotizaciones - AutoMec",
};

export default function QuotationsPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera limpia con solo el botón de acción a la derecha */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de Cotizaciones
        </h1>
        <QuickIntakeDialog />
      </div>

      {/* La tabla ahora respira mejor sin títulos encima */}
      <QuotationsTable />
    </div>
  );
}
