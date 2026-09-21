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

// Ensure AUTH_URL is defined from NEXTAUTH_URL or NEXT_PUBLIC_APP_URL for Auth.js v5
if (!process.env.AUTH_URL) {
  const envUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) {
    process.env.AUTH_URL = envUrl;
  }
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const canonicalBase =
        process.env.AUTH_URL ||
        process.env.NEXTAUTH_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        baseUrl;

      const canonicalOrigin = new URL(canonicalBase).origin;

      // 1. Relative paths (e.g. "/admin" or "/") -> resolve onto canonicalOrigin
      if (url.startsWith("/")) {
        return `${canonicalOrigin}${url}`;
      }

      // 2. Absolute URL matching canonicalOrigin -> allow
      try {
        const parsed = new URL(url);
        if (parsed.origin === canonicalOrigin) {
          return url;
        }
        // 3. If url points to any *.vercel.app deployment-specific URL, rewrite to canonicalOrigin
        if (parsed.hostname.endsWith(".vercel.app")) {
          return `${canonicalOrigin}${parsed.pathname}${parsed.search}`;
        }
      } catch {
        // invalid URL format -> fallback
      }

      return canonicalOrigin;
    },
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
