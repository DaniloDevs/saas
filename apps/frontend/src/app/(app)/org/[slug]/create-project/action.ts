"use server"

import { getCurrentOrganization } from "@/auth/auth"
import { CreateProject } from "@/http/create-project"
import { HTTPError } from "ky"
import { z } from "zod"

const projectSchema = z
     .object({
          name: z.string().min(4, { message: 'Please, incluide at least 4 characters.' }),
          description: z.string(),
     })


export async function createProjectAction(data: FormData) {

     const result = projectSchema.safeParse(Object.fromEntries(data))

     if (!result.success) {
          const errors = result.error.flatten().fieldErrors

          return { success: false, message: null, errors }
     }

     const { name, description } = result.data


     try {
          const org = await getCurrentOrganization()

          await CreateProject({
               org: org!,
               name,
               description,
          })


          return { success: true, message: "Successfully saved the project", errors: null }

     } catch (err) {
          if (err instanceof HTTPError) {
               const { message } = await err.response.json()

               return { success: false, message, errors: null }
          }

          return { success: false, message: "Unexpected error, try again a few minutes.", errors: null }
     }

}