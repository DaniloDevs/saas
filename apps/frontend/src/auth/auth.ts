import { GetProfile } from "@/http/get-profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
     const cookie = await cookies()

     return !!cookie.get('token')?.value
}

export default async function auth() {
     const cookie = await cookies()

     const token = cookie.get('token')?.value

     if (!token) {
          redirect('/auth/sign-in')
     }

     try {
          const { user } = await GetProfile()

          return { user }
     } catch (err) {
          console.log(err)
     }

     redirect('/api/auth/sign-out')
}