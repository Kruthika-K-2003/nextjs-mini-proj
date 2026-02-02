'use client';

import { useState } from 'react';
import CreateIssueModal from './CreateIssueModal';
import { Menu } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ProjectHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toggleSidebar } = useStore();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400">
          <button onClick={toggleSidebar} className="md:hidden mr-2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
            <Menu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </button>
          <span className="hidden sm:inline">Projects</span>
          <span className="hidden sm:inline">/</span>
          <span className="hidden sm:inline">JiraClone</span>
          <span className="hidden sm:inline">/</span>
          <span>Kanban Board</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kanban Board</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Create Issue
        </button>
      </div>

      <CreateIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
