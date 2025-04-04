import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/siteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AppLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
   
     return (
          <SidebarProvider>
               <AppSidebar variant="inset" />
               <SidebarInset className="rounded-2xl">
                    <SiteHeader />
                    {children}
               </SidebarInset>
          </SidebarProvider>
     )
}
