import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { createSlug } from '@/utils/create-slug';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';

export default async function CreateProjects(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .post(
               '/organizations/:slug/projects',
               {
                    schema: {
                         tags: ["Project"],
                         summary: "Create a new projects",
                         security: [{ bearerAuth: [] }],
                         body: z.object({
                              name: z.string(),
                              description: z.string(),
                         }),
                         params: z.object({
                              slug: z.string()
                         }),
                         response: {
                              201: z.object({
                                   project: z.string()
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

                    if (cannot('create', 'Project')) {
                         throw new UnauthorizationError("You're not allowed to create new projects");

                    }

                    const { description, name } = request.body

                    const project = await prisma.project.create({
                         data: {
                              name,
                              slug: createSlug(name),
                              description,
                              organizationId: organazition.id,
                              ownerId: userId
                         }
                    })

                    return reply.status(201).send({
                         project: project.id
                    })
               }
          )
}