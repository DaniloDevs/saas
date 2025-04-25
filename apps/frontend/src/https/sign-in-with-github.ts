import { api } from "./api-client"


interface signInWithGitHubRequest {
     code: string
}

interface signInWithGitHubResponse {
     token: string
}

export async function SignInWithGitHub({ code }: signInWithGitHubRequest) {
     const result = await api.post('sessions/github', {
          json: {
               code
          }
     }).json<signInWithGitHubResponse>()

     return result
}