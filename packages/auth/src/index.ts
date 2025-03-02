import { createMongoAbility, CreateAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { permissions } from './permissions';
import { User } from './models/user';
import { userSubjects } from './subjects/user';
import { projectSubjects } from './subjects/projects';
import { z } from 'zod';
import { billingSubjects } from './subjects/billing';
import { organizationSubjects } from './subjects/organization';
import { inviteSubjects } from './subjects/invite';

// type AppAbilities = UserSubjects | ProjectSubjects | ['manage', 'all']

const AppAbilitiesSchema = z.union([
     userSubjects,
     projectSubjects,
     billingSubjects,
     organizationSubjects,
     inviteSubjects,

     z.tuple([
          z.literal('manage'),
          z.literal('all')
     ])
])

type AppAbilities = z.infer<typeof AppAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;


export function defineAbilityFor(user: User) {
     const builder = new AbilityBuilder(createAppAbility)

     if (typeof permissions[user.role] !== 'function') {
          throw new Error(`Permission for role ${user.role} not found.`)
     }

     permissions[user.role](user, builder)

     const ability = builder.build()

     return ability
}