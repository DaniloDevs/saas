import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';

export default async function GetProjects(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organizations/:slug/projects',
               {
                    schema: {
                         tags: ["Project"],
                         summary: "Get all organization projects",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string(),
                         }),
                         response: {
                              200: z.object({
                                   projects: z.array(
                                        z.object({
                                             id: z.string(),
                                             name: z.string(),
                                             organizationId: z.string(),
                                             description: z.string(),
                                             slug: z.string(),
                                             avatarUrl: z.string().nullable(),
                                             ownerId: z.string(),
                                             createdAt: z.date(),
                                             owner: z.object({
                                                  id: z.string(),
                                                  name: z.string().nullable(),
                                                  avatarUrl: z.string().nullable()
                                             })
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

                    const organization = await prisma.organization.findUnique({ where: { id: membership.organizationId } })
                    if (!organization) {
                         throw new BadRequest("Organization not found!");
                    }

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('get', 'Project')) {
                         throw new UnauthorizationError("You're not allowed to see organization projects");
                    }


                    const projects = await prisma.project.findMany({
                         select: {
                              id: true,
                              name: true,
                              description: true,
                              slug: true,
                              ownerId: true,
                              avatarUrl: true,
                              organizationId: true,
                              createdAt: true,
                              owner: {
                                   select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatarUrl: true,
                                   },
                              },
                         },
                         where: {
                              organizationId: organization.id,
                         },
                         orderBy: {
                              createdAt: 'desc',
                         },
                    })

                    console.log(projects)

                    return reply.status(200).send({ projects })
               }
          )
}