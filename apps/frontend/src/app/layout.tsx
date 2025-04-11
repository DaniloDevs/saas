import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';


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
        <Providers>
          {children}  
        </Providers>
      </body>
    </html>
  );
}
