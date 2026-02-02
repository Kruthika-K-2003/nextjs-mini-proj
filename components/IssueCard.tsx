'use client';

import { api } from '@/lib/api';
import { Issue } from '@/lib/schema';
import { useStore } from '@/lib/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Draggable } from '@hello-pangea/dnd';
import { MessageSquare, Trash2 } from 'lucide-react';
import { getPriorityIcon, getTypeIcon } from './Icons';

export default function IssueCard({ issue, index }: { issue: Issue; index: number }) {
  const queryClient = useQueryClient();
  const { setActiveIssueId } = useStore();

  const deleteMutation = useMutation({
    mutationFn: api.deleteIssue,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      const prev = queryClient.getQueryData<Issue[]>(['issues']);
      queryClient.setQueryData<Issue[]>(['issues'], old => old?.filter(i => i.id !== id) ?? []);
      return { prev };
    },
    onError: (_, __, ctx) => queryClient.setQueryData(['issues'], ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setActiveIssueId(issue.id)}
          className={`bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 group relative transition-all duration-200 hover:shadow-md cursor-pointer ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500 rotate-2 scale-105 z-50' : ''}`}
          style={provided.draggableProps.style}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium line-clamp-2 leading-tight">{issue.title}</span>
            <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deleteMutation.mutate(issue.id); }} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {getTypeIcon(issue.type)}
              {getPriorityIcon(issue.priority)}
              {issue.comments.length > 0 && <div className="flex items-center text-zinc-400 text-xs ml-1"><MessageSquare className="w-3 h-3 mr-0.5" />{issue.comments.length}</div>}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-zinc-400 font-mono">{issue.id.slice(0, 4).toUpperCase()}</span>
              {issue.reporter && <img src={issue.reporter.picture.thumbnail} alt="" className="w-5 h-5 rounded-full border border-zinc-100 dark:border-zinc-700" />}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
