import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener todas las fallas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const faults = await prisma.faultDatabase.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.faultDatabase.count()

    return NextResponse.json({
      data: faults,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching faults:', error)
    return NextResponse.json(
      { error: 'Error al obtener fallas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva falla
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.title || !data.description || !data.symptoms) {
      return NextResponse.json(
        { error: 'title, description y symptoms son requeridos' },
        { status: 400 }
      )
    }

    const fault = await prisma.faultDatabase.create({
      data: {
        title: data.title,
        code: data.code || null,
        description: data.description,
        symptoms: data.symptoms,
        keywords: JSON.stringify(data.keywords || []),
        affectedSystems: data.affectedSystems ? JSON.stringify(data.affectedSystems) : null,
        vehicleTypes: data.vehicleTypes ? JSON.stringify(data.vehicleTypes) : null,
        vehicleMakes: data.vehicleMakes ? JSON.stringify(data.vehicleMakes) : null,
        commonCauses: JSON.stringify(data.commonCauses || []),
        solutionProcess: JSON.stringify(data.solutionProcess || []),
        estimatedTime: data.estimatedTime || null,
        estimatedCost: data.estimatedCost || null,
        requiredParts: data.requiredParts ? JSON.stringify(data.requiredParts) : null,
        tools: data.tools ? JSON.stringify(data.tools) : null,
        relatedFaults: data.relatedFaults ? JSON.stringify(data.relatedFaults) : null,
        imagesUrls: data.imagesUrls ? JSON.stringify(data.imagesUrls) : null,
        videoUrl: data.videoUrl || null,
        relatedDocLink: data.relatedDocLink || null,
        isCommon: data.isCommon || false,
        severity: data.severity || 'MEDIUM',
        computerRequired: data.computerRequired || false,
      },
    })

    return NextResponse.json(fault, { status: 201 })
  } catch (error) {
    console.error('Error creating fault:', error)
    return NextResponse.json(
      { error: 'Error al crear falla' },
      { status: 500 }
    )
  }
}
