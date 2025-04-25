import { Slash } from "lucide-react";
import { ThemeSwitcher } from "../themes/theme-switvher";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import ProfileButton from "./profile-button";
import { Separator } from "../ui/separator";
import { ability } from "@/auth/auth";
import { ProjectSwitcher } from "./project-switcher";
import { Tabs } from "./tabs";


export default async function Header() {
     const permissions = await ability()

     return (
          <div className="flex p-4 justify-between border-b">
               <div className="flex gap-4 justify-center">
                    <OrganizationSwitcher />
                    {permissions?.can('get', 'Project') && <ProjectSwitcher />}

                    <Tabs />
               </div>
               <div className="flex items-center ">
                    <ProfileButton />
                    <Slash className="size-5 -rotate-45 text-border" />
                    <ThemeSwitcher />
               </div>
          </div>
     )
}
