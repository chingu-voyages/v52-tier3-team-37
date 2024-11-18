import { prisma } from "lib/prisma";
import NextAuth, { Profile } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [GoogleProvider, GithubProvider],
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) {
        return false;
      }

      if (!profile) {
        return false;
      }

      if (!user) {
        return false;
      }

      // Using a customized login to create the prisma user

      // Extract based on if it's google or github

      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email! },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: profile?.email!,
            name: getNameFromProfile(account.provider as any, profile),
            isAdmin: false,
          },
        });
      }

      return true;
    },
    async jwt({ token }) {
      // Find a user
      if (!token.email) throw new Error("No email found in token");

      const existingUser = await prisma.user.findUnique({
        where: { email: token.email },
      });

      token = {
        ...token,
        id: existingUser?.id,
        isAdmin: existingUser?.isAdmin,
      };
      return token;
    },

    async session({ session, token }) {
      session = {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: `${token.name}`,
          isAdmin: token.isAdmin,
        } as any,
      };

      return session;
    },
  },
});

function getNameFromProfile(
  provider: "google" | "github",
  profile: Profile
): string {
  if (provider === "google") {
    return `${profile.given_name} ${profile.family_name}`;
  }

  // Default is then github which has the name field
  return profile.name!;
}
