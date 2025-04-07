import Image from "next/image";
import { Button } from "../ui/button";
import googleIcon from "@/assets/google-logo.svg";
import { signInWithGithub, signInWithGoogle } from "@/app/auth/action";

export function ButtonSignInWithGoogle() {
     return (
          <form action={signInWithGoogle}>
               <Button type="submit" variant="secondary" className="w-full">
                    <Image src={googleIcon} className="size-5 mr-2" alt="google Icon" />
                    Google Sign-in
               </Button>
          </form>
     )
}