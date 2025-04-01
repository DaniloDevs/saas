import { isAuthenticated } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     if(await isAuthenticated()) {
          redirect('/')
     }

     return (
               <div className="min-h-screen flex items-center justify-center px-4">
                    {/* <div className="absolute w-full h-full-z-10">
                         IMAGEM DE FUNDO
                    </div> */}
                    <div className="w-full max-w-xs">
                         {children}
                    </div>
               </div>
          );
}
