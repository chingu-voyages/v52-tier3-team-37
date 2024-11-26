"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import for placeholder image
import Collapsible from "../collapsible/Collapsible";
import SearchRequests from "@/lib/utils/search/SearchRequests";
import { ResidentRequest, TimeSlot, User, RequestStatus } from "@prisma/client";

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
  const [filteredPending, setFilteredPending] = useState<ExtendedResidentRequest[]>([]);
  const [filteredCompleted, setFilteredCompleted] = useState<ExtendedResidentRequest[]>([]);
  const [filteredCanceled, setFilteredCanceled] = useState<ExtendedResidentRequest[]>([]);
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
        setFilteredPending(pending); // Initial state matches full data
        setCompletedRequests(completed);
        setFilteredCompleted(completed);
        setCanceledRequests(canceled);
        setFilteredCanceled(canceled);
        setLoading(false);
      });
    }
  }, [session?.user?.isAdmin]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();

    setFilteredPending(
      pendingRequests.filter(
        (request) =>
          request.user.name.toLowerCase().includes(lowerCaseQuery) ||
          request.user.email.toLowerCase().includes(lowerCaseQuery) ||
          request.requestedTimeSlot.description?.toLowerCase().includes(lowerCaseQuery)
      )
    );

    setFilteredCompleted(
      completedRequests.filter(
        (request) =>
          request.user.name.toLowerCase().includes(lowerCaseQuery) ||
          request.user.email.toLowerCase().includes(lowerCaseQuery) ||
          request.requestedTimeSlot.description?.toLowerCase().includes(lowerCaseQuery)
      )
    );

    setFilteredCanceled(
      canceledRequests.filter(
        (request) =>
          request.user.name.toLowerCase().includes(lowerCaseQuery) ||
          request.user.email.toLowerCase().includes(lowerCaseQuery) ||
          request.requestedTimeSlot.description?.toLowerCase().includes(lowerCaseQuery)
      )
    );
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading Resident Requests...</p>;
  }

  return (
    <>
      {session?.user?.isAdmin ? (
        <div className="flex flex-wrap">
          {/* Left Section: Dashboard Content */}
          <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow-md dark:bg-simmpy-gray-900">
            <h1 className="text-3xl font-bold text-simmpy-green">Admin Dashboard</h1>

            {/* Search Bar */}
            <SearchRequests onSearch={handleSearch} />

            {/* Open Resident Requests */}
            <Collapsible title="Open Resident Requests">
              {filteredPending.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {filteredPending.map((request) => (
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
                <p className="text-gray-500 mt-4">No matching open requests found.</p>
              )}
            </Collapsible>

            {/* Completed Resident Requests */}
            <Collapsible title="Completed Resident Requests">
              {filteredCompleted.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {filteredCompleted.map((request) => (
                    <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                      <p className="text-sm text-simmpy-gray-800">
                        <strong>{request.requestedTimeSlot?.description || "No description available"}</strong> <br />
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
                <p className="text-gray-500 mt-4">No matching completed requests found.</p>
              )}
            </Collapsible>

            {/* Canceled Resident Requests */}
            <Collapsible title="Canceled Resident Requests">
              {filteredCanceled.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {filteredCanceled.map((request) => (
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
                <p className="text-gray-500 mt-4">No matching canceled requests found.</p>
              )}
            </Collapsible>
          </div>

          {/* Right Section: Map Placeholder */}
          <div className="w-full md:w-1/3 p-6">
            <Image
              src="/assets/images/MapPlaceHholder.png"
              alt="Map Placeholder"
              width={400}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      ) : (
        <h1 className="text-red-500 text-center font-bold text-2xl">
          Access to this page is denied (admin)
        </h1>
      )}
    </>
  );
}
