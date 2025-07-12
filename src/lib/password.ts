"use client";
import { generateSalt, hashPassword, bufferToHex } from "@/lib/crypto";
import { z } from "zod";
import { passwordSchema } from "./schema";
import { createUser } from "./user";

interface SetupUser {
  pass: z.infer<typeof passwordSchema>;
  id: string;
  accountIndex?: number;
}

export async function setupUser({ id, pass }: SetupUser) {
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

  await createUser({ name: "Account 1", password, blockChainId: id });

  localStorage.setItem("lockMeta", JSON.stringify(lockMeta));
}
