import { ResidentReqestApiRequest } from "@/types/resident-request-api-request";

export const ResidentRequestService = {
  create: async (data: ResidentReqestApiRequest) => {
    const response = await fetch("/api/resident-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create resident request");
    }

    return response.json();
  },
};
