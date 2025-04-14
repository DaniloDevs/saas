'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { ChevronsUpDown, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { GetProjects } from "@/http/get-project"
import { useParams } from "next/navigation"


export  function ProjectSwitcher() {
    const {slug: orgSlug} = useParams<{
         slug: string
    }>()

    const {data,isLoading} = useQuery({
         queryKey: [orgSlug, 'projects'],
         queryFn: async () => await GetProjects(orgSlug),
         enabled: !!orgSlug,
    })

    return (
        <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border text-sm hover:bg-muted h-11 w-44 px-4" >
             {/* {currentOrganization ? (
                  <>
                       <Avatar className="size-5 mr-2 ">
                            {currentOrganization.avatarUrl && <AvatarImage src={currentOrganization.avatarUrl}  />}
                            <AvatarFallback  />
                       </Avatar>
                       <span className="truncate text-left"> {currentOrganization.name} </span>
                  </>
             ) : (
            )} */}
            <span className="text-muted-foreground">Select Project</span>

             <ChevronsUpDown className="ml-auto size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" alignOffset={-54} sideOffset={8} className="w-[200px]" >
             <DropdownMenuGroup>
                  <DropdownMenuLabel>Project</DropdownMenuLabel>
                  {/* {organizations.map((org => {
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
                  }))} */}
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