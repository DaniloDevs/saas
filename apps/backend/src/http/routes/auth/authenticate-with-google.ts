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


                    const googleAccessTokenDate = await fetch("https://oauth2.googleapis.com/token", {
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


                    if (!googleAccessTokenDate.ok) {
                         throw new BadRequest("Failed to exchange code for access token")
                    }

                    const googleUserTokenResponse = await googleAccessTokenDate.json() as { access_token: string }

                    const access_token = googleUserTokenResponse.access_token

                    const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                         method: "GET",
                         headers: {
                              "Authorization": `Bearer ${access_token}`,
                              "Content-Type": "application/json"
                         }
                    })

                    const googleUserData = await googleUserResponse.json()



                    const { email, picture: avatarUrl, id: googleId, given_name: name } = z.object({
                         id: z.string(),
                         email: z.string().nullable(),
                         given_name: z.string().nullable(),
                         picture: z.string().url(),
                    }).parse(googleUserData)

                    if (email === null) {
                         throw new BadRequest("Your  google account must have an emailto authenticate")
                    }

                    let user = await prisma.user.findUnique({
                         where: { email }
                    })

                    if (!user) {
                         user = await prisma.user.create({
                              data: {
                                   name,
                                   email,
                                   avatarUrl
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

                    console.log(token)
                    return reply.status(201).send({ token })
               }
          )
}