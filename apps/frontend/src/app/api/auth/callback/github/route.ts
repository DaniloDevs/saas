import { acceptInvite } from "@/https/accept-invites";
import { SignInWithGitHub } from "@/https/sign-in-with-github";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { message: "GitHub OAtuh code was not found" },
      { status: 400 }
    );
  }

  const { token } = await SignInWithGitHub({ code });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const inviteId = cookieStore.get("inviteId")?.value;

  if (inviteId) {
    try {
      await acceptInvite(inviteId);
      cookieStore.delete("inviteId");
    } catch {}
  }
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/";
  redirectUrl.search = "";

  return NextResponse.redirect(redirectUrl);
}
