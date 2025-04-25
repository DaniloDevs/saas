"use client"

import { ThemeProvider } from 'next-themes'
import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';




export function Providers ({ children }:  {children: React.ReactNode}){
    return(
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme='dark' disableTransitionOnChange>
            {children}  
            </ThemeProvider>
            <Toaster />
        </QueryClientProvider>
    )
} 