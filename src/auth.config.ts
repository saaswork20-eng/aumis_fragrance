import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & import("next-auth").DefaultSession["user"];
  }
  interface User {
    role: Role;
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const pathname = nextUrl.pathname;

      if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) return false;
        return role === "ADMIN";
      }

      if (pathname.startsWith("/seller")) {
        if (!isLoggedIn) return false;
        return role === "SELLER" || role === "ADMIN";
      }

      if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
        return isLoggedIn;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  providers: [],
};
