'use client'

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { AlertOctagon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormState } from "@/hook/useFormState";
import { signInWithEmailAndPassword } from "./actions";
import { useRouter } from "next/navigation";
import { ButtonSignInWithGithub } from "@/components/sign-in/sign-in-with-github"

export function SignInForm() {
     const [{ errors, success, message }, handleSubmit, isPeding] = useFormState(
          signInWithEmailAndPassword,
          // () => { router.push("/dashboard") }
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

               </form>

               <Separator />

               <div className="grid grid-cols-1 gap-2 ">
                   
                    {/* <ButtonSignInWithGoogle /> */}
                   
                    <ButtonSignInWithGithub />

               </div>
          </div>
     )
}