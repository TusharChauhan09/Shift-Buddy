import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: requestId } = await params;

    // Get the request to find the owner
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Don't allow users to show interest in their own requests
    if (request.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot show interest in your own request" },
        { status: 400 }
      );
    }

    // Check if interest already exists
    const existingInterest = await prisma.interest.findUnique({
      where: {
        userId_requestId: {
          userId: session.user.id,
          requestId: requestId,
        },
      },
    });

    if (existingInterest) {
      return NextResponse.json(
        { message: "Interest already recorded" },
        { status: 200 }
      );
    }

    // Create interest record
    await prisma.interest.create({
      data: {
        userId: session.user.id,
        requestId: requestId,
      },
    });

    // Create notification for the request owner
    await prisma.notification.create({
      data: {
        userId: request.userId,
        type: "interest",
        message: `${
          session.user.name || "Someone"
        } showed interest in your request`,
        requestId: requestId,
        interestedBy: session.user.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error recording interest:", error);
    return NextResponse.json(
      { error: "Failed to record interest" },
      { status: 500 }
    );
  }
}
