import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getAuth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, registrationNumber, phoneNumber } = await req.json();
  // Normalize registration number: trim + uppercase; treat empty string as undefined (no update)
  const normalizedReg =
    typeof registrationNumber === "string"
      ? registrationNumber.trim().toUpperCase() || undefined
      : undefined;
  // Normalize phone number: trim; treat empty string as undefined (no update)
  const normalizedPhone =
    typeof phoneNumber === "string"
      ? phoneNumber.trim() || undefined
      : undefined;

  try {
    // Build update data dynamically
    const updateData: any = {
      name: typeof name === "string" ? name.trim() || undefined : undefined,
      registrationNumber: normalizedReg,
    };

    // Try to add phoneNumber, but handle if Prisma Client doesn't support it yet
    if (normalizedPhone !== undefined) {
      updateData.phoneNumber = normalizedPhone;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, registrationNumber: true },
    });
    return NextResponse.json({ user });
  } catch (e: unknown) {
    console.error("Profile update error:", e);
    const isKnown = (x: unknown): x is { code?: unknown } =>
      typeof x === "object" && x !== null && "code" in x;
    if (isKnown(e) && typeof e.code === "string" && e.code === "P2002") {
      return NextResponse.json(
        { error: "Registration number already taken" },
        { status: 409 }
      );
    }
    // Check for unknown field error
    if (e instanceof Error && e.message?.includes("Unknown argument")) {
      return NextResponse.json(
        {
          error:
            "Profile updated (phone number field not available yet - please regenerate Prisma Client)",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Failed to update profile",
      },
      { status: 500 }
    );
  }
}
