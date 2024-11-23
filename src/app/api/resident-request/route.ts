import { NextRequest, NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import { RequestStatus } from "@prisma/client"; // Import RequestStatus enumD

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
    const residentRequests = await prisma.residentRequest.findMany({
      where: { status: status as RequestStatus }, 
      include: {
        user: true, 
        requestedTimeSlot: true, 
      },
    });

    return NextResponse.json(residentRequests);
  } catch (error) {
    console.error("Error fetching resident request:", error);
    return NextResponse.json(
      { error: "Failed to fetch resident request" },
      { status: 500 }
    );  
  }
}
