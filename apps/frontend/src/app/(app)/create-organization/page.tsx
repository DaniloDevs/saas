
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationForm } from "./organization-form"


export default function CreateOrganization() {

     return (
          <div className="min-h-screen flex items-center justify-center">
               <Card>
                    <CardHeader className="flex justify-center">
                         <CardTitle>Create Organizatin</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <OrganizationForm />
                    </CardContent>
               </Card>
          </div>
     )
}