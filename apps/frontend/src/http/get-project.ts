import { api } from "./api-client"

interface getProjectsResponse {
    projects: {
        name: string
        id: string
        organizationId: string
        description: string
        slug: string
        avatarUrl: string | null
        ownerId: string
        createdAt: string
        owner: {
            name: string | null
            id: string
            avatarUrl: string | null
        }
    }[]
}

export async function GetProjects(slug: string) {

    const result = await api.get(`organizations/${slug}/projects`).json<getProjectsResponse>()

    return result
}