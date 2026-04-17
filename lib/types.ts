// Types for the mechanic shop system
// Using Prisma generated types for type safety

import type {
  Client,
  Vehicle,
  Quotation,
  WorkOrder,
  OrderItem,
  Sale,
  Product,
  Diagnostic,
  FaultDatabase,
  QuotationItem,
} from "@prisma/client";

export type {
  Client,
  Vehicle,
  Quotation,
  WorkOrder,
  OrderItem,
  Sale,
  Product,
  Diagnostic,
  FaultDatabase,
  QuotationItem,
};

// Additional utility types
export interface ClientWithRelations extends Client {
  vehicles: Vehicle[];
  quotations: Quotation[];
  workOrders: WorkOrder[];
  sales: Sale[];
}

export interface VehicleWithRelations extends Vehicle {
  client: Client;
  quotations: Quotation[];
  workOrders: WorkOrder[];
  diagnostics: Diagnostic[];
}

export interface WorkOrderWithRelations extends WorkOrder {
  quotation: Quotation;
  client: Client;
  vehicle: Vehicle;
  orderItems: OrderItem[];
  sale?: Sale;
}

export interface QuotationWithRelations extends Quotation {
  client: Client;
  vehicle: Vehicle;
  diagnostics: Diagnostic[];
  quotationItems: QuotationItem[];
  workOrder?: WorkOrder;
}

export interface SaleWithRelations extends Sale {
  client: Client;
  workOrder: WorkOrderWithRelations;
}

// Report types
export interface SalesReport {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  salesByMonth: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
}

export interface ProductsReport {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
}

export interface ClientsReport {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  topClients: Array<{
    clientId: string;
    clientName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

export interface DashboardStats {
  totalClients: number;
  totalVehicles: number;
  totalQuotations: number;
  totalWorkOrders: number;
  totalSales: number;
  totalRevenue: number;
  pendingQuotations: number;
  inProgressWorkOrders: number;
  completedWorkOrders: number;
  lowStockProducts: number;
}
