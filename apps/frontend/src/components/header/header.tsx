import { Slash } from "lucide-react";
import { ThemeSwitcher } from "../themes/theme-switvher";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import ProfileButton from "./profile-button";
import { Separator } from "../ui/separator";


export default function Header() {
     return (
          <div className="flex p-4 justify-between border-b">
               <OrganizationSwitcher />
               <div className="flex items-center ">
                    <ProfileButton />
                    <Slash className="size-5 -rotate-45 text-border" />
                    <ThemeSwitcher />
               </div>
          </div>
     )
}
