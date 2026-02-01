import { fetchIssuesAction } from '@/app/actions';
import Board from '@/components/Board';
import ProjectHeader from '@/components/ProjectHeader';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const issues = await fetchIssuesAction();

  return (
    <main className="p-8 h-screen flex flex-col overflow-hidden">
      <ProjectHeader />
      <div className="flex-1 overflow-hidden">
        <Board initialIssues={issues} />
      </div>
    </main>
  );
}
