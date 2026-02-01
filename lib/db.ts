import fs from 'fs/promises';
import path from 'path';
import { Issue, IssueSchema } from './schema';

const DB_PATH = path.join(process.cwd(), 'data', 'notes.json');

export async function getIssues(): Promise<Issue[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const items = JSON.parse(data);
    // Validate with Zod, filter out invalid ones or let it throw if strict
    const parsed = z.array(IssueSchema).safeParse(items);
    if (!parsed.success) {
      console.error('DB Validation Error:', parsed.error);
      return [];
    }
    return parsed.data;
  } catch (error) {
    return [];
  }
}

export async function saveIssues(issues: Issue[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(issues, null, 2));
}

import { z } from 'zod'; // Import z for the function below
