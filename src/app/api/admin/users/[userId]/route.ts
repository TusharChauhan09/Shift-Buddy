import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE user
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getAuth();

    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;

    // Prevent admin from deleting themselves
    if (userId === session.user?.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Delete user and cascade delete their requests
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// PATCH user (ban, timeout, etc.)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getAuth();

    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await context.params;
    const body = await req.json();
    const { action, timeoutDuration } = body;

    // Prevent admin from banning/timing out themselves
    if (userId === session.user?.id) {
      return NextResponse.json(
        { error: "Cannot modify your own account" },
        { status: 400 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case "ban":
        updateData = { isBanned: true, timeoutUntil: null };
        break;
      case "unban":
        updateData = { isBanned: false, timeoutUntil: null };
        break;
      case "timeout":
        if (!timeoutDuration) {
          return NextResponse.json(
            { error: "Timeout duration required" },
            { status: 400 }
          );
        }
        const timeoutUntil = new Date();
        timeoutUntil.setMinutes(timeoutUntil.getMinutes() + timeoutDuration);
        updateData = { timeoutUntil, isBanned: false };
        break;
      case "removeTimeout":
        updateData = { timeoutUntil: null };
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
