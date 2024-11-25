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
            console.error("Error fetching resident requests:", error);
            setError("Failed to load resident requests. Please try again later.");
            setLoading(false);
          });
      }
    }, [session?.user?.isAdmin]);
  
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
  
    if (loading) {
      return <p className="text-gray-500">Loading Resident Requests...</p>;
    }
  
    return (
      <>
        {session?.user?.isAdmin ? (
          <div className="p-6 bg-white rounded-lg shadow-md dark:bg-simmpy-gray-900">
            <h1 className="text-3xl font-bold text-simmpy-green">Admin Dashboard</h1>
            <h2 className="text-xl font-semibold text-simmpy-gray-800 mt-4">
              Open Resident Requests
            </h2>
            {residentRequests.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {residentRequests.map((request) => (
                  <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                    <p className="text-sm text-simmpy-gray-800">
                      <strong>{request.requestedTimeSlot.description}</strong> <br />
                      <span className="block">
                        Date:{" "}
                        {new Date(request.requestedTimeSlot.startTime).toLocaleDateString()}
                      </span>
                      <span className="block">
                        Time:{" "}
                        {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                        {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()}
                      </span>
                      <span className="block">
                        User: {request.user.name} ({request.user.email})
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">No open resident requests at the moment.</p>
            )}
          </div>
        ) : (
          <h1 className="text-red-500 text-center font-bold text-2xl">
            Access to this page is denied (admin)
          </h1>
        )}
      </>
    );
  }
  