import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { hash } from 'bcryptjs';
import { BadRequest } from '../_errors/bad-request';

export default async function CreateAccount(app: FastifyInstance) {
     app
          .withTypeProvider<ZodTypeProvider>()
          .post(
               '/users',
               {
                    schema: {
                         tags: ["Auth"],
                         summary: "Create a new account",
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

                    if (userWithSameEmail) {
                         throw new BadRequest("User with save e-mail already exist.")
                    }


                    const [_, domain] = email.split('@')
                    const autoJoinOrganization = await prisma.organization.findFirst({
                         where: {
                              domain,
                              shouldAttachUsersByDomain: true
                         }
                    })

                    const passwordHash = await hash(password, 6)

                    await prisma.user.create({
                         data: {
                              name,
                              email,
                              passwordHash,
                              members_on: autoJoinOrganization ? {
                                   create: {
                                        organizationId: autoJoinOrganization.id
                                   }
                              } : undefined
                         }
                    })
               }
          )
}