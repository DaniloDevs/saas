import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequest } from "../_errors/bad-request";
import { roleSchema } from "@saas/auth";

export default async function GetInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/invites/:id",
    {
      schema: {
        tags: ["Invites"],
        summary: "Get a invite",
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: z.object({
            invite: z.object({
              id: z.string(),
              email: z.string(),
              role: roleSchema,
              createdAt: z.date(),
              author: z
                .object({
                  id: z.string(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().nullable(),
                })
                .nullable(),
              organization: z.object({
                name: z.string(),
              }),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const invite = await prisma.invite.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          organization: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!invite) {
        throw new BadRequest("Invite not found!");
      }

      return reply.status(200).send({ invite });
    }
  );
}
