import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface Sale {
  id: string;
  saleNumber: string;
  workOrderId: string;
  clientId: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: "pending" | "partial" | "paid" | "overdue";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  workOrder: {
    id: string;
    workOrderNumber: string;
    client: {
      id: string;
      name: string;
      email?: string;
    };
    vehicle: {
      id: string;
      make: string;
      model: string;
      year: number;
      licensePlate: string;
    };
  };
  client: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

// Hook para ventas
export function useSales() {
  const { data, error, isLoading, mutate } = useSWR<Sale[]>(
    "/api/sales",
    fetcher,
  );

  return {
    sales: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para venta específica
export function useSale(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Sale>(
    id ? `/api/sales/${id}` : null,
    fetcher,
  );

  return {
    sale: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
