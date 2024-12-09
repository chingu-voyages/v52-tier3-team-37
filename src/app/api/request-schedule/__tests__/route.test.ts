import { GET } from "../route";
import { prisma } from "@/lib/prisma";
import { computeRouteMatrix } from "@/lib/utils/google-routes";
import { createMocks, MockResponse } from "node-mocks-http";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    residentRequest: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/utils/google-routes");

describe("GET /api/request-schedule", () => {
  it("should return the original array if fewer than 2 requests", async () => {
    (prisma.residentRequest.findMany as jest.Mock).mockResolvedValue([
      { id: "1", address: { latitude: 10, longitude: 20 } },
    ]);

    const { req, res } = createMocks({
      method: "GET",
      url: "/api/request-schedule",
    });

    await GET(req, res as MockResponse);// cannot do will need axios... 

    const responseData = (res as MockResponse<{ id: string; address: { latitude: number; longitude: number } }[]>)._getJSONData();

    expect((res as MockResponse)._getStatusCode()).toBe(200);
    expect(responseData).toEqual([
      { id: "1", address: { latitude: 10, longitude: 20 } },
    ]);
  });

  it("should call computeRouteMatrix for route optimization", async () => {
    (prisma.residentRequest.findMany as jest.Mock).mockResolvedValue([
      { id: "1", address: { latitude: 10, longitude: 20 } },
      { id: "2", address: { latitude: 15, longitude: 25 } },
    ]);

    const mockRoutes = [
      { originIndex: 0, destinationIndex: 1, distanceMeters: 5000, duration: "300s" },
      { originIndex: 1, destinationIndex: 0, distanceMeters: 5000, duration: "300s" },
    ];
    (computeRouteMatrix as jest.Mock).mockResolvedValue(mockRoutes);

    const { req, res } = createMocks({
      method: "GET",
      url: "/api/request-schedule",
    });

    await GET(req, res as MockResponse);

    const responseData = (res as MockResponse<{ id: string; route?: object }[]>)._getJSONData();

    expect((res as MockResponse)._getStatusCode()).toBe(200);
    expect(computeRouteMatrix).toHaveBeenCalledWith({
      origins: [{ latitude: 10, longitude: 20 }, { latitude: 15, longitude: 25 }],
      destinations: [{ latitude: 10, longitude: 20 }, { latitude: 15, longitude: 25 }],
      travelMode: "DRIVE",
    });
    expect(responseData[0].route).toEqual(mockRoutes[0]);
    expect(responseData[1].route).toEqual(mockRoutes[1]);
  });

  it("should return an error if computeRouteMatrix fails", async () => {
    (prisma.residentRequest.findMany as jest.Mock).mockResolvedValue([
      { id: "1", address: { latitude: 10, longitude: 20 } },
      { id: "2", address: { latitude: 15, longitude: 25 } },
    ]);

    (computeRouteMatrix as jest.Mock).mockRejectedValue(new Error("Route matrix error"));

    const { req, res } = createMocks({
      method: "GET",
      url: "/api/request-schedule",
    });

    await GET(req, res as MockResponse);

    expect((res as MockResponse)._getStatusCode()).toBe(500);
    expect((res as MockResponse)._getData()).toContain("Error optimizing routes");
  });
});
