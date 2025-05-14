'use server'

import { getCurrentOrganization } from "@/auth/auth"
import { removeMember } from "@/https/remove-member"
import { revalidateTag } from "next/cache"

export async function removeMemberAction(memberId: string) {
   const currentOrg = await getCurrentOrganization()

   await removeMember({
      org: currentOrg!,
      memberId
   })

revalidateTag(`${currentOrg}/members`)
}