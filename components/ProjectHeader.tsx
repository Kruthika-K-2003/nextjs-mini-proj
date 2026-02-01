'use client';

import { useState } from 'react';
import CreateIssueModal from './CreateIssueModal';

export default function ProjectHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        <span>Projects</span>
        <span>/</span>
        <span>JiraClone</span>
        <span>/</span>
        <span>Kanban Board</span>
      </div>
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Kanban Board</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Create Issue
        </button>
      </div>

      <CreateIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
