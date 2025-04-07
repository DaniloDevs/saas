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
import { PlusCircle, Swords } from "lucide-react";
import Link from "next/link";


export default async function Homepage() {
     const { organizations } = await GetOrganizations()

     return (
          <div className="min-h-screen flex items-center justify-center">
               <Card className="w-1/5 border-none rounded-xl" >
                    <CardHeader className="text-center">
                         <CardTitle> Choose an Organization</CardTitle>
                    </CardHeader>
                    <CardContent className="w-full flex justify-center ">
                         <div className=" w-fit flex flex-col gap-4">
                              {organizations.map((org => {
                                   return (
                                        <Link href={`/org/${org.slug}`} key={org.id} className="w-full duration-150 hover:bg-accent hover:rounded-xl flex items-center py-2 px-5 rounded-2xl">
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

                    <CardFooter className="flex justify-center">
                         <CardTitle>

                              <Link href="/create-organization" className="flex items-center">
                                   <PlusCircle className="mr-2 size-5" />
                                   Create a new Organization
                              </Link>

                              {/* <Link href="" className="flex items-center">
                                   <Swords className="mr-2 size-6"/>
                                   <span> Search for your Characters </span>
                              </Link> */}
                         </CardTitle>
                    </CardFooter>
               </Card>
          </div>
     );
}