import { api } from "./api-client"


interface signInWithGoogleRequest {
     code: string
}

interface signInWithGoogleResponse {
     token: string
}

export async function SignInWithGoogle({ code }: signInWithGoogleRequest) {

     const result = await api.post('sessions/google', {
          json: {
               code: String(code)
          }
     }).json<signInWithGoogleResponse>()

     return result
}