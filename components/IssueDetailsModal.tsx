'use client';

import { Issue, Comment, IssueStatus, IssuePriority } from '@/lib/schema';
import { X, Send, User as UserIcon, Calendar, Tag, AlertCircle, CheckCircle2, Bookmark } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCommentAction, updateIssueAction } from '@/app/actions';
import { useUIStore, useUserStore } from '@/lib/store';
import { useState } from 'react';
import { getPriorityIcon, getTypeIcon } from './Icons';

interface IssueDetailsModalProps {
  issue: Issue;
  onClose: () => void;
}

export default function IssueDetailsModal({ issue, onClose }: IssueDetailsModalProps) {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [commentText, setCommentText] = useState('');
  
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Issue>) => updateIssueAction(issue.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in to comment');
      const newComment: Comment = {
        id: crypto.randomUUID(),
        content: commentText,
        author: user,
        createdAt: new Date().toISOString(),
      };
      await addCommentAction(issue.id, newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      setCommentText('');
      onClose();
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMutation.mutate({ status: e.target.value as IssueStatus });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMutation.mutate({ priority: e.target.value as IssuePriority });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start">
            <div>
               <div className="flex items-center space-x-2 text-sm text-zinc-500 mb-2">
                  <span className="font-mono">{issue.id.slice(0, 4).toUpperCase()}</span>
                  <span>/</span>
                  <span className="capitalize">{issue.type}</span>
               </div>
               <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{issue.title}</h2>
            </div>
            <button onClick={onClose} className="md:hidden text-zinc-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">
                {issue.content || <span className="italic text-zinc-400">No description provided.</span>}
              </p>
            </div>

            <div className="mt-12">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Comments</h3>
              
              <div className="space-y-6 mb-8">
                {issue.comments?.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={comment.author.picture.thumbnail} 
                      alt={comment.author.name.first} 
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                          {comment.author.name.first} {comment.author.name.last}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
                {(!issue.comments || issue.comments.length === 0) && (
                  <p className="text-sm text-zinc-500 italic">No comments yet.</p>
                )}
              </div>

              <div className="flex space-x-3">
                 {user ? (
                   <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={user.picture.thumbnail} 
                      alt="Me" 
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm mb-2"
                        rows={2}
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => commentMutation.mutate()}
                          disabled={!commentText.trim() || commentMutation.isPending}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors flex items-center"
                        >
                          <Send className="w-3 h-3 mr-1.5" />
                          Save
                        </button>
                      </div>
                    </div>
                   </>
                 ) : (
                   <div className="text-sm text-zinc-500">Loading user profile...</div>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6 flex flex-col h-full overflow-y-auto">
           <div className="flex justify-between items-center mb-6 md:flex hidden">
             <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Details</span>
             <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
               <X className="w-5 h-5" />
             </button>
           </div>

           <div className="space-y-6">
             <div>
               <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Status</label>
               <select 
                 value={issue.status} 
                 onChange={handleStatusChange}
                 className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="todo">To Do</option>
                 <option value="in-progress">In Progress</option>
                 <option value="done">Done</option>
               </select>
             </div>

             <div>
               <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Priority</label>
               <select 
                 value={issue.priority} 
                 onChange={handlePriorityChange}
                 className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="high">High</option>
                 <option value="medium">Medium</option>
                 <option value="low">Low</option>
               </select>
             </div>

             <div>
               <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase">Reporter</label>
               <div className="flex items-center space-x-3">
                 {issue.reporter ? (
                   <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={issue.reporter.picture.thumbnail} 
                      alt="Reporter" 
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {issue.reporter.name.first} {issue.reporter.name.last}
                      </span>
                      <span className="text-xs text-zinc-500">{issue.reporter.email}</span>
                    </div>
                   </>
                 ) : (
                   <div className="flex items-center space-x-2 text-zinc-500 text-sm">
                     <UserIcon className="w-4 h-4" />
                     <span>Anonymous</span>
                   </div>
                 )}
               </div>
             </div>

             <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
               <div className="text-xs text-zinc-500 space-y-2">
                 <div className="flex justify-between">
                   <span>Created</span>
                   <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Updated</span>
                   <span>{new Date(issue.updatedAt).toLocaleDateString()}</span>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
