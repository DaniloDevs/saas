import type { FastifyInstance } from "fastify";
import { UnauthorizationError } from "../routes/_errors/unauthorized";
import fastifyPlugin from "fastify-plugin";
import { prisma } from "@/lib/prisma";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
     app.addHook("preHandler", async (request, reply) => {
          request.getCurrentUserId = async () => {
               try {
                    const { sub } = await request.jwtVerify<{ sub: string }>()

                    return sub
               } catch {
                    throw new UnauthorizationError("Invalid Auth Token");
               }
          }

          request.getUserMembership = async (slug: string) => {
               const userId = await request.getCurrentUserId()

               const member = await prisma.member.findFirst({
                    where: {
                         userId,
                         organization: { slug }
                    },
                    include: { organization: false }
               })

               if (!member) {
                    throw new UnauthorizationError("You're not a member of this organization");
               }

               const { ...membership } = member

               return {
                    membership
               }
          }
     })
})