import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import { GetOrganizations } from "@/http/get-organizations";
import { Swords } from "lucide-react";
import Link from "next/link";


export default async function Homepage() {
     const { organizations } = await GetOrganizations()

     return (
          <div className=" min-h-screen flex items-center justify-center">
               <Card className="w-1/5 border-none rounded-xl" >
                    <CardHeader className="text-center">
                         <CardTitle> Select your Campaign </CardTitle>
                         <CardDescription>or search for your characters</CardDescription>
                    </CardHeader>
                    <CardContent  className="w-full flex justify-center ">      
                         <div className=" w-fit flex flex-col gap-4">
                              {organizations.map((org => {
                                   return (
                                        <Link href={`/org/${org.slug}`} key={org.id} className="w-full flex items-center p-2  shadow-2xl rounded-2xl">
                                             <Avatar className="mr-2 size-8 ">
                                                  {org.avatarUrl && <AvatarImage src={org.avatarUrl} />}
                                                  <AvatarFallback />
                                             </Avatar>
                                             <span className="truncate"> {org.name} </span>
                                        </Link>
                                   )
                              }))}
                         </div>   

                    </CardContent>
                    
                    <Separator />     

                    <CardFooter>
                         <CardTitle className="flex items-center ">
                              <Link href="" children>
                              
                              </Link>
                              <Swords className="mr-2 size-6"/>
                              <span> Search for your Characters </span>
                         </CardTitle>
                    </CardFooter>       
               </Card>
          </div>
     );
}