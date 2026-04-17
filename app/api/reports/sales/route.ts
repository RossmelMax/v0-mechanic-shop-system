import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    }

    // Estadísticas de ventas
    const [
      totalSales,
      totalRevenue,
      averageSale,
      salesByStatus,
      salesByPaymentMethod,
      dailySales,
    ] = await Promise.all([
      prisma.sale.count({ where: dateFilter }),
      prisma.sale.aggregate({
        where: dateFilter,
        _sum: { total: true, subtotal: true, tax: true, discount: true },
      }),
      prisma.sale.aggregate({
        where: dateFilter,
        _avg: { total: true },
      }),
      prisma.sale.groupBy({
        by: ["paymentStatus"],
        where: dateFilter,
        _count: { paymentStatus: true },
        _sum: { total: true },
      }),
      prisma.sale.groupBy({
        by: ["paymentMethod"],
        where: dateFilter,
        _count: { paymentMethod: true },
        _sum: { total: true },
      }),
      prisma.$queryRaw<
        Array<{
          date: string;
          sales: number;
          revenue: number;
        }>
      >(
        startDate && endDate
          ? Prisma.sql`SELECT DATE(createdAt) as date, COUNT(*) as sales, COALESCE(SUM(total), 0) as revenue FROM Sale WHERE createdAt BETWEEN ${new Date(startDate)} AND ${new Date(endDate)} GROUP BY DATE(createdAt) ORDER BY date DESC LIMIT 100`
          : Prisma.sql`SELECT DATE(createdAt) as date, COUNT(*) as sales, COALESCE(SUM(total), 0) as revenue FROM Sale WHERE 1=1 GROUP BY DATE(createdAt) ORDER BY date DESC LIMIT 30`,
      ),
    ]);

    // Ventas detalladas
    const sales = await prisma.sale.findMany({
      where: dateFilter,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        workOrder: {
          select: {
            id: true,
            workOrderNumber: true,
            vehicle: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
                licensePlate: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      summary: {
        totalSales,
        totalRevenue: totalRevenue._sum.total || 0,
        totalSubtotal: totalRevenue._sum.subtotal || 0,
        totalTax: totalRevenue._sum.tax || 0,
        totalDiscount: totalRevenue._sum.discount || 0,
        averageSale: averageSale._avg.total || 0,
      },
      salesByStatus: salesByStatus.map((item) => ({
        status: item.paymentStatus,
        count: item._count.paymentStatus,
        total: item._sum.total || 0,
      })),
      salesByPaymentMethod: salesByPaymentMethod.map((item) => ({
        method: item.paymentMethod,
        count: item._count.paymentMethod,
        total: item._sum.total || 0,
      })),
      dailySales,
      sales,
    });
  } catch (error) {
    console.error("Error fetching sales report:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
