import { AbilityBuilder } from "@casl/ability"
import { AppAbility } from "."
import { User } from "./models/user"
import { Role } from "./role"

type PermisionByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, PermisionByRole> = {
     ADMIN(_, { can }) {
          can('manage', "all")
     },
     MEMBER(_, { can }) {
          can('invite', 'User'),
          can('manage', "Project")
     },
     BILLING() { }
}