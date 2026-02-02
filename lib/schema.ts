import { z } from 'zod';

export const IssueStatusSchema = z.enum(['todo', 'in-progress', 'done']);
export const IssuePrioritySchema = z.enum(['low', 'medium', 'high']);
export const IssueTypeSchema = z.enum(['task', 'bug', 'story']);

// User Schema
export const UserSchema = z.object({
  name: z.object({
    first: z.string(),
    last: z.string(),
  }),
  email: z.string().email(),
  picture: z.object({
    thumbnail: z.string().url(),
  }),
});

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  author: UserSchema,
  createdAt: z.string(),
});

export const IssueSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string(),
  status: IssueStatusSchema,
  priority: IssuePrioritySchema,
  type: IssueTypeSchema,
  reporter: UserSchema.optional(),
  comments: z.array(CommentSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateIssueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  status: IssueStatusSchema.optional(),
  priority: IssuePrioritySchema,
  type: IssueTypeSchema,
  reporter: UserSchema.optional(),
});

export const UpdateIssueSchema = IssueSchema.partial().omit({ id: true, createdAt: true, updatedAt: true });

export type Issue = z.infer<typeof IssueSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;
export type UpdateIssueInput = z.infer<typeof UpdateIssueSchema>;
export type IssueStatus = z.infer<typeof IssueStatusSchema>;
export type IssuePriority = z.infer<typeof IssuePrioritySchema>;
export type IssueType = z.infer<typeof IssueTypeSchema>;
export type User = z.infer<typeof UserSchema>;
