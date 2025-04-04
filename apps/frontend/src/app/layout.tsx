import { ThemeProvider } from 'next-themes'
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Mystic Sheet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning >
      <body className={"antialiased"}>
          <ThemeProvider attribute="class" defaultTheme='dark' disableTransitionOnChange>
            {children}  
          </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
