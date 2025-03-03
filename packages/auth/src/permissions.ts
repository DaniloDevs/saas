import { AbilityBuilder } from "@casl/ability"
import { AppAbility } from "."
import { User } from "./models/user"
import { Role } from "./role"

type PermisionByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Role, PermisionByRole> = {
     ADMIN(user, { can, cannot }) {
          can('manage', "all")

          cannot(['transfer_owership', 'update'], 'Organization')
          can(['transfer_owership', 'update'], 'Organization', { ownerId: { $eq: user.id } })
     },
     MEMBER(user, { can }) {
          can('get', "User")
          can(['create', 'get'], 'Project')
          can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
          can
     },
     BILLING(_, { can }) {
          can('manage', 'Billing')
     }
}