'use client';

import Board from '@/components/Board';
import ProjectHeader from '@/components/ProjectHeader';

// Static export compatible - no server-side fetching
export default function Home() {
  return (
    <main className="p-8 h-screen flex flex-col overflow-hidden">
      <ProjectHeader />
      <div className="flex-1 overflow-hidden">
        <Board />
      </div>
    </main>
  );
}
