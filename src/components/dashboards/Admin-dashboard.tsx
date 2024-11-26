"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Collapsible from "../collapsible/Collapsible";
import { ResidentRequest, TimeSlot, User, RequestStatus } from "@prisma/client";
import SearchRequests from "@/lib/utils/search/SearchRequests";

type ExtendedResidentRequest = ResidentRequest & {
  user: User;
  requestedTimeSlot: TimeSlot;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pendingRequests, setPendingRequests] = useState<ExtendedResidentRequest[]>([]);
  const [completedRequests, setCompletedRequests] = useState<ExtendedResidentRequest[]>([]);
  const [canceledRequests, setCanceledRequests] = useState<ExtendedResidentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      const fetchRequests = async (status: RequestStatus) => {
        return fetch(`/api/resident-request?status=${status}`)
          .then((response) => response.json())
          .catch((error) => {
            console.error(`Error fetching ${status} resident requests:`, error);
            setError(`Failed to load ${status} resident requests.`);
            return [];
          });
      };

      Promise.all([
        fetchRequests(RequestStatus.PENDING),
        fetchRequests(RequestStatus.COMPLETED),
        fetchRequests(RequestStatus.CANCELED),
      ]).then(([pending, completed, canceled]) => {
        setPendingRequests(pending);
        setCompletedRequests(completed);
        setCanceledRequests(canceled);
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

          {/* Open Resident Requests */}
          <Collapsible title="Open Resident Requests">
            {pendingRequests.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {pendingRequests.map((request) => (
                  <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                    <p className="text-sm text-simmpy-gray-800">
                      <strong>{request.requestedTimeSlot.description}</strong> <br />
                      Date:{" "}
                      {new Date(request.requestedTimeSlot.startTime).toLocaleDateString()} <br />
                      Time:{" "}
                      {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                      {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()} <br />
                      User: {request.user.name} ({request.user.email})
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">No open resident requests at the moment.</p>
            )}
          </Collapsible>

          {/* Completed Resident Requests */}
          <Collapsible title="Completed Resident Requests">
            {completedRequests.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {completedRequests.map((request) => (
                  <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                    <p className="text-sm text-simmpy-gray-800">
                      <strong>{request.requestedTimeSlot.description}</strong> <br />
                      Date:{" "}
                      {new Date(request.requestedTimeSlot.startTime).toLocaleDateString()} <br />
                      Time:{" "}
                      {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                      {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()} <br />
                      User: {request.user.name} ({request.user.email})
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">No completed resident requests at the moment.</p>
            )}
          </Collapsible>

          {/* Canceled Resident Requests */}
          <Collapsible title="Canceled Resident Requests">
            {canceledRequests.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {canceledRequests.map((request) => (
                  <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                    <p className="text-sm text-simmpy-gray-800">
                      <strong>{request.requestedTimeSlot.description}</strong> <br />
                      Date:{" "}
                      {new Date(request.requestedTimeSlot.startTime).toLocaleDateString()} <br />
                      Time:{" "}
                      {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                      {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()} <br />
                      User: {request.user.name} ({request.user.email})
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-4">No canceled resident requests at the moment.</p>
            )}
          </Collapsible>
        </div>
      ) : (
        <h1 className="text-red-500 text-center font-bold text-2xl">
          Access to this page is denied (admin)
        </h1>
      )}
    </>
  );
}
