import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener diagnósticos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const quotationId = searchParams.get('quotationId')
    const vehicleId = searchParams.get('vehicleId')

    const diagnostics = await prisma.diagnostic.findMany({
      where: {
        ...(quotationId ? { quotationId } : {}),
        ...(vehicleId ? { vehicleId } : {}),
      },
      include: {
        quotation: true,
        vehicle: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(diagnostics)
  } catch (error) {
    console.error('Error fetching diagnostics:', error)
    return NextResponse.json(
      { error: 'Error al obtener diagnósticos' },
      { status: 500 }
    )
  }
}

// POST - Crear diagnóstico
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.quotationId || !data.vehicleId) {
      return NextResponse.json(
        { error: 'quotationId y vehicleId son requeridos' },
        { status: 400 }
      )
    }

    const diagnostic = await prisma.diagnostic.create({
      data: {
        quotationId: data.quotationId,
        vehicleId: data.vehicleId,
        faultType: data.faultType || 'MANUAL_INSPECTION',
        faultCodes: data.faultCodes ? JSON.stringify(data.faultCodes) : null,
        relatedFaultId: data.relatedFaultId || null,
        symptoms: data.symptoms || '',
        affectedSystems: data.affectedSystems ? JSON.stringify(data.affectedSystems) : null,
        severity: data.severity || 'MEDIUM',
        detailedAnalysis: data.detailedAnalysis || null,
        recommendedFix: data.recommendedFix || null,
        relatedFaults: data.relatedFaults ? JSON.stringify(data.relatedFaults) : null,
        imagesUrls: data.imagesUrls ? JSON.stringify(data.imagesUrls) : null,
      },
      include: {
        quotation: true,
        vehicle: true,
      },
    })

    return NextResponse.json(diagnostic, { status: 201 })
  } catch (error: any) {
    console.error('Error creating diagnostic:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Cotización o vehículo no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al crear diagnóstico' },
      { status: 500 }
    )
  }
}
