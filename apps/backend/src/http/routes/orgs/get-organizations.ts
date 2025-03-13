import { auth } from '@/http/middlewares/auth';
import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { roleSchema } from '@saas/auth';

export default async function GetOrganizations(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organizations',
               {
                    schema: {
                         tags: ["Organization"],
                         summary: "Get organization where user is a member",
                         security: [{ bearerAuth: [] }],
                         response: {
                              200: z.object({
                                   organizations: z.array(
                                        z.object({
                                             id: z.string(),
                                             name: z.string(),
                                             slug: z.string(),
                                             avatarUrl: z.string().url().nullable(),
                                             role: roleSchema
                                        })
                                   )
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const userId = await request.getCurrentUserId()

                    const organization = await prisma.organization.findMany({
                         where: {
                              members: { some: { userId } }
                         },
                         select: {
                              id: true,
                              name: true,
                              slug: true,
                              avatarUrl: true,
                              members: {
                                   select: { role: true },
                                   where: { userId }
                              }
                         }
                    })

                    const organizationWithUserRole = organization.map(({ members, ...org }) => {
                         return {
                              ...org,
                              role: members[0].role
                         }
                    })

                    return reply.status(200).send({
                         organizations: organizationWithUserRole
                    })
               }
          )
}
