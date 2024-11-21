"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    // Redirect to the home page
    router.push("/");
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-8 py-4">
        <div className="flex items-center gap-6">
          <Image
            src="/assets/images/icons/sippy_nav.jpg"
            alt="Logo"
            width={40}
            height={40}
          />
          <Link href="/" className="text-simmpy-green font-bold text-lg">Sippy</Link>
        </div>
        <button
          className="block md:hidden text-simmpy-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full md:static md:flex md:items-center justify-between bg-white md:bg-transparent`}
        >
          <div className="flex flex-col md:flex-row md:ml-16 gap-4 md:gap-8 items-center">
            <Link href="/" className="hover:text-simmpy-green text-simmpy-gray-800"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-simmpy-green text-simmpy-gray-800"
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-simmpy-green text-simmpy-gray-800"
              onClick={handleLinkClick}
            >
              Contact
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 px-4 md:px-0 mt-4 md:mt-0">
            {status === "unauthenticated" ? (
              <>
                <Link href="/login" onClick={handleLinkClick}>
                  <button className="px-4 py-2 text-white bg-simmpy-gray-800 hover:bg-simmpy-gray-600 rounded">
                    Log in
                  </button>
                </Link>
                <Link href="/signup" onClick={handleLinkClick}>
                  <button className="px-4 py-2 text-white bg-simmpy-green hover:bg-green-600 rounded">
                    Sign up
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-white bg-simmpy-gray-800 hover:bg-simmpy-gray-600 rounded"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
