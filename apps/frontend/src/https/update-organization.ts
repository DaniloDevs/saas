import { api } from "./api-client"


interface updateOrganizationRequest {
     org: string
     name: string
     domain: string | null
     avatarUrl: string
     shouldAttachUsersByDomain: boolean
}

type updateOrganizationResponse = void

export async function UpdateOrganization({ org, name, domain, avatarUrl, shouldAttachUsersByDomain }: updateOrganizationRequest): Promise<updateOrganizationResponse> {

     await api.put(`organizations/${org}`, {
          json: {
               org,
               name,
               domain,
               avatarUrl,
               shouldAttachUsersByDomain
          }
     })
}