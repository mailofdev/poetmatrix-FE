import { NextResponse } from "next/server";
import { rotateSession } from "../../../../lib/auth/api-session";

export async function POST() {
  const refreshed = await rotateSession();
  if (!refreshed) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
