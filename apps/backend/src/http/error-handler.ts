import type { FastifyInstance } from "fastify"
import { ZodError } from "zod"
import { BadRequest } from "./routes/_errors/bad-request"
import { UnauthorizationError } from "./routes/_errors/unauthorized"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
     if (error instanceof ZodError) {
          return reply.status(400).send({
               message: "Validate error",
               erros: error.flatten().fieldErrors
          })
     }

     if (error instanceof BadRequest) {
          return reply.status(400).send({
               message: error.message,
          })
     }

     if (error instanceof UnauthorizationError) {
          return reply.status(401).send({
               message: error.message,
          })
     }

     console.log(error)

     return reply.status(500).send({
          message: "Internal Server Error",
     })
}