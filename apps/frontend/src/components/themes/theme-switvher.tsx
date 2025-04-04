"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"


export function ThemeSwitcher() {
    const {setTheme, resolvedTheme} = useTheme()
    

     return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"> 
                    {resolvedTheme === "light" && <Sun className="size-4"/>}
                    {resolvedTheme === "dark" && <Moon className="size-4"/>}
                    
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuItem onClick={()=> setTheme('light')}>
                    light   
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setTheme('dark')}>
                    dark   
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> setTheme('system')}>
                    system   
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     )
}
