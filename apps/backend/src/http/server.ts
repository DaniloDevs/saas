import fastify from "fastify"
import fastifyCors from "@fastify/cors"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import SetupRoutes from "./routes/setup-routes"
import fastifySwagger from '@fastify/swagger'
import fastiftyJWT from '@fastify/jwt'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { errorHandler } from "./error-handler"
import { env } from "@saas/env"

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyCors)

app.register(fastifySwagger, {
     openapi: {
          info: {
               title: 'Next.Js Saas',
               description: 'Full-Stack SaaS app with multi-tenant & RBAC',
               version: '1.0.0',
          },
          components: {
               securitySchemes: {
                    bearerAuth: {
                         type: 'http',
                         scheme: 'bearer',
                         bearerFormat: 'JWT',
                    },
               },
          },
     },
     transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
     routePrefix: '/docs',
})

app.register(fastiftyJWT, {
     secret: env.JWT_SECRET
})

app.register(SetupRoutes)
