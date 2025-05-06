import { api } from "./api-client"


interface createOrganizationRequest {
     name: string
     domain: string | null
     avatarUrl: string
     shouldAttachUsersByDomain: boolean
}

type createOrganizationResponse = void

export async function CreateOrganization({ name, domain, avatarUrl,shouldAttachUsersByDomain }: createOrganizationRequest): Promise<createOrganizationResponse> {

     await api.post('organizations', {
          json: {
               name,
               domain,
               avatarUrl,
               shouldAttachUsersByDomain
          }
     })
}