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

const encode = (str: string) => new TextEncoder().encode(str);
const decode = (buf: ArrayBuffer) => new TextDecoder().decode(buf);

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  return new Uint8Array([...binary].map((char) => char.charCodeAt(0)));
}

export async function storeEncryptedPassword(password: string, secret: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV

  const key = await deriveKey(secret, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encode(password)
  );

  const storedData = {
    cipherText: bufferToBase64(encrypted),
    salt: bufferToBase64(salt.buffer),
    iv: bufferToBase64(iv.buffer),
  };

  sessionStorage.setItem("encPassword", JSON.stringify(storedData));
}

async function deriveKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function decryptStoredPassword(
  secret: string
): Promise<string | null> {
  const stored = sessionStorage.getItem("encPassword");
  if (!stored) return null;

  const { cipherText, salt, iv } = JSON.parse(stored);

  const key = await deriveKey(secret, base64ToBuffer(salt));

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBuffer(iv) },
    key,
    base64ToBuffer(cipherText)
  );

  return decode(decrypted);
}
