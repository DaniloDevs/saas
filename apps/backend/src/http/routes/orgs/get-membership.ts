import { auth } from '@/http/middlewares/auth';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { roleSchema } from '@saas/auth/src';

export default async function GetUserMembership(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/organizations/:slug/membership',
               {
                    schema: {
                         tags: ["Organization"],
                         summary: "Get user membership on organization",
                         security: [{ bearerAuth: [] }],
                         params: z.object({
                              slug: z.string(),
                         }),
                         response: {
                              201: z.object({
                                   membership: z.object({
                                        id: z.string(),
                                        userId: z.string(),
                                        role: roleSchema,
                                        organizationId: z.string()
                                   })
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const { slug } = request.params
                    const { membership } = await request.getUserMembership(slug)

                    return reply.status(200).send({
                         membership: {
                              id: membership.id,
                              role: roleSchema.parse(membership.role),
                              userId: membership.userId,
                              organizationId: membership.organizationId
                         }
                    })
               }
          )
}