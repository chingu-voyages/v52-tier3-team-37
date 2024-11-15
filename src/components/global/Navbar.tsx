"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // Redirect to the home page
    router.push("/");
  };
  //TODO Remove mb-4
  return (
    <div className="flex gap-4 text-blue-600 bg-gray-200 py-4 mb-4">
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      {status === "unauthenticated" && (
        <Link href="/signup">
          <button className="">Log in</button>
        </Link>
      )}
      {status === "authenticated" && (
        <button onClick={handleSignOut}>Log out</button>
      )}
    </div>
  );
}
