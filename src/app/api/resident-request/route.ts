import { authOptions } from "@/auth";
import { sendNewRequestConfirmationEmail } from "@/lib/mailer/email-senders/new-request-email-sender";
import { prisma } from "@/lib/prisma";
import { getTimeSlotSummaryCaption } from "@/lib/utils/time-slot/time-slot";
import { assignRequestedTimeSlot } from "@/lib/utils/time-slot/time-slot-assigners";
import { residentRequestValidationSchema } from "@/lib/validation-schemas/submission-request-validation-schemas";
import { ResidentReqestApiRequest } from "@/types/resident-request-api-request";
import { Address } from "@prisma/client";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { adminGetResidentsRequests } from "./adminHandler";
import { getUserResidentRequest } from "./userHandler";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }

  let requestBody: ResidentReqestApiRequest;

  try {
    requestBody = await req.json();
    residentRequestValidationSchema.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    } else {
      return NextResponse.json({ errors: error }, { status: 400 });
    }
  }

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

  const { address }: { address: Partial<Address> } = googleAddressData;

  // This route is assuming that external users are submitting the request on their own behalf
  // Find the user in the database by e-mail, update their name to the one they entered on the form

  try {
    await prisma.user.update({
      where: { email: session.user!.email! },
      data: {
        phoneNumber: `${areaCode}${phoneNumber}`,
        requests: {
          create: {
            applicantName: name,
            requestedTimeSlot: {
              create: {
                startTime: startTime,
                endTime: endTime,
              },
            },
            address: {
              create: {
                streetNumber: address.streetNumber!,
                city: address.city!,
                zipCode: address.zipCode!,
                latitude: address.latitude!,
                longitude: address.longitude!,
                streetName: address.streetName!,
              },
            },
          },
        },
      },
      include: {
        requests: true,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create resident request" },
      { status: 500 }
    );
  }

  // Attempt to send confirmation e-mail
  await sendNewRequestConfirmationEmail({
    email: session.user!.email!,
    name,
    formattedAddress: `${address.streetNumber} ${address.streetName}, ${address.city}`,
    formattedAppointmentDateTime: getTimeSlotSummaryCaption(timeSlot),
    formattedPhoneNumber: `(${areaCode})-${phoneNumber}`,
  });
  return NextResponse.json({ message: "Request received" });
}

//adding GET method

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "No session" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  if (session.user.isAdmin) {
    const take = searchParams.get("take");
    const skip = searchParams.get("skip");
    const date = searchParams.get("date");

    try {
      const residentRequests = await adminGetResidentsRequests({
        date: dayjs(date).isValid() ? date! : null,
        take: parseInt(take!, 10),
        skip: parseInt(skip!, 10),
      });
      return NextResponse.json(residentRequests);
    } catch (error) {
      console.log("Error", error);
      return NextResponse.json(
        { message: "Failed to fetch resident request" },
        { status: 400 }
      );
    }
  }

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { message: "No user ID provided" },
      { status: 400 }
    );
  }
  if (session.user.id !== userId) {
    return NextResponse.json(
      { message: "Unauthorized to view these requests" },
      { status: 401 }
    );
  }
  try {
    const fetchedRequestsForUserId = await getUserResidentRequest(userId);
    return NextResponse.json(fetchedRequestsForUserId);
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Failed to fetch resident request" },
      { status: 400 }
    );
  }
}
