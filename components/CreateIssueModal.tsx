'use client';

import { api } from '@/lib/api';
import { CreateIssueSchema, CreateIssueInput } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { X, Wand2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateIssueModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { user } = useStore();
  const [generating, setGenerating] = useState(false);
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CreateIssueInput>({
    resolver: zodResolver(CreateIssueSchema),
    defaultValues: { title: '', content: '', status: 'todo', priority: 'medium', type: 'task' }
  });

  const mutation = useMutation({
    mutationFn: api.createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      reset();
      onClose();
    },
    onError: (e) => alert(e.message)
  });

  const generateAI = async () => {
    setGenerating(true);
    try {
      const { data } = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
      setValue('content', data.text);
    } finally { setGenerating(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Create Issue</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-zinc-500 hover:text-zinc-700" /></button>
        </div>
        <form onSubmit={handleSubmit(data => mutation.mutate({ ...data, reporter: user || undefined }))} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1.5">Type</label>
            <select {...register('type')} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border rounded-lg">
              {['task', 'bug', 'story'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Summary</label>
            <input {...register('title')} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border rounded-lg" placeholder="Title" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-medium">Description</label>
              <button type="button" onClick={generateAI} disabled={generating} className="text-xs flex items-center text-purple-600 hover:text-purple-700">
                {generating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />} AI Generate
              </button>
            </div>
            <textarea {...register('content')} rows={4} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border rounded-lg" placeholder="Details..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Priority</label>
            <select {...register('priority')} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border rounded-lg">
              {['high', 'medium', 'low'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-zinc-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
              {mutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
