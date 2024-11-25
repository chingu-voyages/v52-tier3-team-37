import { authOptions } from "@/auth";
import NextAuth from "next-auth";
const nextAuthOptions = NextAuth(authOptions);
export { nextAuthOptions as GET, nextAuthOptions as POST };
