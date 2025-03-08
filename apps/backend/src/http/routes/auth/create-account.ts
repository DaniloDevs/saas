import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { hash } from 'bcryptjs';

export default async function CreateAccount(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .post(
               '/users',
               {
                    schema: {
                         body: z.object({
                              name: z.string(),
                              email: z.string().email(),
                              password: z.string().min(6),
                         })
                    }

               },
               async (request, reply) => {
                    const { email, name, password } = request.body

                    const userWithSameEmail = await prisma.user.findUnique({
                         where: { email }
                    })

                    if (userWithSameEmail) return reply.status(400).send({ message: "User with save e-mail already exist." })

                    const passwordHash = await hash(password, 6)

                    await prisma.user.create({
                         data: {
                              name,
                              email,
                              passwordHash
                         }
                    })
               }
          )
}