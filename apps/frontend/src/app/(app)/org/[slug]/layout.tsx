import Header from "@/components/header/header";

export default function AppLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {

     return (
          <div>
               <Header />

               <main className="mx-auto w-full max-w-[1200px] py-4">{children}</main>
          </div>
     )
}
