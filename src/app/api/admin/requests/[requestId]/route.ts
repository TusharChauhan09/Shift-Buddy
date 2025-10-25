import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH request (edit)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await getAuth();

    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await context.params;
    const body = await req.json();

    const {
      currentHostel,
      currentBlock,
      currentFloor,
      currentRoom,
      desiredHostel,
      desiredBlock,
      desiredFloor,
      desiredRoom,
      message,
    } = body;

    // Update request
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        currentHostel,
        currentBlock: currentBlock || null,
        currentFloor: currentFloor || null,
        currentRoom: currentRoom || null,
        desiredHostel,
        desiredBlock: desiredBlock || null,
        desiredFloor: desiredFloor || null,
        desiredRoom: desiredRoom || null,
        message: message || null,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            registrationNumber: true,
            phoneNumber: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, request: updatedRequest });
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

// DELETE request
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ requestId: string }> }
) {
  try {
    const session = await getAuth();

    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId } = await context.params;

    await prisma.request.delete({
      where: { id: requestId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
