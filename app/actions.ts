'use server';

import { getIssues, saveIssues } from '@/lib/db';
import { CreateIssueSchema, UpdateIssueSchema, Issue } from '@/lib/schema';
import { revalidatePath } from 'next/cache';

// We return plain objects for React Query to consume

export async function fetchIssuesAction() {
  return await getIssues();
}

export async function createIssueAction(data: unknown) {
  const result = CreateIssueSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(result.error.message);
  }

  const issues = await getIssues();
  const newIssue: Issue = {
    id: crypto.randomUUID(),
    title: result.data.title,
    content: result.data.content || '',
    status: result.data.status,
    priority: result.data.priority,
    type: result.data.type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  issues.unshift(newIssue);
  await saveIssues(issues);
  revalidatePath('/');
  return newIssue;
}

export async function updateIssueAction(id: string, data: unknown) {
  const result = UpdateIssueSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const issues = await getIssues();
  const index = issues.findIndex((n) => n.id === id);
  if (index === -1) throw new Error('Issue not found');

  issues[index] = {
    ...issues[index],
    ...result.data,
    updatedAt: new Date().toISOString(),
  };

  await saveIssues(issues);
  revalidatePath('/');
  return issues[index];
}

export async function deleteIssueAction(id: string) {
  const issues = await getIssues();
  const filteredIssues = issues.filter((n) => n.id !== id);
  await saveIssues(filteredIssues);
  revalidatePath('/');
  return id;
}
