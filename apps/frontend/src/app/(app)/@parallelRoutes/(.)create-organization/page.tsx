import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { OrganizationForm } from "../../org/organization-form";
import { InterceptedSheetContent } from "@/components/intercepted/sheet-content";

export default function CreateOrganization() {
     return (
          <Sheet defaultOpen>
               <InterceptedSheetContent>
                    <SheetHeader>
                         <SheetTitle> Create a new Organization </SheetTitle>
                    </SheetHeader>

                    <div className=" px-4">
                         <OrganizationForm />
                    </div>
               </InterceptedSheetContent>
          </Sheet>
     )
}