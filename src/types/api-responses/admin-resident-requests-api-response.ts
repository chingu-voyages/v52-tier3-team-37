import { Prisma } from "@prisma/client";

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const allUserRequestsAdminGetResponse =
  Prisma.validator<Prisma.ResidentRequestDefaultArgs>()({
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
  });

export type AllUserRequestsAdminGetResponse = Prisma.ResidentRequestGetPayload<
  typeof allUserRequestsAdminGetResponse
>;
