'use server'

import { getCurrentOrganization } from "@/auth/auth"
import { removeMember } from "@/https/remove-member"
import { updateMember } from "@/https/update-member"
import { revalidateTag } from "next/cache"
import { Role, roleSchema } from '@saas/auth'
import { revokeInvite } from "@/https/invites/revoke-invite"
import { HTTPError } from "ky"
import { createInvite } from "@/https/invites/create-invite"
import { z } from "zod"

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
   console.log(currentOrg)

   await revokeInvite({
      org: currentOrg!,
      inviteId,
   })

   revalidateTag(`${currentOrg}/invites`)
}

const inviteSchema = z.object({
   email: z.string().email({ message: 'Invalid e-mail address.' }),
   role: roleSchema,
})

export async function createInviteAction(data: FormData) {
   const currentOrg = await getCurrentOrganization()
   const result = inviteSchema.safeParse(Object.fromEntries(data))

   if (!result.success) {
      const errors = result.error.flatten().fieldErrors

      return { success: false, message: null, errors }
   }

   const { email, role } = result.data

   try {
      await createInvite({
         org: currentOrg!,
         email,
         role,
      })

      revalidateTag(`${currentOrg}/invites`)
   } catch (err) {
      if (err instanceof HTTPError) {
         const { message } = await err.response.json()

         return { success: false, message, errors: null }
      }

      console.error(err)

      return {
         success: false,
         message: 'Unexpected error, try again in a few minutes.',
         errors: null,
      }
   }

   return {
      success: true,
      message: 'Successfully created the invite.',
      errors: null,
   }
}
