import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { roleSchema } from '@saas/auth';
import { auth } from '@/http/middlewares/auth';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';

export default async function GetInvites(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organization/:slug/invites',
               {
                    schema: {
                         tags: ["Invites"],
                         summary: "Get all organization invites",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string()
                         }),
                         response: {
                              200: z.object({
                                   invites: z.array(
                                        z.object({
                                             id: z.string(),
                                             role: roleSchema,
                                             createdAt: z.date(),
                                             email: z.string(),
                                             author: z.object({
                                                  id: z.string(),
                                                  name: z.string().nullable(),
                                             }).nullable()
                                        })
                                   )
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const { slug } = request.params
                    const userId = await request.getCurrentUserId()
                    const { membership } = await request.getUserMembership(slug)

                    const organazition = await prisma.organization.findUnique({ where: { id: membership.organizationId } })
                    if (!organazition) {
                         throw new BadRequest("Organization not found!");
                    }

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('get', 'Invite')) {
                         throw new UnauthorizationError("You're not allowed to get organization invites");
                    }

                    const invites = await prisma.invite.findMany({
                         where: {
                              organizationId: organazition.id
                         },
                         select: {
                              id: true,
                              email: true,
                              role: true,
                              createdAt: true,
                              author: {
                                   select: {
                                        id: true,
                                        name: true
                                   }
                              }
                         },
                         orderBy: { createdAt: 'desc' }
                    })


                    return reply.status(204).send({ invites })
               }
          )
}