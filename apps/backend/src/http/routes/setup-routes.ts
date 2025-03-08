import type { FastifyInstance } from "fastify";
import CreateAccount from "./auth/create-account";


export default async function SetupRoutes(server: FastifyInstance) {

     server.register(CreateAccount)
}