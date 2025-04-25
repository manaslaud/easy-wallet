"use client";
import { DerivationKey } from "@/types/account";
export async function encrypt(password: string, text: string) {
  const encoder = new TextEncoder();

  // 1. Generate salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  // 2. Derive a key using PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt"]
  );

  // 3. Encrypt the text
  const textEncoded = encoder.encode(text);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    textEncoded
  );

  // Convert the result to hex
  const hex = arrayBufferToHex(encrypted);

  const derivationKeyObject: DerivationKey = {
    salt,
    iv,
    derivationKey: key,
    iterations: 100_000,
    keylen: 256,
  };

  return { res: hex, DK: derivationKeyObject };
}

export async function decrypt(
  password: string,
  encryptedHex: string,
  salt: Uint8Array,
  iv: Uint8Array
) {
  const encoder = new TextEncoder();

  // 1. Convert the hex string back to an ArrayBuffer
  const encryptedArrayBuffer = hexToArrayBuffer(encryptedHex);

  // 2. Derive the key using the same parameters (password, salt, and iterations) as during encryption
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["decrypt"]
  );

  // 3. Decrypt the text using AES-GCM
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedArrayBuffer
    );

    // Convert the decrypted ArrayBuffer to a string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (err) {
    console.error("Decryption failed:", err);
    throw new Error("Decryption failed");
  }
}

export async function isPasswordCorrect(
  password: string,
  encryptedHex: string,
  salt: Uint8Array,
  iv: Uint8Array
) {
  const encoder = new TextEncoder();

  const encryptedArrayBuffer = hexToArrayBuffer(encryptedHex);

  // Derive the key from the password using the same salt, iterations, and hash function
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["decrypt"]
  );

  // Try to decrypt the data with the derived key
  try {
    await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedArrayBuffer
    );
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Utility function to convert Hex string to ArrayBuffer
function hexToArrayBuffer(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// Utility function to convert ArrayBuffer to Hex string
function arrayBufferToHex(buffer: ArrayBuffer) {
  const byteArray = new Uint8Array(buffer);
  let hexString = "";
  byteArray.forEach((byte) => {
    hexString += byte.toString(16).padStart(2, "0");
  });
  return hexString;
}
