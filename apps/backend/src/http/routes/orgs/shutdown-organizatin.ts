import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { organizationSchema } from '@saas/auth';
import { UnauthorizationError } from '../_errors/unauthorized';
import { getUserPermission } from '@/utils/get-user-permissions';

export default async function ShutdownOrganzation(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .delete(
               '/organizations/:slug',
               {
                    schema: {
                         tags: ["Organization"],
                         summary: "Shutdown Organization",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string()
                         }),
                         response: {
                              201: z.null()
                         }
                    }
               },
               async (request, reply) => {
                    const userId = await request.getCurrentUserId()

                    const { slug } = request.params
                    const { membership } = await request.getUserMembership(slug)

                    const org = await prisma.organization.findUnique({ where: { slug } })
                    if (!org) { throw new BadRequest("Organization not found") }

                    const authOrg = organizationSchema.parse(org)

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('delete', authOrg)) {
                         throw new UnauthorizationError("You're not shutdown to update this organization")
                    }


                    const organization = await prisma.organization.delete({
                         where: {
                              id: org.id
                         },
                    })

                    return reply.status(201).send()
               }
          )
}