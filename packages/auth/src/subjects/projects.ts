import { z } from "zod"
import { projectSchema } from "../models/project"

export const projectSubjects = z.tuple([
     z.union([
          z.literal('create'),
          z.literal('get'),
          z.literal('update'),
          z.literal('delete'),
          z.literal('manage')
     ]),
     z.union([ 
          z.literal('Project'),
          projectSchema
     ])
    
])

export type ProjectSubjects = z.infer<typeof projectSubjects>