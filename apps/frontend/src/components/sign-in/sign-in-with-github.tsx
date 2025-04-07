import Image from "next/image";
import { Button } from "../ui/button";
import gitHubIcon from "@/assets/github-logo.svg";
import { signInWithGithub } from "@/app/auth/action";

export function ButtonSignInWithGithub() {
     return (
          <form action={signInWithGithub}>
               <Button type="submit" variant="ghost" className="w-full border">
                    <Image src={gitHubIcon} className="size-5 mr-2 shadow-2xl dark:invert" alt="GitHub Icon" />
                    GitHub Sign-in
               </Button>
          </form>
     )
}