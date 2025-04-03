import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import { GetOrganizations } from "@/http/get-organizations";


export default async function Homepage() {
     const { organizations } = await GetOrganizations()
     return (
          <div className=" min-h-screen flex items-center justify-center">
               <Card className="w-2/5">
                    <CardHeader>
                         <CardTitle>Selecione sua Jornada </CardTitle>
                    </CardHeader>
                    <CardContent>
                         {
                              organizations.map(org => (
                                 <h1>{org.name}</h1>
                              ))
                         }
                    </CardContent>
               </Card>
          </div>
     );
}