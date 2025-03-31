import auth from "@/auth/auth";

export default async function Home() {

     const { user } = await auth()

     return (
          <div className="min-h-screen w-full flex justify-center items-center">
               <div className="flex flex-col gap-4 justify-center items-center">
                    <pre>
                         {JSON.stringify(user, null, 2)}
                    </pre>
               </div>
          </div>
     );
}