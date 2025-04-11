import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';

export default async function GetProject(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organizations/:orgSlug/projects/:projectSlug',
               {
                    schema: {
                         tags: ["Project"],
                         summary: "Get a projects",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              orgSlug: z.string(),
                              projectSlug: z.string()
                         }),
                         response: {
                              200: z.object({
                                   project: z.object({
                                        id: z.string(),
                                        name: z.string(),
                                        organizationId: z.string(),
                                        description: z.string(),
                                        slug: z.string(),
                                        avatarUrl: z.string().nullable(),
                                        ownerId: z.string(),
                                        owner: z.object({
                                             id: z.string(),
                                             name: z.string().nullable(),
                                             avatarUrl: z.string().nullable()
                                        })
                                   })
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const { orgSlug, projectSlug } = request.params
                    const userId = await request.getCurrentUserId()
                    const { membership } = await request.getUserMembership(orgSlug)

                    const organazition = await prisma.organization.findUnique({ where: { id: membership.organizationId } })
                    if (!organazition) {
                         throw new BadRequest("Organization not found!");
                    }

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('get', 'Project')) {
                         throw new UnauthorizationError("You're not allowed to see this project");
                    }

                    const project = await prisma.project.findUnique({
                         where: {
                              slug: projectSlug,
                              organizationId: organazition.id
                         },
                         select: {
                              id: true,
                              name: true,
                              description: true,
                              slug: true,
                              ownerId: true,
                              avatarUrl: true,
                              organizationId: true,
                              owner: {
                                   select: {
                                        id: true,
                                        name: true,
                                        avatarUrl: true
                                   }
                              }
                         }
                    })

                    if (!project) {
                         throw new BadRequest("Project not found!");
                    }

                    return reply.status(200).send({ project })
               }
          )
}