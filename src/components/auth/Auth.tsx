// This component can be used for both sign up and sign in pages.
"use client";
// https://github.com/free-icons/free-icons

import { signIn } from "next-auth/react";
import Image from "next/image";
import GithubIcon from "../../../public/assets/images/icons/github.svg";
import GoogleIcon from "../../../public/assets/images/icons/google.svg";
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
      <h1 className="text-3xl text-simmpy-gray-800 p-2 font-semibold">
        Sign in
      </h1>
      <div className="flex flex-col gap-2">
        <button
          className="bg-gray-600 px-8 py-2 rounded-lg bg-white text-simmpy-gray-800 border-simmpy-100 border-[1px]"
          onClick={() => handleSignIn("google")}
        >
          <div className="flex justify-center gap-2 font-semibold">
            <Image src={GoogleIcon} alt="Sign in with Google" width={16} />
            Sign in with Google
          </div>
        </button>
        <button
          className="bg-gray-600 px-8 py-2 rounded-lg text-white"
          onClick={() => handleSignIn("github")}
        >
          <div className="flex justify-center gap-2 font-semibold">
            <Image src={GithubIcon} alt="Sign in with Github" width={16} />
            Sign in with Github
          </div>
        </button>
      </div>
    </div>
  );
}
