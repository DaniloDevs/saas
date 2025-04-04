

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent, SidebarHeader,
  SidebarMenu, SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar"
import ProfileButton from "./profile-button"
import { items } from "./menu-items"
import { OrganizationSwitcher } from "./OrganizationSwitcher"
import { ThemeSwitcher } from "../themes/theme-switvher"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader >
        <OrganizationSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter className="flex flex-row items-center bg-background rounded-2xl">
        <ProfileButton />
        <ThemeSwitcher />
      </SidebarFooter>
    </Sidebar>
  )
}
