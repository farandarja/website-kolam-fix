import { z } from "zod";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionValue,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Username & password wajib diisi" }, { status: 400 });
    }

    const { username, password } = parsed.data;
    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      return Response.json({ error: "Username atau password salah" }, { status: 401 });
    }

    const sessionValue = createAdminSessionValue(username);
    const store = await cookies();
    store.set(ADMIN_COOKIE_NAME, sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 jam
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ error: "Server error", message: err?.message ?? "unknown" }, { status: 500 });
  }
}
