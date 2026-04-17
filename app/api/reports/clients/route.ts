import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serializeBigInt } from "@/lib/utils";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Estadísticas de clientes
    const [
      totalClients,
      activeClients,
      clientsByVehicleCount,
      topClientsByRevenue,
      topClientsByWorkOrders,
      clientRetention,
      newClientsThisMonth,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({
        where: {
          vehicles: {
            some: {},
          },
        },
      }),
      prisma.$queryRaw<
        Array<{
          clientId: string;
          clientName: string;
          vehicleCount: number;
          totalSpent: number;
        }>
      >`
        SELECT
          c.id as clientId,
          c.name as clientName,
          COUNT(v.id) as vehicleCount,
          COALESCE(SUM(s.total), 0) as totalSpent
        FROM Client c
        LEFT JOIN Vehicle v ON c.id = v.clientId
        LEFT JOIN Sale s ON c.id = s.clientId
        GROUP BY c.id, c.name
        ORDER BY totalSpent DESC
      `,
      prisma.$queryRaw<
        Array<{
          clientId: string;
          clientName: string;
          totalRevenue: number;
          workOrdersCount: number;
          averageOrderValue: number;
          lastService: string;
        }>
      >`
        SELECT
          c.id as clientId,
          c.name as clientName,
          COALESCE(SUM(s.total), 0) as totalRevenue,
          COUNT(DISTINCT wo.id) as workOrdersCount,
          COALESCE(AVG(s.total), 0) as averageOrderValue,
          MAX(wo.createdAt) as lastService
        FROM Client c
        LEFT JOIN Sale s ON c.id = s.clientId
        LEFT JOIN WorkOrder wo ON s.workOrderId = wo.id
        GROUP BY c.id, c.name
        ORDER BY totalRevenue DESC
        LIMIT 20
      `,
      prisma.$queryRaw<
        Array<{
          clientId: string;
          clientName: string;
          workOrdersCount: number;
          totalSpent: number;
          lastVisit: string;
        }>
      >`
        SELECT
          c.id as clientId,
          c.name as clientName,
          COUNT(DISTINCT wo.id) as workOrdersCount,
          COALESCE(SUM(s.total), 0) as totalSpent,
          MAX(wo.createdAt) as lastVisit
        FROM Client c
        LEFT JOIN WorkOrder wo ON c.id = wo.clientId
        LEFT JOIN Sale s ON wo.id = s.workOrderId
        GROUP BY c.id, c.name
        ORDER BY workOrdersCount DESC
        LIMIT 20
      `,
      prisma.$queryRaw<
        Array<{
          period: string;
          activeClients: number;
          newClients: number;
          returningClients: number;
        }>
      >`
        SELECT
          strftime('%Y-%m', wo.createdAt) as period,
          COUNT(DISTINCT c.id) as activeClients,
          COUNT(DISTINCT CASE WHEN strftime('%Y-%m', c.createdAt) = strftime('%Y-%m', wo.createdAt) THEN c.id END) as newClients,
          COUNT(DISTINCT CASE WHEN strftime('%Y-%m', c.createdAt) < strftime('%Y-%m', wo.createdAt) THEN c.id END) as returningClients
        FROM Client c
        JOIN WorkOrder wo ON c.id = wo.clientId
        WHERE wo.createdAt >= datetime('now', '-12 months')
        GROUP BY strftime('%Y-%m', wo.createdAt)
        ORDER BY period DESC
      `,
      prisma.client.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    // Clientes inactivos (sin servicios en los últimos 6 meses)
    const inactiveClients = await prisma.client.findMany({
      where: {
        workOrders: {
          none: {
            createdAt: {
              gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 meses
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: {
            workOrders: true,
            vehicles: true,
          },
        },
      },
      take: 50,
    });

    return NextResponse.json(serializeBigInt({
      summary: {
        totalClients,
        activeClients,
        inactiveClientsCount: inactiveClients.length,
        newClientsThisMonth,
      },
      clientsByVehicleCount,
      topClientsByRevenue,
      topClientsByWorkOrders,
      clientRetention,
      inactiveClients,
    }));
  } catch (error) {
    console.error("Error fetching clients report:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
