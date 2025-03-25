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
    <html lang="pt-br" className="dark">
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
