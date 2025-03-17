import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { organizationSchema } from '@saas/auth';
import { UnauthorizationError } from '../_errors/unauthorized';
import { getUserPermission } from '@/utils/get-user-permissions';

export default async function TransferOrganization(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .patch(
               '/organizations/:slug/owner',
               {
                    schema: {
                         tags: ["Organization"],
                         summary: "Transfer organization ownership",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string()
                         }),
                         body: z.object({
                              transferToUserId: z.string(),
                         }),
                         response: {
                              204: z.object({
                                   organizationId: z.string()
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const userId = await request.getCurrentUserId()

                    const { slug } = request.params
                    const { membership } = await request.getUserMembership(slug)


                    const organization = await prisma.organization.findUnique({
                         where: { slug }
                    })

                    if (!organization) {
                         throw new BadRequest("Organization not found");
                    }

                    const authOrg = organizationSchema.parse(organization)

                    const { cannot } = getUserPermission(userId, membership.role)

                    if (cannot('update', authOrg)) {
                         throw new UnauthorizationError("You're not allowed to tranfer this organization ownership")
                    }

                    const { transferToUserId } = request.body

                    const transferToMembership = await prisma.member.findUnique({
                         where: {
                              organizationId_userId: {
                                   organizationId: organization.id,
                                   userId: transferToUserId
                              }
                         }
                    })

                    if (!transferToMembership) {
                         throw new BadRequest('Target user is not a member of this organization');

                    }
                    
                    await prisma.$transaction([
                         prisma.member.update({
                              where: {
                                   organizationId_userId: {
                                        organizationId: organization.id,
                                        userId: transferToUserId
                                   }
                              },
                              data: {
                                   role: 'ADMIN'
                              }
                         }),
                         prisma.organization.update({
                              where: {id: organization.id},
                              data:{
                                   ownerId: transferToUserId
                              }
                         })
                    ])

                    return reply.status(204).send({
                         organizationId: organization.id
                    })
               }
          )
}