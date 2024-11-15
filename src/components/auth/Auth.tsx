// This component can be used for both sign up and sign in pages.
"use client";

import { signIn } from "next-auth/react";

export default function AuthProviderSignIn() {
  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("An error occurred while signing in: ", error);
    }
  };
  return (
    <div>
      <h1>Sign Up page</h1>
      <div className="flex flex-col gap-2">
        <button
          className="bg-gray-600 px-8 py-2 rounded-lg text-white"
          onClick={() => handleSignIn("google")}
        >
          Sign in with Google
        </button>
        <button
          className="bg-gray-600 px-8 py-2 rounded-lg text-white"
          onClick={() => handleSignIn("github")}
        >
          Sign in with Github
        </button>
      </div>
    </div>
  );
}
