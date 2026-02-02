'use client';

import { Layout, Search, Settings, User as UserIcon, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFilterStore, useUserStore } from '@/lib/store';
import { IssuePriority, IssueType } from '@/lib/schema';
import { useEffect } from 'react';

export default function Sidebar() {
  const { searchQuery, setSearchQuery, typeFilter, setTypeFilter, priorityFilter, setPriorityFilter } = useFilterStore();
  const { user, isLoading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen fixed left-0 top-0 flex flex-col z-10">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
          <Layout className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">JiraClone</span>
      </div>

      <div className="px-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search issues" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
            <div className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                <Filter className="w-3 h-3 mr-1" /> Filters
            </div>
            
            <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as IssueType | 'all')}
                className="w-full px-2 py-1.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md"
            >
                <option value="all">All Types</option>
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="story">Story</option>
            </select>

            <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as IssuePriority | 'all')}
                className="w-full px-2 py-1.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md"
            >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <Link href="/" className="flex items-center space-x-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md font-medium">
          <Layout className="w-5 h-5" />
          <span>Kanban Board</span>
        </Link>
        <Link href="#" className="flex items-center space-x-3 px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md font-medium transition-colors">
          <Settings className="w-5 h-5" />
          <span>Project Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-3 px-3 py-2">
          {isLoading ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
            </div>
          ) : user ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={user.picture.thumbnail} 
              alt="User" 
              className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
            />
          ) : (
            <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </div>
          )}
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user ? `${user.name.first} ${user.name.last}` : 'User'}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate w-32">
              {user ? user.email : 'Project Admin'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
