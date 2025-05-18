import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';

export default async function RemoveMember(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .delete(
               '/organitions/:slug/members/:memberId',
               {
                    schema: {
                         tags: ["Members"],
                         summary: "Remove a member from organization",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string(),
                              memberId: z.string()
                         }),
                         response: {
                              204: z.null()
                         }
                    }
               },
               async (request, reply) => {
                    const { slug, memberId } = request.params
                    const userId = await request.getCurrentUserId()
                    const { membership } = await request.getUserMembership(slug)

                    const organazition = await prisma.organization.findUnique({ where: { id: membership.organizationId } })
                    if (!organazition) {
                         throw new BadRequest("Organization not found!");
                    }

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('delete', 'User')) {
                         throw new UnauthorizationError("You're not allowed to remove this members from the organization");
                    }

                    await prisma.member.delete({
                         where: {
                              id: memberId,
                              organizationId: organazition.id
                         },
                    })

                    return reply.status(204).send()
               }
          )
}