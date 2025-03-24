import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import gitHubIcon from "@/assets/github-logo.svg"
import googleIcon from "@/assets/google-logo.svg"
import Image from "next/image";

export default function SignInPage() {
     return (
          <form action="" className="space-y-6 flex flex-col items-center" >
               <div className="space-y-1 w-full">
                    <Label htmlFor="email">E-mail</Label>
                    <Input name='email' type="email" id="email" />
               </div>

               <div className="space-y-1 w-full">
                    <Label htmlFor="password">Password</Label>
                    <Input name='password' type="password" id="password" />

                    <Link href="/auth/forgot-password" className="text-xs font-medium text-foreground hover:underline">
                         Forgot your Password
                    </Link>
               </div>

               <Button type="submit" className="w-full">
                    Sign in With e-mail
               </Button>

               <Separator />

               <div className="grid grid-cols-2 gap-2 ">
                    <Button type="submit" variant="outline" className="w-full">
                         <Image src={googleIcon} className="size-5 mr-2" alt="GitHub Icon" />
                         Google Sign-in
                    </Button>

                    <Button type="submit" variant="outline" className="w-full">
                         <Image src={gitHubIcon} className="size-5 mr-2 dark:invert" alt="GitHub Icon" />
                         GitHub Sign-in
                    </Button>
               </div>
          </form>
     )
}