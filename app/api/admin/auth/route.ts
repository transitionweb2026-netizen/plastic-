import { NextResponse } from "next/server";
import { createSession, destroySession, verifyPassword } from "@/lib/cms/auth";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
