
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { ChevronsUpDown, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import { GetOrganizations } from "@/http/get-organizations"


export async function OrganizationSwitcher() {
     const { organizations } = await GetOrganizations()

     return (
          <DropdownMenu>
               <DropdownMenuTrigger className="flex items-center gap-2 rounded text-sm font-medium outline-none focus-visible:right-2 focus-visible:ring-primary">
                    <span className="text-muted-foreground">Select Organization</span>
                    <ChevronsUpDown className="ml-auto size-4" />
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" alignOffset={-16} sideOffset={12} className="w-[200px]" >
                    <DropdownMenuGroup>
                         <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                         {organizations.map((org => {
                              return (
                                   <DropdownMenuItem key={org.id} asChild>
                                        <Link href={`/org/${org.slug}`}>
                                             <DropdownMenuItem>
                                                  <Avatar className="mr-2 size-5">
                                                       <AvatarImage src="https://github.com/rocketseat.png" />
                                                       <AvatarFallback />
                                                  </Avatar>
                                                  <span className="line-clamp-1"> Rocketseat </span>
                                             </DropdownMenuItem>
                                        </Link>
                                   </DropdownMenuItem>
                              )
                         }))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                         <Link href="/create-organization">
                              <PlusCircle className="mr-2 size-5" />
                              Create New
                         </Link>
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}
