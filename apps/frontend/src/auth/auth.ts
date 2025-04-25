import { GetMembership } from "@/https/get-membership";
import { GetProfile } from "@/https/get-profile";
import { defineAbilityFor } from "@saas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function isAuthenticated() {
     const cookie = await cookies()

     return !!cookie.get('token')?.value
}

export async function getCurrentOrganization() {
     const cookie = await cookies()

     return cookie.get('org')?.value ?? null
}

export async function getCurrentMembership() {
     const org = await getCurrentOrganization()

     if (!org) {
          return null
     }

     const { membership } = await GetMembership(org)

     return membership
}

export async function ability() {
     const membership = await getCurrentMembership()

     if (!membership) {
          return null
     }

     const ability = defineAbilityFor({
          id: membership.userId,
          role: membership.role
     })

     return ability
}

export default async function auth() {
     const cookie = await cookies()

     const token = cookie.get('token')?.value

     if (!token) {
          redirect('/auth/sign-in')
     }

     try {
          const { user } = await GetProfile()

          return { user }
     } catch (err) {
          console.log(err)
     }

     redirect('/api/auth/sign-out')
}