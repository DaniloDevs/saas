import { api } from './api-client'

interface removeMemberRequest {
   org: string
   memberId: string
}

export async function removeMember({
   org,
   memberId
}: removeMemberRequest) {
   await api.delete(`organization/${org}/members/${memberId}`)
}