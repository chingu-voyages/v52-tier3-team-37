import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export async function adminGetResidentsRequests({
  date,
  take,
  skip,
}: {
  date: string | null;
  take: number;
  skip: number;
}) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let computedQuery = {
    select: {
      id: true,
      applicantName: true,
      requestedTimeSlot: { select: { startTime: true, endTime: true } },
      assignedTimeSlot: { select: { startTime: true, endTime: true } },
      address: true,
      status: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, email: true, phoneNumber: true },
      },
    },
    skip: skip,
    take: take,
  } as any;

  if (date) {
    const queryDate = new Date(date);
    const endofDate = dayjs(queryDate).add(1, "day").add(-1, "second").toDate();
    computedQuery = {
      ...computedQuery,
      where: {
        requestedTimeSlot: {
          startTime: { gte: queryDate },
          endTime: { lte: endofDate },
        },
      },
    };
  }

  try {
    // Get all resident requests with pagination.
    const count = await prisma.residentRequest.count();
    const residentRequests = await prisma.residentRequest.findMany(
      computedQuery
    );
    return { residentRequests, count };
  } catch (error) {
    console.log("Error fetching resident request:", error);
    return NextResponse.json(
      { error: "Failed to fetch resident request" },
      { status: 500 }
    );
  }
}
