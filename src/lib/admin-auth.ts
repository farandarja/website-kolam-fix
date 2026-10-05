import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 jam

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET belum diisi di .env.local. Isi dengan string acak yang panjang & rahasia."
    );
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Verifikasi username/password admin terhadap env var. */
export function verifyAdminCredentials(username: string, password: string) {
  const envUser = process.env.ADMIN_USERNAME ?? "";
  const envPass = process.env.ADMIN_PASSWORD ?? "";
  if (!envUser || !envPass) return false;

  const userBuf = Buffer.from(username);
  const envUserBuf = Buffer.from(envUser);
  const passBuf = Buffer.from(password);
  const envPassBuf = Buffer.from(envPass);

  const userMatch =
    userBuf.length === envUserBuf.length && timingSafeEqual(userBuf, envUserBuf);
  const passMatch =
    passBuf.length === envPassBuf.length && timingSafeEqual(passBuf, envPassBuf);

  return userMatch && passMatch;
}

/** Buat nilai cookie session admin yang sudah ditandatangani (signed). */
export function createAdminSessionValue(username: string) {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${username}.${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

/** Cek apakah nilai cookie session admin masih valid. */
export function isValidAdminSessionValue(value: string | undefined | null) {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [username, expiresAtStr, signature] = parts;
  const expiresAt = Number(expiresAtStr);
  if (!username || !expiresAt || !signature) return false;
  if (Date.now() > expiresAt) return false;

  const expectedSignature = sign(`${username}.${expiresAt}`);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(sigBuf, expectedBuf);
}

/** Helper untuk dipakai di Server Component / Route Handler. */
export async function getAdminSessionFromCookies() {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminSessionValue(value);
}
