import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { auth } from '@/http/middlewares/auth';

export default async function AcceptInvite(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .post(
               '/invites/:id/accept',
               {
                    schema: {
                         tags: ["Invites"],
                         summary: "Accept an invite",
                         params: z.object({
                              id: z.string()
                         }),
                         response: {
                              204: z.null()
                         }
                    }
               },
               async (request, reply) => {
                    const { id } = request.params
                    const userId = await request.getCurrentUserId()

                    const invite = await prisma.invite.findUnique({
                         where: { id },
                         include: {

                         }
                    })

                    if (!invite) {
                         throw new BadRequest("Invite not found or expired.")
                    }

                    const user = await prisma.user.findUnique({
                         where: { id: userId }
                    })

                    if (!user) {
                         throw new BadRequest("User not found.")
                    }

                    if (invite.email !== user.email) {
                         throw new BadRequest("This invite belongs to another user.")
                    }

                    await prisma.$transaction([
                         prisma.member.create({
                              data: {
                                   userId,
                                   organizationId: invite.organizationId,
                                   role: invite.role
                              }
                         }),

                         prisma.invite.delete({
                              where: { id }
                         })
                    ])

                    return reply.status(204).send()
               }
          )
}