import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UnauthorizationError } from '../_errors/unauthorized';
import { hash } from 'bcryptjs';

export default async function ResetPassword(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .post(
               '/password/reset',
               {
                    schema: {
                         tags: ["Auth"],
                         summary: "Password reset from user",
                         body: z.object({
                              code: z.string(),
                              password: z.string().min(6),
                         }),
                         response: {
                              201: z.null()
                         }
                    }
               },
               async (request, reply) => {
                    const { code, password } = request.body

                    const tokenFromCode = await prisma.token.findUnique({
                         where: { id: code }
                    })

                    if (!tokenFromCode) {
                         throw new UnauthorizationError()
                    }

                    const passwordHash = await hash(password, 6)

                    await prisma.user.update({
                         where: { id: tokenFromCode.id },
                         data: {
                              passwordHash
                         }
                    })

                    return reply.status(204).send()
               }
          )
}