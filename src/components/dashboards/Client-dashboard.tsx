"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.isAdmin) {
      router.replace("/dashboard/admin");
    }
  }, [session?.user?.isAdmin]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status]);

  return (
    <>
      <div>
        <h1>Client Dashboard</h1>
      </div>
      <h1>Welcome, {session?.user?.name} </h1>
    </>
  );
}
