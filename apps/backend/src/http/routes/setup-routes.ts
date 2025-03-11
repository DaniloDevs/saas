import type { FastifyInstance } from "fastify";
import CreateAccount from "./auth/create-account";
import AuthenticateWithPassaword from "./auth/authenticate-with-password";
import GetProfile from "./auth/get-profile";
import RequestPasswordRecover from "./auth/request-password-recover";
import ResetPassword from "./auth/reset-password";
import AuthenticateWithGithub from "./auth/authenticate-with-github";
import AuthenticateWithGoogle from "./auth/authenticate-with-google";


export default async function SetupRoutes(server: FastifyInstance) {

     // AUTH
     server.register(CreateAccount)
     server.register(AuthenticateWithPassaword)
     server.register(GetProfile)
     server.register(RequestPasswordRecover)
     server.register(ResetPassword)
     server.register(AuthenticateWithGithub)
     server.register(AuthenticateWithGoogle)
}