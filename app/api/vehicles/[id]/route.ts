import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET - Obtener un vehículo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        client: true,
        quotations: true,
        orders: true,
        diagnostics: true,
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Error al obtener vehículo' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar vehículo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        make: data.make || undefined,
        model: data.model || undefined,
        year: data.year ? parseInt(data.year) : undefined,
        licensePlate: data.licensePlate || undefined,
        vin: data.vin || undefined,
        type: data.type || undefined,
        fuelType: data.fuelType || undefined,
        transmission: data.transmission || undefined,
        mileage: data.mileage ? parseInt(data.mileage) : undefined,
        color: data.color || undefined,
        engineType: data.engineType || undefined,
        notes: data.notes || undefined,
      },
    })

    return NextResponse.json(vehicle)
  } catch (error: any) {
    console.error('Error updating vehicle:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un vehículo con esa placa' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Error al actualizar vehículo' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar vehículo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.vehicle.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting vehicle:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vehículo no encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Error al eliminar vehículo' },
      { status: 500 }
    )
  }
}
