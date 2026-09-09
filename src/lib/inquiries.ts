import { z } from "zod";

/**
 * Validation for the enquiry form, shared by the browser and the route handler.
 *
 * The server never trusts the client's copy of this: the handler parses the
 * request body with the same schema and rejects anything unexpected.
 */
export const inquirySchema = z.object({
  kind: z.enum(["owner", "guest"]),
  name: z.string().trim().min(2, "Please give us a name.").max(120),
  email: z.string().trim().email("That does not look like an email address.").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  propertyLocation: z.string().trim().max(200).optional().or(z.literal("")),
  stayDetails: z.string().trim().max(200).optional().or(z.literal("")),
  sourcePath: z.string().trim().max(200).optional().or(z.literal("")),
  /** Cloudflare Turnstile token. Verified server-side before anything is stored. */
  turnstileToken: z.string().max(4000).optional().or(z.literal("")),
  /**
   * Honeypot. Real people never see this field, so anything in it is a bot.
   *
   * Accepted by the schema on purpose. Rejecting it here would answer a bot
   * with a validation error, which tells it the submission failed and invites
   * a retry. The handler checks it after parsing and answers 200 while storing
   * nothing, so the bot records a success and moves on.
   */
  company: z.string().max(200).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
