import { ability, getCurrentOrganization } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { GetInvites } from "@/https/invites/get-invites";
import { RevokeInviteButton } from "./revoke-invite-button";
import { CreateInviteForm } from "@/app/(app)/org/[slug]/members/create-invite-form";

export async function Invites() {
     const permissions = await ability()
     const currentOrg = await getCurrentOrganization()
     const { invites } = await GetInvites(currentOrg!)
     return (
          <Card>
               <CardHeader>
                    <CardTitle>Invites</CardTitle>
                    <CardDescription className="flex flex-col gap-4">
                         List all invites memeber of this organization
                         <CreateInviteForm />
                    </CardDescription>
               </CardHeader>
               <CardContent>
                    <Table>
                         <TableBody>
                              {invites.map((invite) => {
                                   return (
                                        <TableRow key={invite.id}>
                                             <TableCell className="py-2.5">
                                                  <span className="text-muted-foreground">
                                                       {invite.email}
                                                  </span>
                                             </TableCell>
                                             <TableCell className="py-2.5 font-medium">
                                                  {invite.role}
                                             </TableCell>
                                             <TableCell className="py-2.5">
                                                  <div className="flex justify-end">
                                                       {permissions?.can('delete', 'Invite') && (
                                                            <RevokeInviteButton inviteId={invite.id} />
                                                       )}
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   )
                              })}

                              {invites.length === 0 && (
                                   <TableRow>
                                        <TableCell className="text-center text-muted-foreground">
                                             No invites found
                                        </TableCell>
                                   </TableRow>
                              )}
                         </TableBody>
                    </Table>
               </CardContent>
          </Card>
     );
}