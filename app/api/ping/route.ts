export const runtime = 'nodejs';

import { adminDb } from "@/lib/admin";

export async function GET() {
  const time = Date.now();
  await adminDb.collection("_smoke").doc("ping").set({ time });
  return new Response(JSON.stringify({ ok: true, time }), { status: 200 });
}
