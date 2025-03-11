import type { FastifyInstance } from "fastify";
import CreateAccount from "./auth/create-account";
import AuthtenticateWithPassaword from "./auth/authenticate-with-password";
import GetProfile from "./auth/get-profile";
import RequestPasswordRecover from "./auth/request-password-recover";
import ResetPassword from "./auth/reset-password";


export default async function SetupRoutes(server: FastifyInstance) {

     server.register(CreateAccount)
     server.register(AuthtenticateWithPassaword)
     server.register(GetProfile)
     server.register(RequestPasswordRecover)
     server.register(ResetPassword)
}