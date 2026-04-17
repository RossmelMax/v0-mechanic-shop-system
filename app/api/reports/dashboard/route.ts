import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Estadísticas generales
    const [
      totalClients,
      totalVehicles,
      totalQuotations,
      totalWorkOrders,
      totalSales,
      totalRevenue,
      pendingQuotations,
      pendingWorkOrders,
      pendingPayments,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.vehicle.count(),
      prisma.quotation.count(),
      prisma.workOrder.count(),
      prisma.sale.count(),
      prisma.sale.aggregate({
        _sum: { total: true },
      }),
      prisma.quotation.count({
        where: { status: "pending" },
      }),
      prisma.workOrder.count({
        where: { status: { in: ["pending", "in_progress"] } },
      }),
      prisma.sale.count({
        where: { paymentStatus: { in: ["pending", "partial", "overdue"] } },
      }),
    ]);

    // Ingresos mensuales (últimos 12 meses)
    const monthlyRevenue = await prisma.$queryRaw<
      Array<{
        month: string;
        revenue: number;
        workOrders: number;
        sales: number;
      }>
    >`
      SELECT
        strftime('%Y-%m', createdAt) as month,
        COALESCE(SUM(total), 0) as revenue,
        COUNT(*) as sales,
        (
          SELECT COUNT(*)
          FROM WorkOrder
          WHERE strftime('%Y-%m', WorkOrder.createdAt) = strftime('%Y-%m', Sale.createdAt)
        ) as workOrders
      FROM Sale
      WHERE createdAt >= datetime('now', '-12 months')
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month DESC
    `;

    // Productos más vendidos
    const topProducts = await prisma.$queryRaw<
      Array<{
        productId: string;
        productName: string;
        totalSold: number;
        revenue: number;
      }>
    >`
      SELECT
        p.id as productId,
        p.name as productName,
        COALESCE(SUM(oi.quantity), 0) as totalSold,
        COALESCE(SUM(oi.subtotal), 0) as revenue
      FROM Product p
      LEFT JOIN OrderItem oi ON p.id = oi.productId
      LEFT JOIN WorkOrder wo ON oi.workOrderId = wo.id
      WHERE wo.status = 'completed'
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT 10
    `;

    // Clientes más importantes
    const topClients = await prisma.$queryRaw<
      Array<{
        clientId: string;
        clientName: string;
        totalSpent: number;
        workOrdersCount: number;
      }>
    >`
      SELECT
        c.id as clientId,
        c.name as clientName,
        COALESCE(SUM(s.total), 0) as totalSpent,
        COUNT(DISTINCT wo.id) as workOrdersCount
      FROM Client c
      LEFT JOIN Sale s ON c.id = s.clientId
      LEFT JOIN WorkOrder wo ON s.workOrderId = wo.id
      GROUP BY c.id, c.name
      ORDER BY totalSpent DESC
      LIMIT 10
    `;

    // Estado de órdenes de trabajo
    const workOrderStatus = await prisma.workOrder.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const statusMap = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    workOrderStatus.forEach((item) => {
      statusMap[item.status as keyof typeof statusMap] = item._count.status;
    });

    // Ventas por método de pago
    const salesByPaymentMethod = await prisma.sale.groupBy({
      by: ["paymentMethod"],
      _count: { paymentMethod: true },
      _sum: { total: true },
    });

    const paymentMethods = salesByPaymentMethod.map((item) => ({
      method: item.paymentMethod,
      count: item._count.paymentMethod,
      total: item._sum.total || 0,
    }));

    return NextResponse.json({
      totalClients,
      totalVehicles,
      totalQuotations,
      totalWorkOrders,
      totalSales,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingQuotations,
      pendingWorkOrders,
      pendingPayments,
      monthlyRevenue,
      topProducts,
      topClients,
      workOrderStatus: statusMap,
      salesByPaymentMethod: paymentMethods,
    });
  } catch (error) {
    console.error("Error fetching dashboard report:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
