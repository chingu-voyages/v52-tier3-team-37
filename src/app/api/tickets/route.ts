// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const status = searchParams.get("status")?.toUpperCase();

//   if (!status) {
//     return NextResponse.json({ error: "Status query parameter is required" }, { status: 400 });
//   }

//   try {
//     const tickets = await prisma.residentRequest.findMany({
//       where: { status },
//       include: { user: true }, // Include user details if needed
//     });
//     return NextResponse.json(tickets);
//   } catch (error) {
//     console.error("Error fetching tickets:", error);
//     return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const status = searchParams.get("status");

//   if (!status) {
//     return NextResponse.json({ error: "Missing status parameter" }, { status: 400 });
//   }

//   // ...rest of your logic
// }

/*--*//*--*//*--*//*--*//*--*/

// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@prisma/client" // Adjust the import path

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const status = searchParams.get("status");

//   // Validate the status parameter
//   if (!status) {
//     return NextResponse.json({ error: "Missing status parameter" }, { status: 400 });
//   }

//   const validStatuses = ["COMPLETED", "PENDING", "CANCELED"];
//   if (!validStatuses.includes(status)) {
//     return NextResponse.json({ error: "Invalid status parameter" }, { status: 400 });
//   }

//   try {
//     const tickets = await prisma.residentRequest.findMany({
//       where: { status },
//       include: {
//         user: true, // Include related user data if needed
//         requestedTimeSlot: true, // Include time slot if needed
//       },
//     });

//     return NextResponse.json(tickets);
//   } catch (error) {
//     console.error("Error fetching tickets:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch tickets" },
//       { status: 500 }
//     );
//   }
// }

/*--*//*--*//*--*//*--*//*--*/