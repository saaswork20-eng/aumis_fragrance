import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = credentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.passwordHash || !user.isActive) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
});
