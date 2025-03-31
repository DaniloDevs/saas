import { api } from "./api-client"

interface getProfileResponse {
     user: {
          name: string | null
          id: string
          email: string
          avatarUrl: string | null
     }
}

export async function GetProfile() {

     const result = await api.get('profile').json<getProfileResponse>()

     return result
}