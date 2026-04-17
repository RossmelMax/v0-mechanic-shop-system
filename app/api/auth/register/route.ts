import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 },
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Already hashed on the client
      },
    });

    return NextResponse.json(
      { message: "Usuario creado exitosamente", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 },
    );
  }
}
