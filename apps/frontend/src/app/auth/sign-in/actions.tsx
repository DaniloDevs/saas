'use server'

import { SignInWithPassWord } from "@/http/authenticate-with-password"
import { HTTPError } from "ky"
import { z } from "zod"

const signInSchema = z.object({
     email: z.string().email({ message: "Please, provide a valid e-mail address" }),
     password: z.string().min(1, { message: "Please, provide your password" })
})

export async function signInWithEmailAndPassword( data: FormData) {

     const result = signInSchema.safeParse(Object.fromEntries(data))

     if (!result.success) {
          const errors = result.error.flatten().fieldErrors

          return { sucess: false, message: null, errors }
     }
     const { email, password } = result.data



     try {
          const { token } = await SignInWithPassWord({
               email,
               password
          })
     } catch (err) {
          if (err instanceof HTTPError) {
               const { message } = await err.response.json()

               return { sucess: false, message, errors: null }
          }
          
          return { sucess: false, message: "Unexpected error, try again a few minutes.", errors: null }
     }

     return { sucess: true, message: null, errors: null }
}