import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';
import { projectSchema } from '@saas/auth';

export default async function UpdateProjects(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .put(
               '/organizations/:slug/projects/:projectId',
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
                              slug: z.string(),
                              projectId: z.string()
                         }),
                         response: {
                              204: z.null()
                         }
                    }
               },
               async (request, reply) => {
                    const { slug, projectId } = request.params
                    const userId = await request.getCurrentUserId()
                    const { membership } = await request.getUserMembership(slug)

                    const organazition = await prisma.organization.findUnique({ where: { id: membership.organizationId } })
                    if (!organazition) {
                         throw new BadRequest("Organization not found!");
                    }

                    const project = await prisma.project.findUnique({
                         where: {
                              id: projectId,
                              organizationId: organazition.id
                         }
                    })
                    if (!project) {
                         throw new BadRequest("Project not found!");
                    }

                    const { cannot } = getUserPermission(userId, membership.role)
                    const authProject = projectSchema.parse(project)

                    if (cannot('update', authProject)) {
                         throw new UnauthorizationError("You're not allowed to update this project ");
                    }

                    const { name, description } = request.body

                    await prisma.project.update({
                         where: {
                              id: projectId,
                         },
                         data: {
                              name,
                              description
                         }
                    })

                    return reply.status(204).send()
               }
          )
}