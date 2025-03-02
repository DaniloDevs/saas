import { z } from "zod"

export const projectSubjects = z.tuple([
     z.union([
          z.literal('create'),
          z.literal('get'),
          z.literal('update'),
          z.literal('delete'),
          z.literal('manage')
     ]),
     z.literal('Project')
])

export type ProjectSubjects = z.infer<typeof projectSubjects>