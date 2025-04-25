
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectForm } from "./project-form"
import { ability, getCurrentOrganization } from "@/auth/auth"
import { redirect } from "next/navigation"

export default async function CreateProjectPage() {
     const permissions = await ability()

     if (permissions?.cannot('create', 'Project')) {
          const org = await getCurrentOrganization()

          redirect(`/org/${org}`)
     }

     return (
          <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
               <h1>Create Project</h1>
               <ProjectForm />
          </div>
     )
}