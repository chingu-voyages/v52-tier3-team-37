import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assignRequestedTimeSlot } from "@/lib/utils/time-slot/time-slot-assigners";
import { ResidentReqestApiRequest } from "@/types/resident-request-api-request";
import { Address } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }

  const requestBody: ResidentReqestApiRequest = await req.json();

  const {
    name,
    areaCode,
    phoneNumber,
    googleAddressData,
    appointmentDate,
    timeSlot,
  } = requestBody;

  const { startTime, endTime } = assignRequestedTimeSlot(
    appointmentDate,
    timeSlot
  );

  // This route is assuming that external users are submitting the request on their own behalf
  // Find the user in the database by e-mail, update their name to the one they entered on the form
  try {
    await prisma.user.update({
      where: { email: req.auth.user?.email! },
      data: {
        name,
        phoneNumber: `${areaCode}${phoneNumber}`,
        address: {
          create: {
            streetNumber: (googleAddressData.address as Partial<Address>)
              .streetNumber!,
            city: (googleAddressData.address as Partial<Address>).city!,
            zipCode: (googleAddressData.address as Partial<Address>).zipCode!,
            latitude: (googleAddressData.address as Partial<Address>).latitude!,
            longitude: (googleAddressData.address as Partial<Address>)
              .longitude!,
            streetName: (googleAddressData.address as Partial<Address>)
              .streetName!,
          },
        },
        requests: {
          create: {
            requestedTimeSlot: {
              create: {
                startTime: startTime,
                endTime: endTime,
              },
            },
          },
        },
      },
      include: {
        address: true,
        requests: true,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create resident request" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Request received" });
});
