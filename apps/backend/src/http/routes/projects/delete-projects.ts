import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';
import { projectSchema } from '@saas/auth';

export default async function DeleteProjects(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .delete(
               '/organizations/:slug/projects/:projectId',
               {
                    schema: {
                         tags: ["Project"],
                         summary: "Delete a projects",
                         security: [{ bearerAuth: [] }],
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

                    if (cannot('delete', authProject)) {
                         throw new UnauthorizationError("You're not allowed to delete this project ");
                    }

                    await prisma.project.delete({
                         where: {
                              id: projectId,
                         }
                    })

                    return reply.status(204).send()
               }
          )
}