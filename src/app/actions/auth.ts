"use server";

import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export type RegisterResult = {
  success: boolean;
  error?: string;
  userId?: string;
};

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  // Validate input
  if (!email || !password || !firstName || !lastName) {
    return { success: false, error: "Alle velden zijn verplicht." };
  }

  if (password.length < 8) {
    return { success: false, error: "Wachtwoord moet minimaal 8 tekens zijn." };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: "Dit e-mailadres is al in gebruik." };
  }

  try {
    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        role: "TEACHER", // Default role
        isActive: true,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het registreren." };
  }
}
