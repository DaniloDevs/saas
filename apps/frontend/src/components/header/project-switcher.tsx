"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { ChevronsUpDown, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Skeleton } from "../ui/skeleton"
import { GetProjects } from "@/https/get-project"


export function ProjectSwitcher() {
     const { slug: orgSlug, project: projectSlug } = useParams<{ slug: string, project: string }>()


     const { data, isLoading } = useQuery({
          queryKey: [orgSlug, 'projects'],
          queryFn: () => GetProjects(orgSlug),
          enabled: !!orgSlug
     })

     const currentProject = data && projectSlug
          ? data.projects.find((project) => project.slug === projectSlug)
          : null

     return (
          <DropdownMenu>
               <DropdownMenuTrigger className="flex items-center gap-2 rounded-sm border text-sm hover:bg-muted h-11 w-44 px-4" >
                    {isLoading ? (
                         <>
                              <Skeleton className="size-5 shrink-0 rounded-full" />
                              <Skeleton className="h-5 w-full" />
                         </>
                    ) : (
                         <>
                              {currentProject ? (
                                   <>
                                        <Avatar className="size-5 ">
                                             {currentProject.avatarUrl && <AvatarImage src={currentProject.avatarUrl} />}
                                             <AvatarFallback />
                                        </Avatar>
                                        <span className="truncate text-left"> {currentProject.name} </span>
                                   </>
                              ) : (
                                   <span className="text-muted-foreground ">Select Project</span>
                              )}

                              <ChevronsUpDown className="ml-auto size-4 shrink-0" />

                         </>
                    )}
               </DropdownMenuTrigger>


               <DropdownMenuContent align="center" alignOffset={-54} sideOffset={8} className="w-[200px]" >
                    <DropdownMenuGroup>
                         <DropdownMenuLabel>Projects</DropdownMenuLabel>
                         {data && data.projects.map((project => {
                              return (
                                   <DropdownMenuItem key={project.id} asChild>
                                        <Link href={`/org/${orgSlug}/project/${project.slug}`}>
                                             <DropdownMenuItem>
                                                  <Avatar className="mr-2 size-5">
                                                       {project.avatarUrl && <AvatarImage src={project.avatarUrl} />}
                                                       <AvatarFallback />
                                                  </Avatar>
                                                  <span className="line-clamp-1"> {project.name} </span>
                                             </DropdownMenuItem>
                                        </Link>
                                   </DropdownMenuItem>
                              )
                         }))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                         <Link href={`/org/${orgSlug}/create-project`}>
                              <PlusCircle className="mr-2 size-5" />
                              Create New
                         </Link>
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu >
     )
}