import { CreateIssueSchema, UpdateIssueSchema, Issue, Comment } from '@/lib/schema';
import { addIssue, deleteIssueFromStorage, getIssues, updateIssueInStorage } from '@/lib/storage';

export async function fetchIssuesAction() {
  await new Promise(resolve => setTimeout(resolve, 300)); 
  return await getIssues();
}

export async function createIssueAction(data: unknown) {
  console.log('createIssueAction received:', data);
  const result = CreateIssueSchema.safeParse(data);
  
  if (!result.success) {
    console.error('Validation error:', result.error);
    throw new Error(result.error.message);
  }

  const newIssue: Issue = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36),
    title: result.data.title,
    content: result.data.content || '',
    status: result.data.status || 'todo',
    priority: result.data.priority,
    type: result.data.type,
    reporter: result.data.reporter,
    comments: [],
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

export async function addCommentAction(issueId: string, comment: Comment) {
  const issues = await getIssues();
  const index = issues.findIndex(i => i.id === issueId);
  if (index === -1) throw new Error('Issue not found');

  const issue = issues[index];
  const updatedIssue = {
    ...issue,
    comments: [comment, ...(issue.comments || [])],
    updatedAt: new Date().toISOString()
  };

  await updateIssueInStorage(issueId, updatedIssue);
  return updatedIssue;
}

export async function deleteIssueAction(id: string) {
  await deleteIssueFromStorage(id);
  return id;
}
