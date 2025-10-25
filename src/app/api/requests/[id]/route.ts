import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/requests/[id] - update a request
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const body = await req.json();

    console.log("Update request body:", body);
    console.log("Request ID:", id);

    const {
      currentHostel,
      desiredHostel,
      currentBlock,
      desiredBlock,
      currentFloor,
      desiredFloor,
      currentRoom,
      desiredRoom,
      message,
    } = body;

    // Verify the request belongs to the user
    const existingRequest = await prisma.request.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { ok: false, error: "Request not found" },
        { status: 404 }
      );
    }

    if (existingRequest.userId !== session.user.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update the request
    const updateData: any = {
      currentHostel: currentHostel?.trim(),
      desiredHostel: desiredHostel?.trim(),
      currentRoom: currentRoom?.trim() || null,
      desiredRoom: desiredRoom?.trim() || null,
      message: message?.trim() || null,
    };

    // Try to add new fields, but catch if they don't exist in Prisma Client yet
    try {
      // Add new fields if they exist in the schema (for backwards compatibility)
      if (currentBlock !== undefined) {
        updateData.currentBlock = currentBlock?.trim() || null;
      }
      if (desiredBlock !== undefined) {
        updateData.desiredBlock = desiredBlock?.trim() || null;
      }
      if (currentFloor !== undefined) {
        updateData.currentFloor = currentFloor?.trim() || null;
      }
      if (desiredFloor !== undefined) {
        updateData.desiredFloor = desiredFloor?.trim() || null;
      }

      console.log("Update data:", updateData);

      const updatedRequest = await prisma.request.update({
        where: { id },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, registrationNumber: true } },
        },
      });

      console.log("Request updated successfully:", updatedRequest.id);

      return NextResponse.json({ ok: true, item: updatedRequest });
    } catch (prismaError: any) {
      // If error is about unknown fields, try updating without the new fields
      if (prismaError.message?.includes("Unknown argument")) {
        console.log("Prisma Client not updated, trying without new fields...");

        const basicUpdateData: any = {
          currentHostel: currentHostel?.trim(),
          desiredHostel: desiredHostel?.trim(),
          currentRoom: currentRoom?.trim() || null,
          desiredRoom: desiredRoom?.trim() || null,
          message: message?.trim() || null,
        };

        const updatedRequest = await prisma.request.update({
          where: { id },
          data: basicUpdateData,
          include: {
            user: {
              select: { id: true, name: true, registrationNumber: true },
            },
          },
        });

        return NextResponse.json({
          ok: true,
          item: updatedRequest,
          warning:
            "Block and floor fields were not updated. Please regenerate Prisma Client.",
        });
      }
      throw prismaError;
    }
  } catch (error) {
    console.error("Detailed error updating request:", error);
    if (process.env.NODE_ENV === "development") {
      console.error("Error updating request:", error);
    }
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to update request",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/requests/[id] - delete a request
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAuth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    // Verify the request belongs to the user
    const existingRequest = await prisma.request.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { ok: false, error: "Request not found" },
        { status: 404 }
      );
    }

    if (existingRequest.userId !== session.user.id) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete the request
    await prisma.request.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error deleting request:", error);
    }
    return NextResponse.json(
      { ok: false, error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
