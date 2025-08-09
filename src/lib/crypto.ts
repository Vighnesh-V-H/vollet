import { randomBytes, secretbox } from "tweetnacl";
import bs58 from "bs58";
import Crypto from "crypto";
const { encode, decode } = bs58;

export function generateSalt(length = 16): Uint8Array {
  const salt = new Uint8Array(length);
  crypto.getRandomValues(salt);
  return salt;
}

export async function hashPassword(
  password: string,
  saltHex: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + saltHex);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return bufferToHex(hashBuffer);
}

export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, 2), 16);
  }
  return bytes.buffer;
}

export type CipherPayload = {
  ciphertext: string;
  nonce: string;
  salt: string;
  kdf: string;
  iterations: number;
  digest: string;
};

export async function encrypt(
  plaintext: string,
  password: string
): Promise<CipherPayload> {
  const salt = randomBytes(16);
  const kdf = "pbkdf2";
  const iterations = 600000;
  const digest = "sha256";

  const key = await deriveEncryptionKey(
    password,
    salt,
    iterations,
    digest,
    secretbox.keyLength
  );

  const nonce = randomBytes(secretbox.nonceLength);
  const ciphertext = secretbox(Buffer.from(plaintext), nonce, key);

  return {
    ciphertext: encode(ciphertext),
    nonce: encode(nonce),
    kdf,
    salt: encode(salt),
    iterations,
    digest,
  };
}

export async function decrypt(
  cipherObj: CipherPayload,
  password: string
): Promise<string> {
  const {
    ciphertext: encodedCiphertext,
    nonce: encodedNonce,
    salt: encodedSalt,
    iterations,
    digest,
  } = cipherObj;

  const ciphertext = decode(encodedCiphertext);
  const nonce = decode(encodedNonce);
  const salt = decode(encodedSalt);

  const key = await deriveEncryptionKey(
    password,
    salt,
    iterations,
    digest,
    secretbox.keyLength
  );

  const plaintext = secretbox.open(ciphertext, nonce, key);
  if (!plaintext) {
    throw new Error("Incorrect password");
  }

  return Buffer.from(plaintext).toString();
}

async function deriveEncryptionKey(
  password: string,
  salt: Uint8Array,
  iterations: number,
  digest: string,
  keyLength: number
): Promise<any> {
  return new Promise((resolve, reject) =>
    Crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, key) =>
      err ? reject(err) : resolve(key)
    )
  );
}

export function hexToUint8Array(hex: string) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}
