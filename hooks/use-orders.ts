import useSWR from "swr";
import { WorkOrderWithRelations, OrderItem, Sale } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type { WorkOrderWithRelations as WorkOrder, OrderItem, Sale };

// Hook para órdenes de trabajo
export function useWorkOrders() {
  const { data, error, isLoading, mutate } = useSWR<WorkOrderWithRelations[]>(
    "/api/orders",
    fetcher,
  );

  return {
    workOrders: data || [],
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para orden de trabajo específica
export function useWorkOrder(id: string) {
  const { data, error, isLoading, mutate } = useSWR<WorkOrderWithRelations>(
    id ? `/api/orders/${id}` : null,
    fetcher,
  );

  return {
    workOrder: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
