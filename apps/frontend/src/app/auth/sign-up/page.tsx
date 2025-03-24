import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import gitHubIcon from "@/assets/github-logo.svg"
import googleIcon from "@/assets/google-logo.svg"
import Image from "next/image";

export default function SignUpPage() {
     return (
          <form action="" className="space-y-6 flex flex-col items-center" >
               <div className="space-y-1 w-full">
                    <Label htmlFor="name">Name</Label>
                    <Input name='name' id="name" />
               </div>

               <div className="space-y-1 w-full">
                    <Label htmlFor="email">E-mail</Label>
                    <Input name='email' type="email" id="email" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 w-full">
                         <Label htmlFor="password">Password</Label>
                         <Input name='password' type="password" id="password" />
                    </div>

                    <div className="space-y-1 w-full">
                         <Label htmlFor="password_confirmation">Check password</Label>
                         <Input name='password_confirmation' type="password" id="password_confirmation" />
                    </div>
               </div>

               <Button type="submit" variant="outline" className="w-full">
                    Create Account
               </Button>

               <Button variant="link" className="w-full" size="sm" asChild>
                    <Link href="/auth/sign-in">
                         Already registered? Sign in
                    </Link>
               </Button>

               <Separator />

               <div className="grid grid-cols-2 gap-2 ">
                    <Button type="submit" variant="secondary" className="w-full">
                         <Image src={googleIcon} className="size-5 mr-2" alt="GitHub Icon" />
                         Google Sign-up
                    </Button>

                    <Button type="submit" variant="secondary" className="w-full">
                         <Image src={gitHubIcon} className="size-5 mr-2 dark:invert" alt="GitHub Icon" />
                         GitHub Sign-up
                    </Button>
               </div>
          </form>
     )
}