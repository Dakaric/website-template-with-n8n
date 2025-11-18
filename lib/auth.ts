export function requireAdminToken(request: Request): void {
  const authDisabled = process.env.AUTH_DISABLED === "true";
  if (authDisabled) return;

  const token = request.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    throw new Response("Unauthorized", { status: 401 });
  }
}


