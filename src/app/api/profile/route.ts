import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getAuth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, registrationNumber } = await req.json();
  // Normalize registration number: trim + uppercase; treat empty string as undefined (no update)
  const normalizedReg = typeof registrationNumber === "string"
    ? registrationNumber.trim().toUpperCase() || undefined
    : undefined;
  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: typeof name === "string" ? (name.trim() || undefined) : undefined,
        registrationNumber: normalizedReg,
      },
      select: { id: true, name: true, registrationNumber: true },
    });
    return NextResponse.json({ user });
  } catch (e: unknown) {
    const isKnown = (x: unknown): x is { code?: unknown } =>
      typeof x === "object" && x !== null && "code" in x;
    if (isKnown(e) && typeof e.code === "string" && e.code === "P2002") {
      return NextResponse.json({ error: "Registration number already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
