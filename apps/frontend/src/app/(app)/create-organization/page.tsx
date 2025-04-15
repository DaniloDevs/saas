
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrganizationForm } from "./organization-form"
import Header from "@/components/header/header"


export default function CreateOrganization() {

     return (
          <>
               <Header/>
               
               <div className="h-[80vh] flex flex-col items-center justify-center">
                    <Card>
                         <CardHeader className="flex justify-center">
                              <CardTitle>Create Organizatin</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <OrganizationForm />
                         </CardContent>
                    </Card>
               </div>
          </>
     )
}