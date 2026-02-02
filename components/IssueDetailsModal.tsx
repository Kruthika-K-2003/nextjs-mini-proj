'use client';

import { api, generateId } from '@/lib/api';
import { Issue, IssuePriority, IssueStatus } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';

export default function IssueDetailsModal({ issue, onClose }: { issue: Issue; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { user } = useStore();
  const [text, setText] = useState('');
  
  const update = useMutation({
    mutationFn: (data: Partial<Issue>) => api.updateIssue(issue.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] })
  });

  const comment = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Login required');
      await api.addComment(issue.id, { id: generateId(), content: text, author: user, createdAt: new Date().toISOString() });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['issues'] }); setText(''); onClose(); }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between">
            <div>
               <div className="flex items-center space-x-2 text-sm text-zinc-500 mb-2">
                  <span className="font-mono">{issue.id.slice(0, 4).toUpperCase()}</span><span>/</span><span className="capitalize">{issue.type}</span>
               </div>
               <h2 className="text-2xl font-bold">{issue.title}</h2>
            </div>
            <button onClick={onClose} className="md:hidden"><X className="w-6 h-6 text-zinc-500" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose dark:prose-invert max-w-none mb-12">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-300">{issue.content || <span className="italic text-zinc-400">No description.</span>}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Comments</h3>
              <div className="space-y-6 mb-8">
                {issue.comments?.map(c => (
                  <div key={c.id} className="flex space-x-3">
                    <img src={c.author.picture.thumbnail} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{c.author.name.first} {c.author.name.last}</span>
                        <span className="text-xs text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">{c.content}</p>
                    </div>
                  </div>
                ))}
                {!issue.comments?.length && <p className="text-sm text-zinc-500 italic">No comments yet.</p>}
              </div>
              <div className="flex space-x-3">
                 {user ? (
                   <>
                    <img src={user.picture.thumbnail} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border rounded-lg text-sm mb-2" rows={2} />
                      <div className="flex justify-end">
                        <button onClick={() => comment.mutate()} disabled={!text.trim() || comment.isPending} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 flex items-center">
                          <Send className="w-3 h-3 mr-1.5" /> Save
                        </button>
                      </div>
                    </div>
                   </>
                 ) : <div className="text-sm text-zinc-500">Loading user...</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-80 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 flex flex-col h-full overflow-y-auto">
           <div className="flex justify-between items-center mb-6 md:flex hidden">
             <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Details</span>
             <button onClick={onClose}><X className="w-5 h-5 text-zinc-500 hover:text-zinc-700" /></button>
           </div>
           <div className="space-y-6">
             {['Status', 'Priority'].map(field => (
               <div key={field}>
                 <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">{field}</label>
                 <select 
                   value={field === 'Status' ? issue.status : issue.priority} 
                   onChange={e => update.mutate({ [field.toLowerCase()]: e.target.value as IssueStatus | IssuePriority })}
                   className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border rounded-md text-sm"
                 >
                   {(field === 'Status' ? ['todo', 'in-progress', 'done'] : ['high', 'medium', 'low']).map(o => (
                     <option key={o} value={o}>{o.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                   ))}
                 </select>
               </div>
             ))}
             <div>
               <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase">Reporter</label>
               <div className="flex items-center space-x-3">
                 {issue.reporter ? (
                   <>
                    <img src={issue.reporter.picture.thumbnail} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{issue.reporter.name.first} {issue.reporter.name.last}</span>
                      <span className="text-xs text-zinc-500">{issue.reporter.email}</span>
                    </div>
                   </>
                 ) : <div className="flex items-center space-x-2 text-zinc-500 text-sm"><UserIcon className="w-4 h-4" /><span>Anonymous</span></div>}
               </div>
             </div>
             <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 space-y-2">
               <div className="flex justify-between"><span>Created</span><span>{new Date(issue.createdAt).toLocaleDateString()}</span></div>
               <div className="flex justify-between"><span>Updated</span><span>{new Date(issue.updatedAt).toLocaleDateString()}</span></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
