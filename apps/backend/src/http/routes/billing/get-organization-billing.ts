import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';

export default async function GetOrganizationBilling(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organizations/:slug/billing',
               {
                    schema: {
                         tags: ["Billing"],
                         summary: "Get billing information from organization",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string()
                         }),
                         response: {
                              200: z.object({
                                   billing: z.object({
                                        seats: z.object({
                                             amount: z.number(),
                                             unit: z.number(),
                                             price: z.number(),
                                        }),
                                        projects: z.object({
                                             amount: z.number(),
                                             unit: z.number(),
                                             price: z.number(),
                                        }),
                                        total: z.number(),
                                   })
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const { slug } = request.params
                    const { membership } = await request.getUserMembership(slug)
                    const userId = await request.getCurrentUserId()
                    const organization = await prisma.organization.findUnique({ where: { id: membership.organizationId } })

                    if (!organization) { throw new BadRequest("Organization not found") }

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('get', 'Billing')) {
                         throw new UnauthorizationError("You're not allowed to get billing details from this organzation.")
                    }

                    const [amountOfMember, amountOfProjects] = await prisma.$transaction([
                         prisma.member.count({
                              where: {
                                   organizationId: organization.id,
                                   role: { not: 'BILLING' }
                              }
                         }),

                         prisma.project.count({
                              where: {
                                   organizationId: organization.id,
                              }
                         })
                    ])

                    return reply.status(200).send({
                         billing: {
                              seats: {
                                   amount: amountOfMember,
                                   unit: 10,
                                   price: amountOfMember * 10
                              },
                              projects: {
                                   amount: amountOfProjects,
                                   unit: 20,
                                   price: amountOfProjects * 20
                              },
                              total: amountOfMember * 10 + amountOfProjects * 20
                         }
                    })
               }
          )
}
