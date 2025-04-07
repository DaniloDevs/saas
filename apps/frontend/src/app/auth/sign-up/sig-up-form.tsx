'use client'

import { ButtonSignInWithGithub } from "@/components/sign-in/sign-in-with-github"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useFormState } from "@/hook/useFormState"
import { AlertOctagon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link"
import { signUpAction } from "./actions"
import { ButtonSignInWithGoogle } from "@/components/sign-in/sign-in-with-google"

export default function SignUpForm() {
     const [{ errors, success, message }, handleSubmit, isPeding] = useFormState(
          signUpAction,
     )

     return (
          <div className="space-y-4">
               <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center" >

                    {success === false && message && (
                         <Alert variant="destructive" className="absolute bottom-5 right-8 w-56">
                              <AlertOctagon className="size-4" />
                              <AlertTitle>Sign In Failed!</AlertTitle>
                              <AlertDescription>
                                   <p>{message}</p>
                              </AlertDescription>
                         </Alert>
                    )}

                    <div className="space-y-1 w-full">
                         <Label htmlFor="name">Name</Label>
                         <Input name='name' id="name" />
                         {errors?.name && (
                              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.name[0]}</p>
                         )}
                    </div>

                    <div className="space-y-1 w-full">
                         <Label htmlFor="email">E-mail</Label>
                         <Input name='email' type="email" id="email" />
                         {errors?.email && (
                              <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>
                         )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1 w-full">
                              <Label htmlFor="password">Password</Label>
                              <Input name='password' type="password" id="password" />
                              {errors?.password && (
                                   <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password[0]}</p>
                              )}
                         </div>

                         <div className="space-y-1 w-full">
                              <Label htmlFor="password_confirmation">Check password</Label>
                              <Input name='password_confirmation' type="password" id="password_confirmation" />
                              {errors?.password_confirmation && (
                                   <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.password_confirmation[0]}</p>
                              )}
                         </div>
                    </div>

                    <Button type="submit" variant="outline" className="w-full" disabled={isPeding}>
                         {isPeding ? <Loader2 className="size-4 animate-spin" /> : "Create Account"}
                    </Button>

                    <Button variant="link" className="w-full" size="sm" asChild>
                         <Link href="/auth/sign-in">
                              Already registered? Sign in
                         </Link>
                    </Button>

               </form>

               <Separator />

               <div className="grid grid-cols-1 gap-2 ">
                    <ButtonSignInWithGithub />
                    <ButtonSignInWithGoogle />
               </div>
          </div>
     )
}