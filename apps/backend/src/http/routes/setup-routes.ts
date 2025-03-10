import type { FastifyInstance } from "fastify";
import CreateAccount from "./auth/create-account";
import AuthtenticateWithPassaword from "./auth/authenticate-with-password";
import GetProfile from "./auth/get-profile";


export default async function SetupRoutes(server: FastifyInstance) {

     server.register(CreateAccount)
     server.register(AuthtenticateWithPassaword)
     server.register(GetProfile)
}