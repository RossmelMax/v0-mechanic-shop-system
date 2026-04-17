import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface ReportData {
  totalClients: number;
  totalVehicles: number;
  totalQuotations: number;
  totalWorkOrders: number;
  totalSales: number;
  totalRevenue: number;
  pendingQuotations: number;
  pendingWorkOrders: number;
  pendingPayments: number;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    workOrders: number;
    sales: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
  topClients: Array<{
    clientId: string;
    clientName: string;
    totalSpent: number;
    workOrdersCount: number;
  }>;
  workOrderStatus: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  salesByPaymentMethod: Array<{
    method: string;
    count: number;
    total: number;
  }>;
}

// Hook para datos del dashboard
export function useDashboardReport() {
  const { data, error, isLoading, mutate } = useSWR<ReportData>(
    "/api/reports/dashboard",
    fetcher,
  );

  return {
    report: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para reportes de ventas por período
export function useSalesReport(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const url = `/api/reports/sales${params.toString() ? `?${params.toString()}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    salesReport: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para reportes de productos
export function useProductsReport() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/reports/products",
    fetcher,
  );

  return {
    productsReport: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}

// Hook para reportes de clientes
export function useClientsReport() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/reports/clients",
    fetcher,
  );

  return {
    clientsReport: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
