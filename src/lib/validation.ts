import { z } from "zod";

const dataId = z.string();
const dataDate = z.string().transform((str) => new Date(str));

/*Auth*/

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

/* Projects */

export const ProjectOperationSchema = z.object({
  name: z.string().min(3).max(60),
  description: z.string().min(3).max(60).optional(),
  deadline: dataDate.optional(),
});
export type ProjectOperationType = z.infer<typeof ProjectOperationSchema>;

/* Tags */

const tagName = z.string().min(3).max(12);
const tagColor = z.string().min(4).max(9).regex(/^#/);

export const TagCreateSchema = z.object({
  projectId: dataId,
  name: tagName,
  color: tagColor,
});
export type TagCreateSchemaType = z.infer<typeof TagCreateSchema>;

export const TagGetSchema = z.object({
  projectId: dataId,
});
export type TagGetType = z.infer<typeof TagGetSchema>;

export const TagUpdateSchema = z.object({
  name: tagName,
  color: tagColor,
});
export type TagUpdateType = z.infer<typeof TagUpdateSchema>;

/*Tasks*/

export enum StatusType {
  Open = "OPEN",
  InProgress = "IN PROGRESS",
  COMPLETED = "COMPLETED",
}
const TaskStatusTypeSchema = z.nativeEnum(StatusType);

const taskTitle = z.string().min(3).max(18);
const taskDescription = z.string().min(3).max(256).optional();
const taskPriority = z.number().min(1).max(256).optional();

export const TaskCreateSchema = z.object({
  projectId: dataId,
  title: taskTitle,
  description: taskDescription,
  status: TaskStatusTypeSchema,
  dueDate: dataDate,
  priority: taskPriority,
});
export type TaskCreateSchemaType = z.infer<typeof TaskCreateSchema>;

export const TaskGetSchema = z.object({
  projectId: dataId,
  text: z.string().min(3).max(256).optional(),
  status: TaskStatusTypeSchema.optional(),
  dueDate: dataDate.optional(),
  priority: taskPriority,
});
export type TaskGetSchemaType = z.infer<typeof TaskGetSchema>;

export const TaskUpdateSchema = z.object({
  title: taskTitle,
  description: taskDescription,
  status: TaskStatusTypeSchema,
  dueDate: dataDate,
  priority: taskPriority,
});

export type TaskUpdateSchemaType = z.infer<typeof TaskUpdateSchema>;
