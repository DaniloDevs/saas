'use server'

import { acceptInvite } from '@/https/invites/accept-invites'
import { rejectInvite } from '@/https/invites/reject-invite'
import { revalidateTag } from 'next/cache'


export async function acceptInviteAction(inviteId: string) {
  await acceptInvite(inviteId)

  revalidateTag('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}