import { z } from "zod";

const internalFields = {
  token: z.unknown().optional(),
  user: z.unknown().optional(),
};

const invitableMemberRoleSchema = z.enum(["admin", "manager"]);

const memberInvitationSchema = z
  .object({
    email: z.email(),
    role: invitableMemberRoleSchema,
    ...internalFields,
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

const memberRoleSchema = z
  .object({
    role: invitableMemberRoleSchema,
    ...internalFields,
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

const teamEntryParamsSchema = z.object({
  entryId: z.string().trim().min(1),
});

const invitationAcceptanceParamsSchema = z.object({
  businessId: z.string().trim().min(1),
});

type MemberInvitationBody = z.infer<typeof memberInvitationSchema>;
type MemberRoleBody = z.infer<typeof memberRoleSchema>;
type TeamEntryParams = z.infer<typeof teamEntryParamsSchema>;
type InvitationAcceptanceParams = z.infer<
  typeof invitationAcceptanceParamsSchema
>;

export {
  invitationAcceptanceParamsSchema,
  memberInvitationSchema,
  memberRoleSchema,
  teamEntryParamsSchema,
  InvitationAcceptanceParams,
  MemberInvitationBody,
  MemberRoleBody,
  TeamEntryParams,
};
