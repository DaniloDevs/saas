import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';

export default async function GetOrganization(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organizations/:slug',
               {
                    schema: {
                         tags: ["Organization"],
                         summary: "Get details from organization",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string()
                         }),
                         response: {
                              200: z.object({
                                   organization: z.object({
                                        name: z.string(),
                                        id: z.string(),
                                        slug: z.string(),
                                        domain: z.string().nullable(),
                                        shouldAttachUsersByDomain: z.boolean(),
                                        avatarUrl: z.string().nullable(),
                                        createdAt: z.date(),
                                        updatedAt: z.date(),
                                        ownerId: z.string()
                                   })
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const { slug } = request.params
                    const { membership } = await request.getUserMembership(slug)

                    const organization = await prisma.organization.findUnique({ where: { id: membership.organizationId } })

                    if(!organization) {
                         throw new BadRequest("Organization not found")
                    }

                    return reply.status(200).send({
                         organization
                    })
               }
          )
}
