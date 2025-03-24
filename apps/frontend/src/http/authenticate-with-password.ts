import { api } from "./api-client"


interface signInWithPassWordRequest {
     email: string
     password: string
}

interface signInWithPassWordResponse {
     token: string
}

export async function SignInWithPassWord({ email, password }: signInWithPassWordRequest) {

     const result = await api.post('sessions/password', {
          json: {
               email,
               password
          }
     }).json<signInWithPassWordResponse>()

     return result
}