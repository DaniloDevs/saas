
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { ChevronsUpDown, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import { GetOrganizations } from "@/http/get-organizations"
import { cookies } from "next/headers"


export async function OrganizationSwitcher() {
     const cookie = await cookies()
     const currentOrg = cookie.get('org')?.value

     const { organizations } = await GetOrganizations()
     const currentOrganization = organizations.find(org => org.slug === currentOrg)

     console.log(currentOrganization

     )
     return (
          <DropdownMenu>
               <DropdownMenuTrigger className="flex items-center gap-2 rounded text-sm font-medium outline-none focus-visible:right-2 focus-visible:ring-primary">
                    {currentOrganization ? (
                         <>
                              <Avatar className="mr-2 size-5">
                                   {currentOrganization.avatarUrl && <AvatarImage src={currentOrganization.avatarUrl} />}
                                   <AvatarFallback />
                              </Avatar>
                              <span className="truncate text-left"> {currentOrganization.name} </span>
                         </>
                    ) : (
                         <span className="text-muted-foreground">Select Organization</span>
                    )}

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
                                                       {org.avatarUrl && <AvatarImage src={org.avatarUrl} />}
                                                       <AvatarFallback />
                                                  </Avatar>
                                                  <span className="line-clamp-1"> {org.name} </span>
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
          </DropdownMenu >
     )
}
