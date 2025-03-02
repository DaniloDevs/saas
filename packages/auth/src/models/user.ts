import { roleSchema } from "../role"
import { z } from 'zod'

export const userSchema = z.object({
     role: roleSchema
})

export type User = z.infer<typeof userSchema>