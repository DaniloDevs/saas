import type { Role } from "@saas/auth"
import { api } from "../api-client"

interface getInvitesResponse {
    invites: {
        id: string
        role: Role
        createdAt: string | Date
        email: string
        author: {
            name: string | null
            id: string
        } | null
    }[]
}

export async function GetInvites(slug: string) {
    const result = await api.get(`organitions/${slug}/invites`).json<getInvitesResponse>()


    return result
}