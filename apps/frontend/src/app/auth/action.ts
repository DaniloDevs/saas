import { redirect } from "next/navigation"


export function signInWithGithub() {
     const gitHubSignInURL = new URL('login/oauth/authorize', "https://github.com")

     gitHubSignInURL.searchParams.set('client_id', 'Iv23ctCcWd46lNd8Oel1')
     gitHubSignInURL.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback/github')
     gitHubSignInURL.searchParams.set('escope', 'user')

     redirect(gitHubSignInURL.toString())
}

export function signInWithGoogle() {
     const googleSignInURL = new URL('https://accounts.google.com/o/oauth2/v2/auth')

     googleSignInURL.searchParams.set('scope', 'https://www.googleapis.com/auth/userinfo.email')
     googleSignInURL.searchParams.set('response_type', 'code')
     googleSignInURL.searchParams.set('state', 'state_parameter_passthrough_value')
     googleSignInURL.searchParams.set('redirect_uri', 'http://localhost:3000/api/auth/callback/google')
     googleSignInURL.searchParams.set('client_id', '827421874260-ic2u8pnhf8p4nphih8adquf1261f60c9.apps.googleusercontent.com')

     redirect(googleSignInURL.toString())
}
