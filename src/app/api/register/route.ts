import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { registrationSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const name = parsed.data.name.trim();
    const email = parsed.data.email.trim().toLowerCase();
    const registrationNumber = parsed.data.registrationNumber.trim().toUpperCase();
    const password = parsed.data.password;

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
