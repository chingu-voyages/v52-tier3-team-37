"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  title: string;
  description: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status, router]);

  // Fetch open tickets when the user is an admin
  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetch("/api/tickets?status=PENDING")
        .then((response) => response.json())
        .then((data) => {
          setOpenTickets(data);
          console.log(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching tickets:", error);
          setError("Failed to load tickets. Please try again later.");
          setLoading(false);
        });
    }
  }, [session?.user?.isAdmin]);

  // Error state
  if (error) {
    return <p>{error}</p>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="spinner">
        <p>Loading tickets...</p>
      </div>
    );
  }

  // Admin dashboard content
  return (
    <>
      {session?.user?.isAdmin ? (
        <div>
          <h1>Admin Dashboard</h1>
          <h2>Open Tickets</h2>
          {openTickets.length > 0 ? (
            <ul>
              {openTickets.map((ticket) => (
                <li key={ticket.id}>
                  <strong>{ticket.title}</strong> - {ticket.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No open tickets at the moment.</p>
          )}
        </div>
      ) : (
        <h1>Access to this page is denied (admin)</h1>
      )}
    </>
  );
}
