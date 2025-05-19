import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';
import { roleSchema } from '@saas/auth';

export default async function RevokeInvite(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .delete(
               '/organizations/:slug/invites/:inviteId',
               {
                    schema: {
                         tags: ["Invites"],
                         summary: "Revoke an invite",
                         security: [{ bearerAuth: [] }],  
                         params: z.object({
                              slug: z.string(),
                              inviteId: z.string(),
                         }),
                         response: {
                              204: z.null()
                         }
                    }
               },
               async (request, reply) => {
                    const { slug, inviteId } = request.params
                    const userId = await request.getCurrentUserId()
                    const { membership } = await request.getUserMembership(slug)

                    const organazition = await prisma.organization.findUnique({ where: { id: membership.organizationId } })
                    if (!organazition) {
                         throw new BadRequest("Organization not found!");
                    }

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('delete', 'Invite')) {
                         throw new UnauthorizationError("You're not allowed to delete an invite");
                    }

                    const invite = await prisma.invite.findUnique({
                         where: {
                              id: inviteId,
                              organizationId: organazition.id
                         }
                    })

                    if (!invite) {
                         throw new BadRequest("Invite not found!")
                    }

                    await prisma.invite.delete({
                         where: { id: inviteId }
                    })

                    return reply.status(200).send()
               }
          )
}