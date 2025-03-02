import { z } from "zod"

export const userSubjects = z.tuple([
     z.union([
          z.literal('manage'),
          z.literal('get'),
          z.literal('invite'),
          z.literal('update'),
          z.literal('delete'),
     ]),
     z.literal('User')
])

export type UserSubjects = z.infer<typeof userSubjects>