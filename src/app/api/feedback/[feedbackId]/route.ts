import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - Update feedback status
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ feedbackId: string }> }
) {
  try {
    const session = await getAuth();

    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { feedbackId } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!["new", "read", "resolved"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const feedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}

// DELETE - Delete feedback
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ feedbackId: string }> }
) {
  try {
    const session = await getAuth();

    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { feedbackId } = await context.params;

    await prisma.feedback.delete({
      where: { id: feedbackId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
