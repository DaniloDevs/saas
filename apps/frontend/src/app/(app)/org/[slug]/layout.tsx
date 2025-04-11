import Header from "@/components/header/header";

export default async function AppLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {

     return (
          <div>
               <div>
                    <Header />
               </div>

               <main className="mx-auto w-full max-w-[1200px] py-4">{children}</main>
          </div>
     )
}
