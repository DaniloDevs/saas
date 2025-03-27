import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from "zod"
import { BadRequest } from '../_errors/bad-request'
import { prisma } from '@/lib/prisma'
import { env } from '@saas/env'
import { Console } from 'console'

export default async function AuthenticateWithGithub(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .post(
               '/sessions/github',
               {
                    schema: {
                         tags: ["Auth"],
                         summary: "Authenticate with github provider",
                         body: z.object({
                              code: z.string()
                         }),
                         response: {
                              201: z.object({
                                   token: z.string()
                              }),
                         }
                    }
               },
               async (request, reply) => {
                    const { code } = request.body

                    const githubOAuth = new URL("https://github.com/login/oauth/access_token")

                    githubOAuth.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
                    githubOAuth.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_ID)
                    githubOAuth.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI)
                    githubOAuth.searchParams.set('code', code)

                    const githubAccessTokenResponse = await fetch(githubOAuth, {
                         method: 'POST',
                         headers: {
                              Accept: 'application/json'
                         }
                    })

                    const githubAccessTokenDate = await githubAccessTokenResponse.json()

                    const { access_token } = z.object({
                         access_token: z.string(),
                         token_type: z.literal('bearer'),
                         scope: z.string()
                    }).parse(githubAccessTokenDate)

                    const githubUserResponse = await fetch("https://api.github.com/user", {
                         headers: {
                              Authorization: `Bearer ${access_token}`
                         }
                    })

                    const githubUserData = githubUserResponse.json()
                    console.log(githubUserData)
                    const { id: githubId, name, email, avatar_url } = z.object({
                         id: z.number().int().transform(String),
                         avatar_url: z.string().url(),
                         name: z.string().nullable(),
                         email: z.string().nullable(),
                    }).parse(githubUserData)

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
                                   avatarUrl: avatar_url
                              }
                         })
                    }

                    let account = await prisma.account.findUnique({
                         where: {
                              provider_userId: {
                                   provider: 'GITHUB',
                                   userId: user.id
                              }
                         }
                    })

                    if (!account) {
                         account = await prisma.account.create({
                              data: {
                                   provider: 'GITHUB',
                                   providerAccountId: githubId,
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