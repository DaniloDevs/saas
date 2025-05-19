'use server'

import { getCurrentOrganization } from "@/auth/auth"
import { removeMember } from "@/https/remove-member"
import { updateMember } from "@/https/update-member"
import { revalidateTag } from "next/cache"
import { Role } from '@saas/auth'
import { revokeInvite } from "@/https/invites/revoke-invite"

export async function removeMemberAction(memberId: string) {
   const currentOrg = await getCurrentOrganization()

   await removeMember({
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      org: currentOrg!,
      memberId
   })

   revalidateTag(`${currentOrg}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
   const currentOrg = await getCurrentOrganization()

   await updateMember({
      org: currentOrg!,
      memberId,
      role,
   })

   revalidateTag(`${currentOrg}/members`)
}


export async function revokeInviteAction(inviteId: string) {
   const currentOrg = await getCurrentOrganization()
 
   await revokeInvite({
     org: currentOrg!,
     inviteId,
   })
 
   revalidateTag(`${currentOrg}/invites`)
 }