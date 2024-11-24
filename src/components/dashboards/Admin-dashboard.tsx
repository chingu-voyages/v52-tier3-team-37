"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ResidentRequest, TimeSlot, User, RequestStatus } from "@prisma/client";
 
type ExtendedResidentRequest = ResidentRequest & {
  user: User;
  requestedTimeSlot: TimeSlot;
};
 
export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [residentRequests, setResidentRequests] = useState<ExtendedResidentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status, router]);
 
  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetch("/api/resident-request?status=PENDING")
        .then((response) => response.json())
        .then((data) => {
          setResidentRequests(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching resident requests:",  error);
          setError("Failed to load resident requests. Please try again later.");
          setLoading(false);
        });
    }
  }, [session?.user?.isAdmin]);
 
  if (error) {
    return <p>{error}</p>;
  }
 
  if (loading) {
    return <p>Loading Resident Requests...</p>;
  }
 
  return (
    <>
      {session?.user?.isAdmin ? (
        <div>
          <h1>Admin Dashboard</h1>
          <h2>Open Resident Requests</h2>
          {residentRequests.length > 0 ? (
            <ul>
              {residentRequests.map((request) => (
                <li key={request.id}>
                  <p>
                    <strong>{request.requestedTimeSlot.description}</strong> <br />
                    Date: {new Date(request.requestedTimeSlot.startTime).toLocaleDateString()} <br />
                    Time: {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                    {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()} <br />
                    User: {request.user.name} ({request.user.email})
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No open resident requests at the moment.</p>
          )}
        </div>
      ) : (
        <h1>Access to this page is denied (admin)</h1>
      )}
    </>
  );
}