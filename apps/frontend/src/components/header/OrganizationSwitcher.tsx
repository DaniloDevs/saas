
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronsUpDown, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"
import { GetOrganizations } from "@/https/get-organizations"
import { getCurrentOrganization } from "@/auth/auth"


export async function OrganizationSwitcher() {
     const currentOrg = await getCurrentOrganization()

     const { organizations } = await GetOrganizations()
     const currentOrganization = organizations.find(org => org.slug === currentOrg)

     return (
          <DropdownMenu>
               <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border text-sm hover:bg-muted h-11 w-58 px-4" >
                    {currentOrganization ? (
                         <>
                              <Avatar className="size-5 mr-2">
                                   {currentOrganization.avatarUrl && <AvatarImage src={currentOrganization.avatarUrl}  />}
                                   <AvatarFallback  />
                              </Avatar>
                              <span className="truncate text-left"> {currentOrganization.name} </span>
                         </>
                    ) : (
                         <span className="text-muted-foreground">Select Organization</span>
                    )}

                    <ChevronsUpDown className="ml-auto size-4" />
               </DropdownMenuTrigger>

               <DropdownMenuContent align="end" alignOffset={-54} sideOffset={8} className="w-[200px]" >
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
