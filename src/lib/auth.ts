import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) return null;

        return { id: user.id.toString(), name: user.name, username: user.username };
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/login",
  },
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Use NEXTAUTH_URL from env, or auto-detect in production
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
  // Ensure cookies work across the domain
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
};
