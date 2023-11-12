import { z } from "zod";

const emailValidation = z.string().email();
const passwordValidation = z.string().min(8).max(256);

export const SignUpSchema = z.object({
  name: z.string().min(3).max(60),
  email: emailValidation,
  password: passwordValidation,
});
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const ProjectOperationSchema = z.object({
  name: z.string().min(3).max(60),
  description: z.string().min(3).max(60).optional(),
  deadline: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
});
export type ProjectOperationType = z.infer<typeof ProjectOperationSchema>;
