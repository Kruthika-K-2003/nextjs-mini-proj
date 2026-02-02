import { CreateIssueSchema, UpdateIssueSchema, Issue } from '@/lib/schema';
import { addIssue, deleteIssueFromStorage, getIssues, updateIssueInStorage } from '@/lib/storage';

// These are now client-side functions, not Server Actions
// We removed 'use server'

export async function fetchIssuesAction() {
  // Simulate network delay for realism if desired, but not strictly necessary
  await new Promise(resolve => setTimeout(resolve, 300)); 
  return await getIssues();
}

export async function createIssueAction(data: unknown) {
  const result = CreateIssueSchema.safeParse(data);
  
  if (!result.success) {
    throw new Error(result.error.message);
  }

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

  await addIssue(newIssue);
  return newIssue;
}

export async function updateIssueAction(id: string, data: unknown) {
  const result = UpdateIssueSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  const updated = await updateIssueInStorage(id, {
    ...result.data,
    updatedAt: new Date().toISOString(),
  });

  if (!updated) throw new Error('Issue not found');
  return updated;
}

export async function deleteIssueAction(id: string) {
  await deleteIssueFromStorage(id);
  return id;
}
