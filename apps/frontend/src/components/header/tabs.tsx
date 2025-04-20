import { ability, getCurrentOrganization } from "@/auth/auth"
import { Button } from "../ui/button"
import { NavLink } from "./nav-link"


export async function Tabs() {
     const currentOrg = await getCurrentOrganization() as string

         const permissions = await ability()

     return (
               <nav className="flex items-center justify-center gap-2">
                    <Button
                         asChild
                         variant="ghost"
                         size="sm"
                         className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
                    >
                         <NavLink href={`/org/${currentOrg}`}>home</NavLink>
                    </Button>
                    <Button
                         asChild
                         variant="ghost"
                         size="sm"
                         className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
                    >
                         <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
                    </Button>
                    <Button
                         asChild
                         variant="ghost"
                         size="sm"
                         className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
                    >
                         <NavLink href={`/org/${currentOrg}/settings`}>
                              Settings & Billing
                         </NavLink>
                    </Button>
               </nav>
     )
}