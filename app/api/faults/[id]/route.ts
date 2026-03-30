import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener una falla específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const fault = await prisma.faultDatabase.findUnique({
      where: { id },
    })

    if (!fault) {
      return NextResponse.json(
        { error: 'Falla no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(fault)
  } catch (error) {
    console.error('Error fetching fault:', error)
    return NextResponse.json(
      { error: 'Error al obtener falla' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar falla
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const fault = await prisma.faultDatabase.update({
      where: { id },
      data: {
        title: data.title || undefined,
        code: data.code || undefined,
        description: data.description || undefined,
        symptoms: data.symptoms || undefined,
        keywords: data.keywords ? JSON.stringify(data.keywords) : undefined,
        affectedSystems: data.affectedSystems ? JSON.stringify(data.affectedSystems) : undefined,
        vehicleTypes: data.vehicleTypes ? JSON.stringify(data.vehicleTypes) : undefined,
        vehicleMakes: data.vehicleMakes ? JSON.stringify(data.vehicleMakes) : undefined,
        commonCauses: data.commonCauses ? JSON.stringify(data.commonCauses) : undefined,
        solutionProcess: data.solutionProcess ? JSON.stringify(data.solutionProcess) : undefined,
        estimatedTime: data.estimatedTime || undefined,
        estimatedCost: data.estimatedCost || undefined,
        requiredParts: data.requiredParts ? JSON.stringify(data.requiredParts) : undefined,
        tools: data.tools ? JSON.stringify(data.tools) : undefined,
        relatedFaults: data.relatedFaults ? JSON.stringify(data.relatedFaults) : undefined,
        imagesUrls: data.imagesUrls ? JSON.stringify(data.imagesUrls) : undefined,
        videoUrl: data.videoUrl || undefined,
        relatedDocLink: data.relatedDocLink || undefined,
        isCommon: data.isCommon !== undefined ? data.isCommon : undefined,
        severity: data.severity || undefined,
        computerRequired: data.computerRequired !== undefined ? data.computerRequired : undefined,
      },
    })

    return NextResponse.json(fault)
  } catch (error: any) {
    console.error('Error updating fault:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Falla no encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar falla' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar falla
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.faultDatabase.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting fault:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Falla no encontrada' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar falla' },
      { status: 500 }
    )
  }
}
