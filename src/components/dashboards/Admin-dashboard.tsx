"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.replace("/signup");
    return null;
  }

  return (
    <>
      {session?.user?.isAdmin ? (
        <h1>Admin Dashboard</h1>
      ) : (
        <h1>Access to this page is denied (admin)</h1>
      )}
    </>
  );
}
