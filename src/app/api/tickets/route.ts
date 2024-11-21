import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, RequestStatus } from "@prisma/client"; // Import RequestStatus enum

const prisma = new PrismaClient(); // Initialize PrismaClient

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  // Validate the status parameter
  if (!status) {
    return NextResponse.json({ error: "Missing status parameter" }, { status: 400 });
  }

  const validStatuses: RequestStatus[] = ["COMPLETED", "PENDING", "CANCELED"];
  if (!validStatuses.includes(status as RequestStatus)) {
    return NextResponse.json({ error: "Invalid status parameter" }, { status: 400 });
  }

  try {
    const tickets = await prisma.residentRequest.findMany({
      where: { status: status as RequestStatus }, // Cast status to RequestStatus
      include: {
        user: true, // Include related user data if needed
        requestedTimeSlot: true, // Include time slot if needed
      },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
