import { Issue, IssueSchema } from './schema';

const STORAGE_KEY = 'jira-clone-issues';

export async function getIssues(): Promise<Issue[]> {
  if (typeof window === 'undefined') return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  try {
    const items = JSON.parse(data);
    const parsed = IssueSchema.array().safeParse(items);
    if (!parsed.success) {
      console.error('Storage Validation Error:', parsed.error);
      return [];
    }
    return parsed.data;
  } catch (error) {
    console.error('Failed to parse issues', error);
    return [];
  }
}

export async function saveIssues(issues: Issue[]): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

export async function addIssue(issue: Issue): Promise<void> {
  const issues = await getIssues();
  issues.unshift(issue);
  await saveIssues(issues);
}

export async function updateIssueInStorage(id: string, updates: Partial<Issue>): Promise<Issue | null> {
  const issues = await getIssues();
  const index = issues.findIndex((i) => i.id === id);
  if (index === -1) return null;

  issues[index] = { ...issues[index], ...updates };
  await saveIssues(issues);
  return issues[index];
}

export async function deleteIssueFromStorage(id: string): Promise<void> {
  const issues = await getIssues();
  const filtered = issues.filter((i) => i.id !== id);
  await saveIssues(filtered);
}
