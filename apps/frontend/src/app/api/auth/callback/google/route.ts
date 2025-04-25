import { SignInWithGitHub } from "@/https/sign-in-with-github";
import { SignInWithGoogle } from "@/https/sign-in-with-google";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
     const { searchParams } = new URL(request.url)
     
     const code = searchParams.get("code")

     if (!code) {
          return NextResponse.json(
               { message: 'Google OAtuh code was not found' },
               { status: 400 }
          )
     }
     
     const { token } = await SignInWithGoogle({ code })

     const cookieStore = await cookies()
     cookieStore.set('token', token, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
     })

     const redirectUrl = request.nextUrl.clone()
     redirectUrl.pathname = '/'
     redirectUrl.search = ''

     return NextResponse.redirect(redirectUrl)
}


