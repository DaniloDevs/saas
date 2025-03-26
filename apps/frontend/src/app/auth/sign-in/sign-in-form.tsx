'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useTransition, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import googleIcon from "@/assets/google-logo.svg";
import gitHubIcon from "@/assets/github-logo.svg";

import { signInWithEmailAndPassword } from "./actions";
import { AlertOctagon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SignInForm() {

     const [isPeding, startTransition] = useTransition()

     const [{ sucess, message, errors }, setFormState] = useState<{
          sucess: Boolean,
          message: string | null,
          errors: Record<string, string[]> | null
     }>({
          sucess: false,
          message: null,
          errors: null
     })

     async function handlerSignIn(event: FormEvent<HTMLFormElement>) {
          event.preventDefault()

          const form = event.currentTarget
          const data = new FormData(form)

          startTransition(async () => {
               const state = await signInWithEmailAndPassword(data)
               setFormState(state)
          })
     }

     return (
          <form onSubmit={handlerSignIn} className="space-y-6 flex flex-col items-center" >

               {sucess === false && message && (
                    <Alert variant="destructive" className="absolute bottom-5 right-8 w-56">
                         <AlertOctagon className="size-4" />
                         <AlertTitle>Sign In Failed!</AlertTitle>
                         <AlertDescription>
                              <p>{message}</p>
                         </AlertDescription>
                    </Alert>
               )}

               <div className="space-y-1 w-full">
                    <Label htmlFor="email" className="mb-2">E-mail</Label>
                    <Input name='email' type="email" id="email" />

                    {errors?.email && (
                         <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>
                    )}
               </div>

               <div className="space-y-1 w-full">
                    <Label htmlFor="password" className="mb-2">Password</Label>
                    <Input name='password' type="password" id="password" />

                    {errors?.password && (
                         <p className="text-xs font-mediun text-red-500 dark:text-red-400">{errors.password[0]}</p>
                    )}

                    <Link href="/auth/forgot-password" className="text-xs font-medium text-foreground hover:underline">
                         Forgot your Password
                    </Link>
               </div>

               <Button type="submit" variant="outline" className="w-full" disabled={isPeding}>
                    {isPeding ? <Loader2 className="size-4 animate-spin" /> : "Sign in With e-mail"}
               </Button>

               <Button variant="link" className="w-full" size="sm" asChild>
                    <Link href="/auth/sign-up">
                         Create new Account
                    </Link>
               </Button>


               <Separator />

               <div className="grid grid-cols-2 gap-2 ">
                    <Button type="submit" variant="secondary" className="w-full">
                         <Image src={googleIcon} className="size-5 mr-2" alt="GitHub Icon" />
                         Google Sign-in
                    </Button>

                    <Button type="submit" variant="secondary" className="w-full">
                         <Image src={gitHubIcon} className="size-5 mr-2 dark:invert" alt="GitHub Icon" />
                         GitHub Sign-in
                    </Button>
               </div>
          </form>
     )
}