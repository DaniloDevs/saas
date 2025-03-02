import { z } from "zod"

export const organizationSubjects = z.tuple([
     z.union([
          z.literal('manage'),
          z.literal('create'),
          z.literal('update'),
          z.literal('delete'),
          z.literal('transfer_owership'),
     ]),
     z.literal('Organization')
])

export type OrganizationSubjects = z.infer<typeof organizationSubjects>