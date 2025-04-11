import { Role } from "@saas/auth"
import { api } from "./api-client"

interface getMembershipResponse {
     membership: {
          id: string;
          role: Role
          userId: string
          organizationId: string;
     }
}

export async function GetMembership(org: string) {

     const result = await api.get(`organizations/${org}/membership`).json<getMembershipResponse>()

     return result
}