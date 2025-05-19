import { ability } from "@/auth/auth";
import { Invites } from "../../../../../components/members/invites";
import { MembersList } from "../../../../../components/members/members-list";

export default async function Members() {
     const permissions = await ability()

     return (
          <div className="space-y-4">
               <h1 className="text-2xl font-bold">Members</h1>

               <div className="space-y-4">
                    {permissions?.can('get', 'Invite') && <Invites />}
                    {permissions?.can('get', 'User') && <MembersList />}
               </div>
          </div>
     );
}