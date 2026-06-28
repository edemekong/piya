import { z } from "zod";

const metaWebhookVerificationQuerySchema = z.object({
  "hub.mode": z.string().optional(),
  "hub.challenge": z.string().optional(),
  "hub.verify_token": z.string().optional(),
});

const completeWhatsAppConnectionSchema = z
  .object({
    wabaId: z.string().trim().min(1),
    phoneNumberId: z.string().trim().min(1),
    displayPhoneNumber: z.string().trim().min(1),
    phoneNumber: z.string().trim().min(1).nullable().optional(),
    displayName: z.string().trim().min(1).nullable().optional(),
    qualityRating: z.string().trim().min(1).nullable().optional(),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

const sendWhatsAppMessageSchema = z
  .object({
    to: z.string().trim().min(1),
    text: z.string().trim().min(1).max(4096),
    token: z.unknown().optional(),
    user: z.unknown().optional(),
  })
  .strict()
  .transform(({ token: _token, user: _user, ...data }) => data);

type MetaWebhookVerificationQuery = z.infer<
  typeof metaWebhookVerificationQuerySchema
>;
type CompleteWhatsAppConnectionBody = z.infer<
  typeof completeWhatsAppConnectionSchema
>;
type SendWhatsAppMessageBody = z.infer<typeof sendWhatsAppMessageSchema>;

export {
  completeWhatsAppConnectionSchema,
  CompleteWhatsAppConnectionBody,
  metaWebhookVerificationQuerySchema,
  MetaWebhookVerificationQuery,
  sendWhatsAppMessageSchema,
  SendWhatsAppMessageBody,
};
