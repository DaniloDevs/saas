import { api } from "./api-client"

interface getOrganizationsResponse {
     organization: {
          name: string;
          id: string;
          slug: string;
          domain: string | null;
          shouldAttachUsersByDomain: boolean;
          avatarUrl: string | null;
          createdAt: Date;
          updatedAt: Date;
          ownerId: string;
     }
}

export async function GetOrganization(org: string) {

     const result = await api.get(`organizations/${org}`).json<getOrganizationsResponse>()

     return result
}