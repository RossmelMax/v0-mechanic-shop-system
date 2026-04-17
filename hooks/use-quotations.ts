import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface QuotationItem {
  id: string;
  quotationId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    code: string;
  };
}

export interface Diagnostic {
  id: string;
  quotationId: string;
  vehicleId: string;
  faultType: string;
  faultCodes?: string;
  symptoms: string;
  severity: string;
  detailedAnalysis?: string;
  recommendedFix?: string;
  createdAt: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  clientId: string;
  vehicleId: string;
  status:
    | "pending"
    | "in_diagnosis"
    | "quoted"
    | "accepted"
    | "rejected"
    | "converted_to_order";
  estimatedTotal?: number;
  diagnosisDate?: string;
  diagnosisMechanicNotes?: string;
  externalDiagnosisCode?: string;
  createdAt: string;
  updatedAt: string;
  quotationDate: string;
  client: {
    id: string;
    name: string;
  };
  vehicle: {
    id: string;
    make: string;
    model: string;
    licensePlate: string;
  };
  diagnostics: Diagnostic[];
  quotationItems: QuotationItem[];
  workOrder?: any;
}

// Hook para obtener todas las cotizaciones
export function useQuotations() {
  const { data, error, isLoading, mutate } = useSWR<Quotation[]>(
    "/api/quotations",
    fetcher,
  );

  return {
    quotations: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para obtener cotizaciones de un cliente
export function useClientQuotations(clientId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Quotation[]>(
    clientId ? `/api/quotations?clientId=${clientId}` : null,
    fetcher,
  );

  return {
    quotations: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para obtener una cotización específica
export function useQuotation(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Quotation>(
    id ? `/api/quotations/${id}` : null,
    fetcher,
  );

  return {
    quotation: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para obtener diagnósticos de una cotización
export function useQuotationDiagnostics(quotationId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Diagnostic[]>(
    quotationId ? `/api/diagnostics?quotationId=${quotationId}` : null,
    fetcher,
  );

  return {
    diagnostics: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
