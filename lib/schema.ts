import { z } from 'zod';

export const IssueStatusSchema = z.enum(['todo', 'in-progress', 'done']);
export const IssuePrioritySchema = z.enum(['low', 'medium', 'high']);
export const IssueTypeSchema = z.enum(['task', 'bug', 'story']);

export const IssueSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string(),
  status: IssueStatusSchema,
  priority: IssuePrioritySchema,
  type: IssueTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  status: IssueStatusSchema.default('todo'),
  priority: IssuePrioritySchema.default('medium'),
  type: IssueTypeSchema.default('task'),
});

export const UpdateIssueSchema = IssueSchema.partial().omit({ id: true, createdAt: true, updatedAt: true });

export type Issue = z.infer<typeof IssueSchema>;
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type UpdateIssueInput = z.infer<typeof UpdateIssueSchema>;
export type IssueStatus = z.infer<typeof IssueStatusSchema>;
export type IssuePriority = z.infer<typeof IssuePrioritySchema>;
export type IssueType = z.infer<typeof IssueTypeSchema>;
