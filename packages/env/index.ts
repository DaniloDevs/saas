import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
     server: {
          SERVER_PORT: z.coerce.number().default(9000),
          DATABASE_URL: z.string(),
          JWT_SECRET: z.string(),

          GITHUB_OAUTH_CLIENT_ID: z.string(),
          GITHUB_OAUTH_CLIENT_SECRET: z.string(),
          GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string(),
          GOOGLE_OAUTH_CLIENT_REDIRECT_URI: z.string()
     },
     client: {},
     shared: {
          NEXT_PUBLIC_API_URL: z.string()
     },
     runtimeEnv: {
          DATABASE_URL: process.env.DATABASE_URL,
          SERVER_PORT: process.env.SERVER_PORT,

          JWT_SECRET: process.env.JWT_SECRET,

          GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
          GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
          GITHUB_OAUTH_CLIENT_REDIRECT_URI: process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
          GOOGLE_OAUTH_CLIENT_REDIRECT_URI: process.env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
     },

     emptyStringAsUndefined: true
})