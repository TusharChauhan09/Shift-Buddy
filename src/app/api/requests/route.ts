import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/requests - list latest open requests
export async function GET() {
  try {
    // Ensure Prisma Client has the Request model (migrate + generate required)
    if (!(prisma as any).request) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Request model not available. Run: npx prisma migrate dev && npx prisma generate",
        },
        { status: 500 }
      );
    }
    const items = await prisma.request.findMany({
      where: { status: "open" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            registrationNumber: true,
            phoneNumber: true,
          },
        },
      },
      take: 50,
    });
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching requests:", error);
    }
    return NextResponse.json(
      { ok: false, error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

// POST /api/requests - create a new request (auth required)
export async function POST(req: Request) {
  const session = await getAuth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Check if user has a registration number and phone number
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { registrationNumber: true, phoneNumber: true },
    });

    if (!user?.registrationNumber || !user?.phoneNumber) {
      const missing = [];
      if (!user?.registrationNumber) missing.push("registration number");
      if (!user?.phoneNumber) missing.push("phone number");

      return NextResponse.json(
        {
          ok: false,
          error: `Please complete your profile with ${missing.join(
            " and "
          )} before posting a request.`,
        },
        { status: 403 }
      );
    }

    // Check if user already has 2 or more active requests
    const activeRequestsCount = await prisma.request.count({
      where: {
        userId: session.user.id,
        status: "open",
      },
    });

    if (activeRequestsCount >= 2) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "You can only have 2 active requests at a time. Please delete one of your existing requests before creating a new one.",
        },
        { status: 403 }
      );
    }

    if (!(prisma as any).request) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Request model not available. Run: npx prisma migrate dev && npx prisma generate",
        },
        { status: 500 }
      );
    }
    const contentType = req.headers.get("content-type") || "";
    let currentHostel: unknown;
    let desiredHostel: unknown;
    let currentBlock: unknown;
    let desiredBlock: unknown;
    let currentFloor: unknown;
    let desiredFloor: unknown;
    let currentRoom: unknown;
    let desiredRoom: unknown;
    let message: unknown;
    let roomType: unknown;
    let seater: unknown;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      ({
        currentHostel,
        desiredHostel,
        currentBlock,
        desiredBlock,
        currentFloor,
        desiredFloor,
        currentRoom,
        desiredRoom,
        message,
        roomType,
        seater,
      } = body || {});
    } else {
      const form = await req.formData();
      currentHostel = form.get("currentHostel");
      desiredHostel = form.get("desiredHostel");
      currentBlock = form.get("currentBlock");
      desiredBlock = form.get("desiredBlock");
      currentFloor = form.get("currentFloor");
      desiredFloor = form.get("desiredFloor");
      currentRoom = form.get("currentRoom");
      desiredRoom = form.get("desiredRoom");
      message = form.get("message");
      roomType = form.get("roomType");
      seater = form.get("seater");
    }

    // Basic validation
    if (!currentHostel || !desiredHostel) {
      return NextResponse.json(
        { ok: false, error: "currentHostel and desiredHostel are required" },
        { status: 400 }
      );
    }

    // Validate new required fields
    if (!roomType || !seater) {
      return NextResponse.json(
        { ok: false, error: "Room type and seater are required" },
        { status: 400 }
      );
    }

    const createData: any = {
      userId: session.user.id,
      currentHostel: String(currentHostel).trim(),
      desiredHostel: String(desiredHostel).trim(),
      currentRoom: currentRoom ? String(currentRoom).trim() : null,
      desiredRoom: desiredRoom ? String(desiredRoom).trim() : null,
      message: message ? String(message).trim() : null,
      roomType: String(roomType).trim(),
      seater: parseInt(String(seater)),
    };

    // Try to add new fields, but catch if they don't exist in Prisma Client yet
    try {
      // Add new fields if they exist (for backwards compatibility)
      if (currentBlock !== undefined) {
        createData.currentBlock = currentBlock
          ? String(currentBlock).trim()
          : null;
      }
      if (desiredBlock !== undefined) {
        createData.desiredBlock = desiredBlock
          ? String(desiredBlock).trim()
          : null;
      }
      if (currentFloor !== undefined) {
        createData.currentFloor = currentFloor
          ? String(currentFloor).trim()
          : null;
      }
      if (desiredFloor !== undefined) {
        createData.desiredFloor = desiredFloor
          ? String(desiredFloor).trim()
          : null;
      }

      const item = await prisma.request.create({
        data: createData,
        include: {
          user: {
            select: { id: true, name: true, registrationNumber: true },
          },
        },
      });

      return NextResponse.json({ ok: true, item }, { status: 201 });
    } catch (prismaError: any) {
      // If error is about unknown fields, try creating without the new fields
      if (prismaError.message?.includes("Unknown argument")) {
        console.log("Prisma Client not updated, trying without new fields...");

        const basicCreateData: any = {
          userId: session.user.id,
          currentHostel: String(currentHostel).trim(),
          desiredHostel: String(desiredHostel).trim(),
          currentRoom: currentRoom ? String(currentRoom).trim() : null,
          desiredRoom: desiredRoom ? String(desiredRoom).trim() : null,
          message: message ? String(message).trim() : null,
        };

        const item = await prisma.request.create({
          data: basicCreateData,
          include: {
            user: {
              select: { id: true, name: true, registrationNumber: true },
            },
          },
        });

        return NextResponse.json(
          {
            ok: true,
            item,
            warning:
              "Block and floor fields were not saved. Please regenerate Prisma Client.",
          },
          { status: 201 }
        );
      }
      throw prismaError;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error creating request:", error);
    }
    return NextResponse.json(
      { ok: false, error: "Failed to create request" },
      { status: 500 }
    );
  }
}
