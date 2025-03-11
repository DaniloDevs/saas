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
                         // response: {
                         //      201: z.object({
                         //           token: z.string()
                         //      }),
                         // }
                    }
               },
               async (request, reply) => {
                    const { code } = request.body

                    const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                         method: "GET",
                         headers: {
                              "Authorization": `Bearer ${code}`,
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