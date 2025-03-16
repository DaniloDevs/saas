import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { createSlug } from '@/utils/create-slug';
import { defineAbilityFor, organizationSchema, userSchema } from '@saas/auth';
import { UnauthorizationError } from '../_errors/unauthorized';
import { getUserPermission } from '@/utils/get-user-permissions';

export default async function UpdateOrganization(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .post(
               '/organizations/:slug',
               {
                    schema: {
                         tags: ["Organization"],
                         summary: "Update",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string()
                         }),
                         body: z.object({
                              name: z.string(),
                              domain: z.string().nullish(),
                              shouldAttachUsersByDomain: z.boolean().optional(),
                         }),
                         response: {
                              201: z.object({
                                   organizationId: z.string()
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const userId = await request.getCurrentUserId()

                    const { slug } = request.params
                    const { membership } = await request.getUserMembership(slug)

                    const { name, domain, shouldAttachUsersByDomain } = request.body

                    const org = await prisma.organization.findUnique({
                         where: { slug }
                    })

                    if (!org) {
                         throw new BadRequest("Organization not found");
                    }

                    const authOrg = organizationSchema.parse(org)

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('update', authOrg)) {
                         throw new UnauthorizationError("You're not allowed to update this organization")
                    }


                    if (domain) {
                         const organizationByDomain = await prisma.organization.findFirst({
                              where: {
                                   domain,
                                   id: {
                                        not: org.id
                                   }
                              }
                         })

                         if (organizationByDomain) {
                              throw new BadRequest("Another organization with same domain already exist.");
                         }
                    }


                    const organization = await prisma.organization.update({
                         where: {
                              id: org.id
                         },
                         data: {
                              name,
                              domain,
                              shouldAttachUsersByDomain,
                         }
                    })

                    return reply.status(201).send({
                         organizationId: organization.id
                    })
               }
          )
}