import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';
import { roleSchema } from '@saas/auth';

export default async function GetMembers(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organitions/:slug/members',
               {
                    schema: {
                         tags: ["Members"],
                         summary: "Get all organization members",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string(),
                         }),
                         response: {
                              200: z.object({
                                   members: z.array(
                                        z.object({
                                             userId: z.string(),
                                             id: z.string(),
                                             role: roleSchema,
                                             name: z.string().nullable(),
                                             email: z.string(),
                                             avatarUrl: z.string().nullable(),
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

                    if (cannot('get', 'User')) {
                         throw new UnauthorizationError("You're not allowed to see organization members");
                    }


                    const members = await prisma.member.findMany({
                         select: {
                              id: true,
                              role: true,
                              user: {
                                   select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatarUrl: true
                                   }
                              }
                         },
                         where: {
                              organizationId: organazition.id
                         },
                         orderBy: {
                              role: 'asc'
                         }
                    })

                    const membersWithRoles = members.map(({ user: { id: userId, ...user }, ...member }) => {
                         return {
                              ...user,
                              ...member,
                              userId
                         }
                    })

                    return reply.status(200).send({ members: membersWithRoles })
               }
          )
}