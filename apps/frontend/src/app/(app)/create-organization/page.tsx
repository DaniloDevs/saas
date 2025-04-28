
import Header from "@/components/header/header"
import { OrganizationForm } from "../org/organization-form"


export default function CreateOrganization() {

     return (
          <>
               <Header />

               <div className="h-[80vh] flex flex-col items-center justify-center">
                    <h1 className="text-lg">Create Organizatin</h1>
                    <OrganizationForm />
               </div >
          </>
     )
}