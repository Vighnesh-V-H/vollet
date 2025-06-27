"use client";
import { generateSalt, hashPassword, bufferToHex } from "@/lib/crypto";
import { z } from "zod";
import { passwordSchema } from "./schema";

export async function setupPassword(pass: z.infer<typeof passwordSchema>) {
  const success = passwordSchema.safeParse(pass);
  if (!success.success) {
    return;
  }

  const password = success.data.password;

  const salt = generateSalt();
  const saltHex = bufferToHex(salt.buffer as ArrayBuffer);

  const passwordVerifier = await hashPassword(password, saltHex);

  const lockMeta = {
    salt: saltHex,
    passwordVerifier,
  };

  localStorage.setItem("lockMeta", JSON.stringify(lockMeta));
}
