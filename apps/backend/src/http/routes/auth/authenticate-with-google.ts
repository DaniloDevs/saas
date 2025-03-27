import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from "zod"
import { BadRequest } from '../_errors/bad-request'
import { prisma } from '@/lib/prisma'

export default async function AuthenticateWithGoogle(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .post(
               '/sessions/google',
               {
                    schema: {
                         tags: ["Auth"],
                         summary: "Authenticate with google provider",
                         body: z.object({
                              code: z.string()
                         }),
                    }
               },
               async (request, reply) => {
                    const { code } = request.body


                    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify({
                              client_id: "827421874260-ic2u8pnhf8p4nphih8adquf1261f60c9.apps.googleusercontent.com",
                              client_secret: "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",
                              code,
                              grant_type: "authorization_code",
                              redirect_uri: 'http://localhost:3000/api/auth/callback/google',
                         }),
                    })

                    console.log(tokenResponse)
                    
                    if (!tokenResponse.ok) {
                         throw new BadRequest("Failed to exchange code for access token")
                    }
                    
                    const tokenData = await tokenResponse.json() 
                    console.log(tokenData)
                    const accessToken = tokenData.access_token

                    const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                         method: "GET",
                         headers: {
                              "Authorization": `Bearer ${accessToken}`,
                              "Content-Type": "application/json"
                         }
                    })

                    const googleUserData = await googleUserResponse.json()

                    const { id: googleId, name, email, picture } = z.object({
                         id: z.string(),
                         picture: z.string().url(),
                         name: z.string().nullable(),
                         email: z.string().nullable(),
                    }).parse(googleUserData)

                    if (email === null) {
                         throw new BadRequest("Your Github account must have an emailto authenticate")
                    }


                    let user = await prisma.user.findUnique({
                         where: { email }
                    })

                    if (!user) {
                         user = await prisma.user.create({
                              data: {
                                   name,
                                   email,
                                   avatarUrl: picture
                              }
                         })
                    }

                    let account = await prisma.account.findUnique({
                         where: {
                              provider_userId: {
                                   provider: 'GOOGLE',
                                   userId: user.id
                              }
                         }
                    })

                    if (!account) {
                         account = await prisma.account.create({
                              data: {
                                   provider: 'GOOGLE',
                                   providerAccountId: googleId,
                                   userId: user.id
                              }
                         })
                    }

                    const token = await reply.jwtSign(
                         { sub: user.id },
                         {
                              sign: {
                                   expiresIn: "7d"
                              }
                         }
                    )

                    return reply.status(201).send({ token })
               }
          )
}