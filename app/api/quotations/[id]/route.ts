import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener una cotización específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
        vehicle: true,
        diagnostics: {
          include: {
            quotation: false,
          },
        },
        quotationItems: {
          include: {
            product: true,
          },
        },
        workOrder: true,
      },
    })

    if (!quotation) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(quotation)
  } catch (error) {
    console.error('Error fetching quotation:', error)
    return NextResponse.json(
      { error: 'Error al obtener cotización' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cotización
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const quotation = await prisma.quotation.update({
      where: { id },
      data: {
        status: data.status || undefined,
        estimatedTotal: data.estimatedTotal !== undefined ? data.estimatedTotal : undefined,
        diagnosisDate: data.diagnosisDate ? new Date(data.diagnosisDate) : undefined,
        diagnosisMechanicNotes: data.diagnosisMechanicNotes || undefined,
        externalDiagnosisCode: data.externalDiagnosisCode || undefined,
      },
      include: {
        client: true,
        vehicle: true,
        diagnostics: true,
        quotationItems: true,
      },
    })

    return NextResponse.json(quotation)
  } catch (error: any) {
    console.error('Error updating quotation:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar cotización' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cotización
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.quotation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting quotation:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar cotización' },
      { status: 500 }
    )
  }
}
