import { z } from "zod"
import { organizationSchema } from "../models/organization"

export const organizationSubjects = z.tuple([
     z.union([
          z.literal('manage'),
          z.literal('update'),
          z.literal('delete'),
          z.literal('transfer_owership'),
     ]),
     z.union([
          z.literal('Organization'),
          organizationSchema
     ])
])

export type OrganizationSubjects = z.infer<typeof organizationSubjects>