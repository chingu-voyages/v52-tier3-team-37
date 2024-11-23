  // "use client";
  // import { useSession } from "next-auth/react";
  // import { useRouter } from "next/navigation";
  // import { useEffect, useState } from "react";
  // import { ResidentRequest, TimeSlot, User, Address } from "@prisma/client";

  // // interface TimeSlot {
  // //   id: string;
  // //   startTime: string;
  // //   endTime: string;
  // //   description: string;
  // // }

  // // interface ResidentRequest {
  // //   id: string;
  // //   status: string;
  // //   requestedTimeSlot: TimeSlot;
  // //   user: User;
  // // }

  // // interface User {
  // //   id: string;
  // //   isAdmin: boolean;
  // //   email: string;
  // //   phoneNumber?: string; // Optional if it can be null
  // //   name: string;
  // // }

  // export default function AdminDashboard() {
  //   const router = useRouter();
  //   const { data: session, status } = useSession();
  //   const [residentRequests, setResidentRequests] = useState<ResidentRequest[]>([]);//updaed to resident requests
  //   const [timeSlot, setTimelot] = useState<TimeSlot[]>([]);//updaed to resident requests
  //   const [user, setUser] = useState<User[]>([]);//time slor
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string | null>(null);

  //   // Redirect unauthenticated users
  //   useEffect(() => {
  //     if (status === "unauthenticated") {
  //       router.replace("/signup");
  //     }
  //   }, [status, router]);

  //   // Fetch open residentRequests when the user is an admin
  //   useEffect(() => {
  //     if (session?.user?.isAdmin) {
  //       fetch("/api/resident-request?status=PENDING")
  //         .then((response) => response.json())
  //         .then((data) => {
  //           setResidentRequests(data);
  //           console.log(data);
  //           setLoading(false);
  //         })
  //         .catch((error) => {
  //           console.error("Error fetching resident requests:", error);
  //           setError("Failed to load resident requests. Please try again later.");
  //           setLoading(false);
  //         });
  //     }
  //   }, [session?.user?.isAdmin]);

  //   // Error state
  //   if (error) {
  //     return <p>{error}</p>;
  //   }

  //   // Loading state
  //   if (loading) {
  //     return (
  //       <div className="spinner">
  //         <p>Loading Resident Requests...</p>
  //       </div>
  //     );
  //   }

  //   // Admin dashboard content
  //   return (
  //     <>
  //       {session?.user?.isAdmin ? (
  //         <div>
  //           <h1>Admin Dashboard</h1>
  //           <h2>Open Resident Requests</h2>
  //           {residentRequests.length > 0 ? (
  //             <ul>
  //               {residentRequests.map((residentRequest) => (
  //                 <li key={residentRequest.id}>
  //                 <p>
  //                   <strong>{residentRequest.TimeSlot.description}</strong> <br />
  //                   Date: {new Date(residentRequest.requestedTimeSlot.startTime).toLocaleDateString()} <br />
  //                   Time: {new Date(residentRequest.requestedTimeSlot.startTime).toLocaleTimeString()} - {new Date(residentRequest  .requestedTimeSlot.endTime).toLocaleTimeString()} <br />
  //                   User: {residentRequest.user.name} ({residentRequest.user.email})
  //                 </p>
  //               </li>
  //               ))}
  //             </ul>
  //           ) : (
  //             <p>No open resident requests at the moment.</p>
  //           )}
  //         </div>
  //       ) : (
  //         <h1>Access to this page is denied (admin)</h1>
  //       )}
  //     </>
  //   );
  // }

/*--*//*--*/
/*-

  "use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ResidentRequest, RequestStatus } from "@prisma/client";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [residentRequests, setResidentRequests] = useState<ResidentRequest[]>([]);
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
    return <p>{error}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
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
                Time: {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} - {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()} <br />
                User: {request.user.name} ({request.user.email})
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No open requests at the moment.</p>
      )}
    </div>
  );
}
-*/

/*--*//*--*///*--*//*--*/

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
