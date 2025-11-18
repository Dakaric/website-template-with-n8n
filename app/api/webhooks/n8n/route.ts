import { requireAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    requireAdminToken(request);
  } catch (err) {
    return err as Response;
  }

  const body = await request.json().catch(() => ({}));
  return Response.json({ received: true, body }, { status: 200 });
}


