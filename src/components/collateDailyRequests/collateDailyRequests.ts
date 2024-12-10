import { ResidentRequestCollation } from "../../types/resident-request-collation";

export async function fetchDailyRequests(): Promise<Record<string, ResidentRequestCollation[]>> {
  try {
    const response = await fetch("/api/request-schedule");
    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }
    return response.json(); 
  } catch (error) {
    console.error("Error fetching daily requests:", error);
    throw error;
  }
}
