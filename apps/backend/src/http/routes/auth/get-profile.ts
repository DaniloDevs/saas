import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { BadRequest } from '../_errors/bad-request';
import { auth } from '@/http/middlewares/auth';

export default async function GetProfile(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .register(auth)
          .get(
               '/profile',
               {
                    schema: {
                         tags: ["Auth"],
                         summary: "Get authenticate user profile",
                         response: {
                              200: z.object({
                                   user: z.object({
                                        id: z.string().uuid(),
                                        name: z.string().nullable(),
                                        email: z.string().email(),
                                        avatarUrl: z.string().nullable()
                                   })
                              })
                         }
                    }
               },
               async (request, reply) => {
                    const UserId = await request.getCurrentUserId()

                    const user = await prisma.user.findUnique({
                         where: { id: UserId },
                         select: {
                              id: true,
                              name: true,
                              email: true,
                              avatarUrl: true
                         }
                    })

                    if (!user) {
                         throw new BadRequest("User not found");
                    }

                    return reply.status(200).send({ user })
               }
          )
}