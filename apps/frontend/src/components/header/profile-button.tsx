import { LogOut, Sliders, UserCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import auth from "@/auth/auth"

function getInitials(name: string): string {
     const initials = name
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('')

     return initials
}

export default async function ProfileButton() {
     const { user } = await auth()

     return (
          <DropdownMenu>
               <DropdownMenuTrigger className="flex justify-center items-center w-36 hover:cursor-pointer p-1 rounded" >
                    <div className=" flex items-center  gap-4 outline-0">
                         <div className="flex flex-col items-start">
                              <span className="text-sm font-medium">{user.name}</span>
                         </div>

                         <Avatar className="size-10 rounded-md">
                              {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                              {user.name && <AvatarFallback className="">{getInitials(user.name)}</AvatarFallback>}
                         </Avatar>
                    </div>
               </DropdownMenuTrigger>

               <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side={"bottom"}
                    align="start"
                    sideOffset={28}
                    alignOffset={-110}
               >
                    <DropdownMenuLabel className="p-0 font-normal">
                         <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                              <Avatar className="h-8 w-8 rounded-lg">
                                   {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                                   {user.name && <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>}
                              </Avatar>
                              <div className="grid flex-1 text-left text-sm leading-tight">
                                   <span className="truncate font-medium">{user.name}</span>
                                   <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                   </span>
                              </div>
                         </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                         <DropdownMenuItem>
                              <UserCircleIcon />
                              Account
                         </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                         <a href="/api/auth/sign-out" className="flex gap-2">
                              <LogOut className="size-4 mr-2" />
                              Sign Out
                         </a>
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     );
}