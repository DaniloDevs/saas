import { ability } from "@/auth/auth";
import { ProjectSwitcher } from "@/components/project-switcher";


export default async function Home() {
     const permissions = await ability()

     return (
          <div className="py-4">
               <header className="absolute right-10">
                    {permissions?.can('get','Project') && <ProjectSwitcher/>}
               </header>
               <main>
                
               </main>
          </div>
     );
}