import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener todos los vehículos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('clientId')

    const vehicles = await prisma.vehicle.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Error al obtener vehículos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo vehículo
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validación básica
    if (!data.clientId || !data.make || !data.model || !data.year || !data.licensePlate) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (clientId, make, model, year, licensePlate)' },
        { status: 400 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        clientId: data.clientId,
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        licensePlate: data.licensePlate,
        vin: data.vin || null,
        type: data.type || 'auto',
        fuelType: data.fuelType || null,
        transmission: data.transmission || null,
        mileage: data.mileage ? parseInt(data.mileage) : null,
        color: data.color || null,
        engineType: data.engineType || 'NO_COMPUTER',
        notes: data.notes || null,
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error: any) {
    console.error('Error creating vehicle:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un vehículo con esa placa' },
        { status: 409 }
      )
    }
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al crear vehículo' },
      { status: 500 }
    )
  }
}
