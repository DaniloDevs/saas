'use server'

import { SignInWithPassWord } from "@/http/authenticate-with-password"
import { SignUp } from "@/http/sign-up"
import { HTTPError } from "ky"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const signUpSchema = z.object({
     name: z.string().refine(value => value.split(' ').length > 1, {
          message: "Please, enter you full name "
     }),
     email: z.string().email({ message: "Please, provide a valid e-mail address" }),
     password: z.string().min(6, { message: "Password should have at least 6 characters" }),
     password_confirmation: z.string()
}).refine(data => data.password === data.password_confirmation, {
     message: 'Password confirmation does not math',
     path: ['password_confirmation']
})

export async function signUpAction(data: FormData) {

     const result = signUpSchema.safeParse(Object.fromEntries(data))

     if (!result.success) {
          const errors = result.error.flatten().fieldErrors

          return { success: false, message: null, errors }
     }
     const { name, email, password } = result.data


     try {
          await SignUp({
               name,
               email,
               password
          })


     } catch (err) {
          if (err instanceof HTTPError) {
               const { message } = await err.response.json()

               return { success: false, message, errors: null }
          }

          return { success: false, message: "Unexpected error, try again a few minutes.", errors: null }
     }

     redirect('/')
}