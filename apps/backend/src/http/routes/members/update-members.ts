import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';
import { roleSchema } from '@saas/auth';

export default async function UpdateMember(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .put(
               '/organization/:slug/members/:memberId',
               {
                    schema: {
                         tags: ["Members"],
                         summary: "Update a member",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string(),
                              memberId: z.string()
                         }),
                         body: z.object({
                              role: roleSchema
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

                    if (cannot('update', 'User')) {
                         throw new UnauthorizationError("You're not allowed to update this members");
                    }


                    const { role } = request.body

                    await prisma.member.update({
                         where: {
                              id: memberId,
                              organizationId: organazition.id
                         },
                         data: { role }
                    })



                    return reply.status(204).send()
               }
          )
}