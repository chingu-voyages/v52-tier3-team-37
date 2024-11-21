import { PrismaClient, RequestStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // List of schedules for existing users
  const schedulesForUsers = [
    {
      email: "john.doe@example.com", // User email to find the user
      schedules: [
        {
          startTime: new Date("2023-11-25T10:00:00Z"),
          endTime: new Date("2023-11-25T11:00:00Z"),
          description: "Solar panel evaluation",
        },
        {
          startTime: new Date("2023-11-28T15:00:00Z"),
          endTime: new Date("2023-11-28T16:00:00Z"),
          description: "Installation follow-up",
        },
      ],
    },
    {
      email: "jane.smith@example.com",
      schedules: [
        {
          startTime: new Date("2023-11-26T09:00:00Z"),
          endTime: new Date("2023-11-26T10:00:00Z"),
          description: "Initial consultation",
        },
      ],
    },
  ];

  for (const { email, schedules } of schedulesForUsers) {
    try {
      // Find existing user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.error(`User with email ${email} does not exist.`);
        continue; // Skip if user does not exist
      }

      // Create schedules and associate them with the user
      for (const schedule of schedules) {
        const createdTimeSlot = await prisma.timeSlot.create({
          data: schedule,
        });

        await prisma.residentRequest.create({
          data: {
            user_id: user.id,
            request_time_slot_id: createdTimeSlot.id,
            status: RequestStatus.PENDING,
          },
        });

        console.log(
          `Schedule "${schedule.description}" added for user with email ${email}.`
        );
      }
    } catch (error) {
      console.error(`Error adding schedules for user ${email}:`, error);
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
