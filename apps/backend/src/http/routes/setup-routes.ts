import type { FastifyInstance } from "fastify";
import CreateAccount from "./auth/create-account";
import AuthenticateWithPassaword from "./auth/authenticate-with-password";
import GetProfile from "./auth/get-profile";
import RequestPasswordRecover from "./auth/request-password-recover";
import ResetPassword from "./auth/reset-password";
import AuthenticateWithGithub from "./auth/authenticate-with-github";
import AuthenticateWithGoogle from "./auth/authenticate-with-google";
import CreateOrganization from "./orgs/create-organization";
import GetUserMembership from "./orgs/get-membership";
import GetOrganization from "./orgs/get-organization";
import GetOrganizations from "./orgs/get-organizations";
import ShutdownOrganzation from "./orgs/shutdown-organizatin";
import TransferOrganization from "./orgs/transfer-organization";
import CreateProjects from "./projects/create-projects";
import DeleteProjects from "./projects/delete-projects";


export default async function SetupRoutes(server: FastifyInstance) {

     // AUTH
     server.register(CreateAccount)
     server.register(AuthenticateWithPassaword)
     server.register(GetProfile)
     server.register(RequestPasswordRecover)
     server.register(ResetPassword)
     server.register(AuthenticateWithGithub)
     server.register(AuthenticateWithGoogle)

     // ORGANIZATION
     server.register(CreateOrganization)
     server.register(GetUserMembership)
     server.register(GetOrganization)
     server.register(GetOrganizations)
     server.register(ShutdownOrganzation)
     server.register(TransferOrganization)

     // PROJECTS
     server.register(CreateProjects)
     server.register(DeleteProjects)
}