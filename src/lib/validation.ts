import { z } from "zod";

const emailValidation = z.string().email();
const passwordValidation = z.string().min(3).max(256);

export const SignUpSchema = z.object({
  fullName: z.string().min(3).max(60),
  email: emailValidation,
  password: passwordValidation,
});
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
