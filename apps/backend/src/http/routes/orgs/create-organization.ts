import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { createSlug } from '@/utils/create-slug';

export default async function CreateOrganization(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .post(
               '/organizations',
               {
                    schema: {
                         tags: ["Organization"],
                         summary: "Create a new organization",
                         security: [{ bearerAuth: [] }],
                         body: z.object({
                              name: z.string(),
                              domain: z.string().nullish(),
                              shouldAttachUsersByDomain: z.boolean().optional(),
                              avatar_url: z.string(),
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
                    const { name, domain, shouldAttachUsersByDomain, avatar_url } = request.body

                    if (domain) {
                         const organizationByDomain = await prisma.organization.findUnique({
                              where: { domain }
                         })


                         if (organizationByDomain) {
                              throw new BadRequest("Another organization with same domain already exist.");
                         }
                    }


                    const organization = await prisma.organization.create({
                         data: {
                              name,
                              slug: createSlug(name),
                              shouldAttachUsersByDomain,
                              ownerId: userId,
                              avatarUrl: avatar_url,
                              members: {
                                   create: {
                                        userId,
                                        role: 'ADMIN'
                                   }
                              }
                         }
                    })

                    return reply.status(201).send({
                         organizationId: organization.id
                    })
               }
          )
}