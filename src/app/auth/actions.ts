"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
});

export type RegisterState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerUser(prevState: RegisterState | null, formData: FormData): Promise<RegisterState> {
  const rawData = {
    name: formData.get("name") as string,
    email: (formData.get("email") as string)?.toLowerCase().trim(),
    password: formData.get("password") as string,
    role: (formData.get("role") as "BUYER" | "SELLER") || "BUYER",
  };

  const validated = registerSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = validated.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists. Please log in.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role,
        isActive: true,
      },
    });

    return {
      success: true,
    };
  } catch (err) {
    console.error("Registration error:", err);
    return {
      success: false,
      error: "Failed to create account. Please try again later.",
    };
  }
}
