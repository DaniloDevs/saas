import { api } from "./api-client"


interface createOrganizationRequest {
     name: string
     domain: string | null
     avatar_url: string
     shouldAttachUsersByDomain: boolean
}

type createOrganizationResponse = void

export async function CreateOrganization({ name, domain, avatar_url,shouldAttachUsersByDomain }: createOrganizationRequest): Promise<createOrganizationResponse> {

     await api.post('organizations', {
          json: {
               name,
               domain,
               avatar_url,
               shouldAttachUsersByDomain
          }
     })
}