import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { InterceptedSheetContent } from "@/components/members/intercepted/sheet-content";
import { ProjectForm } from "@/app/(app)/org/[slug]/create-project/project-form";

export default function CreateOrganization() {
     return (
          <Sheet defaultOpen>
               <InterceptedSheetContent>
                    <SheetHeader>
                         <SheetTitle> Create a new Organization </SheetTitle>
                    </SheetHeader>

                    <div className=" px-4">
                         <ProjectForm />
                    </div>
               </InterceptedSheetContent>
          </Sheet>
     )
}