import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default async function CreateOrganization() {

     return (
          <div className="min-h-screen flex items-center justify-center">
               <Card>
                    <CardHeader className="flex justify-center">
                         <CardTitle>Create Organizatin</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <form className="space-y-6 flex flex-col items-center" >

                              {/* {success === false && message && (
                                   <Alert variant="destructive" className="absolute bottom-5 right-8 w-56">
                                        <AlertOctagon className="size-4" />
                                        <AlertTitle>Sign In Failed!</AlertTitle>
                                        <AlertDescription>
                                             <p>{message}</p>
                                        </AlertDescription>
                                   </Alert>
                              )} */}

                              <div className="space-y-2 w-full">
                                   <Label htmlFor="name">Organziation name</Label>
                                   <Input name='name' id="name" />

                                   {/* {errors?.name && (
                                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.name[0]}</p>
                                   )} */}
                              </div>

                              <div className="space-y-2 w-full">
                                   <Label htmlFor="domain">E-mail domain</Label>
                                   <Input name='domain' type="text" id="domain" inputMode="url" placeholder="exemple.com" />

                                   {/* {errors?.email && (
                                        <p className="text-xs font-medium text-red-500 dark:text-red-400">{errors.email[0]}</p>
                                   )} */}
                              </div>

                              <div className="space-y-1">
                                   <div className="flex items-start space-x-2">
                                        <div className="translate-y-0.5">
                                             <Checkbox
                                                  name="shouldAttachUsersByDomain"
                                                  id="shouldAttachUsersByDomain"
                                             />
                                        </div>
                                        <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
                                             <span className="text-sm font-medium leading-none">
                                                  Auto-join new members
                                             </span>
                                             <p className="text-sm text-muted-foreground">
                                                  This will automatically invite all members with same e-mail
                                                  domain to this organization.
                                             </p>
                                        </label>
                                   </div>
                              </div >
                              <Button type="submit" variant="outline" className="w-full" >
                                   Save Organization
                              </Button>
                         </form>
                    </CardContent>
               </Card>
          </div>
     )
}