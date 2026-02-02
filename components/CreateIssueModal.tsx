'use client';

import { createIssueAction } from '@/app/actions';
import { CreateIssueSchema, CreateIssueInput } from '@/lib/schema';
import { X, Wand2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '@/lib/store';
import axios from 'axios';
import { useState } from 'react';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateIssueModal({ isOpen, onClose }: CreateIssueModalProps) {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateIssueInput>({
    resolver: zodResolver(CreateIssueSchema),
    defaultValues: {
      title: '',
      content: '',
      status: 'todo',
      priority: 'medium',
      type: 'task',
    }
  });

  const mutation = useMutation({
    mutationFn: createIssueAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      reset();
      onClose();
    },
    onError: (error) => {
      console.error('Failed to create issue:', error);
      alert('Failed to create issue: ' + error.message);
    }
  });

  const generateDescription = async () => {
    setIsGenerating(true);
    try {
      // Using Axios to fetch a random useless fact as a placeholder description
      const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
      setValue('content', response.data.text);
    } catch (error) {
      console.error('Failed to generate description', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: CreateIssueInput) => {
    // Attach the current user as reporter
    const issueData = {
      ...data,
      reporter: user || undefined
    };
    mutation.mutate(issueData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Create Issue</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 overflow-y-auto"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Issue Type
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="story">Story</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Summary
              </label>
              <input
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="What needs to be done?"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={isGenerating}
                  className="text-xs flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                  AI Generate
                </button>
              </div>
              <textarea
                {...register('content')}
                rows={4}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Add more details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors shadow-sm hover:shadow"
            >
              {mutation.isPending ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
