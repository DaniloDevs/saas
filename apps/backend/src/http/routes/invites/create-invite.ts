import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { BadRequest } from '../_errors/bad-request';
import { getUserPermission } from '@/utils/get-user-permissions';
import { UnauthorizationError } from '../_errors/unauthorized';
import { roleSchema } from '@saas/auth';

export default async function CreateInvite(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .post(
               '/organization/:slug/invites',
               {
                    schema: {
                         tags: ["Invites"],
                         summary: "Create a new invite",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string(),
                         }),
                         body: z.object({
                              email: z.string().email(),
                              role: roleSchema
                         }),
                         response: {
                              201: z.object({
                                   inviteId: z.string()
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

                    if (cannot('create', 'Invite')) {
                         throw new UnauthorizationError("You're not allowed to create a new invite");
                    }


                    const { email, role } = request.body

                    const [, domain] = email.split('@')

                    if (organazition.shouldAttachUsersByDomain && organazition.domain === domain) {
                         throw new BadRequest(`Users with "${domain}" domain will join your organization automatically on login `)
                    }

                    const inviteWithSameEmail = await prisma.invite.findUnique({
                         where: {
                              email_organizationId: {
                                   email,
                                   organizationId: organazition.id
                              }
                         }
                    })

                    if (inviteWithSameEmail) {
                         throw new BadRequest(`Another invite with same e-mail already exist`)
                    }

                    const memberWithSameEmail = await prisma.member.findFirst({
                         where: {
                              organizationId: organazition.id,
                              user: { email }
                         }
                    })

                    if (memberWithSameEmail) {
                         throw new BadRequest(`A member with this e-mail already belongs to your organization`)
                    }


                    const invite = await prisma.invite.create({
                         data: {
                              email,
                              role,
                              organizationId: organazition.id,
                              authorId: userId 
                         }
                    })

                    return reply.status(204).send({
                         inviteId: invite.id
                    })
               }
          )
}