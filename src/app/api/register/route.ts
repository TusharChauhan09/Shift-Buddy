import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { registrationNumber, password, name, email } = await req.json();
    if (!registrationNumber || !password) {
      return NextResponse.json({ error: "Missing registrationNumber or password" }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ registrationNumber }, { email }] },
    });
    if (existing) {
      return NextResponse.json({ error: "User with this registration number or email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { registrationNumber, passwordHash, name, email },
      select: { id: true, registrationNumber: true, name: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
