'use client';

import { Layout, Search, Settings, User as UserIcon, Filter, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const { searchQuery, setSearchQuery, typeFilter, setTypeFilter, priorityFilter, setPriorityFilter, user, isLoadingUser, fetchUser, isSidebarOpen, toggleSidebar } = useStore();
  useEffect(() => { fetchUser(); }, [fetchUser]);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden animate-in fade-in duration-200"
          onClick={toggleSidebar}
        />
      )}

      <div className={clsx(
        "w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen fixed left-0 top-0 flex flex-col z-30 transition-transform duration-300 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center"><Layout className="w-5 h-5 text-white" /></div>
            <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">JiraClone</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-zinc-500 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>
      <div className="px-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border rounded-md text-sm" />
        </div>
        <div className="space-y-2">
            <div className="flex items-center text-xs font-semibold text-zinc-500 uppercase tracking-wider"><Filter className="w-3 h-3 mr-1" /> Filters</div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="w-full px-2 py-1.5 text-sm bg-white dark:bg-zinc-800 border rounded-md">
                {['all', 'task', 'bug', 'story'].map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)} className="w-full px-2 py-1.5 text-sm bg-white dark:bg-zinc-800 border rounded-md">
                {['all', 'high', 'medium', 'low'].map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
            </select>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <Link href="/" className="flex items-center space-x-3 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md font-medium"><Layout className="w-5 h-5" /><span>Board</span></Link>
        <Link href="#" className="flex items-center space-x-3 px-3 py-2 text-zinc-600 hover:bg-zinc-100 rounded-md font-medium"><Settings className="w-5 h-5" /><span>Settings</span></Link>
      </nav>
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center space-x-3 px-3 py-2">
        {isLoadingUser ? <Loader2 className="w-4 h-4 animate-spin text-zinc-500" /> : user ? <img src={user.picture.thumbnail} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center"><UserIcon className="w-4 h-4 text-zinc-500" /></div>}
        <div className="flex flex-col"><span className="text-sm font-medium">{user ? `${user.name.first} ${user.name.last}` : 'User'}</span><span className="text-xs text-zinc-500 truncate w-32">{user?.email || 'Admin'}</span></div>
      </div>
    </div>
    </>
  );
}
