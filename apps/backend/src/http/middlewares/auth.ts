import type { FastifyInstance } from "fastify";
import { UnauthorizationError } from "../routes/_errors/unauthorized";
import fastifyPlugin from "fastify-plugin";

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
     })
})