import { requireAdminToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    requireAdminToken(request);
  } catch (err) {
    return err as Response;
  }
  return Response.json({ ok: true, ts: new Date().toISOString() });
}


