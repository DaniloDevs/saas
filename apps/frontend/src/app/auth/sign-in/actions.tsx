'use server'

import { SignInWithPassWord } from "@/http/authenticate-with-password"


export async function signInWithEmailAndPassword(data: FormData) {
     const { email, password } = Object.fromEntries(data)

     const result = await SignInWithPassWord({
          email: String(email),
          password: String(password)
     })

     console.log(result)
}