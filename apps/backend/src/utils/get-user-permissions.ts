import { defineAbilityFor, userSchema } from "@saas/auth";

export function getUserPermission(userId: string, role: string) {
     const authUser = userSchema.parse({
          id: userId,
          role: role
     })

     const abillity = defineAbilityFor(authUser)

     return abillity
}