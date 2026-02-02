import { Issue, IssueSchema, CreateIssueSchema, UpdateIssueSchema, Comment } from './schema';

const KEY = 'jira-clone-issues';

const get = (): Issue[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(KEY);
    return data ? IssueSchema.array().parse(JSON.parse(data)) : [];
  } catch { return []; }
};

const set = (issues: Issue[]) => typeof window !== 'undefined' && localStorage.setItem(KEY, JSON.stringify(issues));

export const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

export const api = {
  fetchIssues: async () => get(),
  
  createIssue: async (data: unknown) => {
    const parsed = CreateIssueSchema.parse(data);
    const newIssue: Issue = {
      id: generateId(),
      ...parsed,
      content: parsed.content || '',
      status: parsed.status || 'todo',
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set([newIssue, ...get()]);
    return newIssue;
  },

  updateIssue: async (id: string, data: unknown) => {
    const parsed = UpdateIssueSchema.parse(data);
    const issues = get();
    const idx = issues.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    
    issues[idx] = { ...issues[idx], ...parsed, updatedAt: new Date().toISOString() };
    set(issues);
    return issues[idx];
  },

  deleteIssue: async (id: string) => {
    set(get().filter(i => i.id !== id));
    return id;
  },

  addComment: async (id: string, comment: Comment) => {
    const issues = get();
    const idx = issues.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Not found');
    
    issues[idx].comments = [comment, ...issues[idx].comments];
    issues[idx].updatedAt = new Date().toISOString();
    set(issues);
    return issues[idx];
  }
};
