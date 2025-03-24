import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { auth } from '@/http/middlewares/auth';
import { roleSchema } from '@saas/auth';

export default async function GetPedingInvites(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .post(
               '/peding-invites',
               {
                    schema: {
                         tags: ["Invites"],
                         summary: "Get all user peding invites.",
                         response: {
                              204: z.object({
                                   invites: z.array(
                                        z.object({
                                             id: z.string(),
                                             email: z.string(),
                                             role: roleSchema,
                                             createdAt: z.date(),
                                             author: z.object({
                                                  id: z.string(),
                                                  name: z.string().nullable(),
                                                  avatarUrl: z.string().nullable(),
                                             }).nullable()
                                        })
                                   )
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const userId = await request.getCurrentUserId()

                    const user = await prisma.user.findUnique({
                         where: { id: userId },
                    })

                    if (!user) {
                         throw new BadRequest("User not found.")
                    }


                    const invites = await prisma.invite.findMany({
                         where: { email: user.email },
                         select: {
                              id: true,
                              email: true,
                              role: true,
                              createdAt: true,
                              author: {
                                   select: {
                                        id: true,
                                        name: true,
                                        avatarUrl: true
                                   }
                              }
                         }
                    })

                    return reply.status(200).send({
                         invites
                    })
               }
          )
}