import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // List of addresses and users to be seeded
  const addressesWithUsers = [
    {
      address: {
        streetName: "Hollywood Blvd",
        streetNumber: "6801",
        city: "Los Angeles",
        zipCode: "90028",
        latitude: 34.101558,
        longitude: -118.326443,
      },
      user: {
        isAdmin: false,
        email: "john.doe@example.com",
        phoneNumber: "555-1234",
        name: "John Doe",
      },
    },
    {
      address: {
        streetName: "Sunset Blvd",
        streetNumber: "8000",
        city: "Los Angeles",
        zipCode: "90046",
        latitude: 34.09782,
        longitude: -118.361583,
      },
      user: {
        isAdmin: false,
        email: "jane.smith@example.com",
        phoneNumber: "555-5678",
        name: "Jane Smith",
      },
    },
    {
      address: {
        streetName: "Wilshire Blvd",
        streetNumber: "5900",
        city: "Los Angeles",
        zipCode: "90036",
        latitude: 34.062445,
        longitude: -118.352037,
      },
      user: {
        isAdmin: false,
        email: "alice.brown@example.com",
        phoneNumber: "555-8765",
        name: "Alice Brown",
      },
    },
    {
      address: {
        streetName: "Melrose Ave",
        streetNumber: "7300",
        city: "Los Angeles",
        zipCode: "90046",
        latitude: 34.083621,
        longitude: -118.355494,
      },
      user: {
        isAdmin: false,
        email: "bob.jones@example.com",
        phoneNumber: "555-2345",
        name: "Bob Jones",
      },
    },
    {
      address: {
        streetName: "Santa Monica Blvd",
        streetNumber: "8500",
        city: "Los Angeles",
        zipCode: "90069",
        latitude: 34.090009,
        longitude: -118.386398,
      },
      user: {
        isAdmin: false,
        email: "carol.davis@example.com",
        phoneNumber: "555-3456",
        name: "Carol Davis",
      },
    },
  ];

  for (const { address, user } of addressesWithUsers) {
    try {
      // Create address
      const createdAddress = await prisma.address.create({
        data: address,
      });

      // Create user linked to the created address
      await prisma.user.create({
        data: {
          ...user,
          addressId: createdAddress.id,
        },
      });

      console.log(`User ${user.name} linked to ${address.streetName} created successfully.`);
    } catch (error) {
      console.error(`Error creating user ${user.name} or their address:`, error);
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
