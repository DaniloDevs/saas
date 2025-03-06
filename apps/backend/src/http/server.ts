import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import SetupRoutes from "./routes/setup-routes";


export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(SetupRoutes)
