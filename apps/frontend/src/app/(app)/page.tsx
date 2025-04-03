import { OrganizationSwitcher } from "@/components/sidebar/OrganizationSwitcher";



export default async function Home() {
     return (
          <div className="py-4">
               <main>
                    <OrganizationSwitcher />
               </main>
          </div>
     );
}