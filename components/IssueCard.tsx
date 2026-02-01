'use client';

import { Issue } from '@/lib/schema';
import { Draggable } from '@hello-pangea/dnd';
import { getPriorityIcon, getTypeIcon } from './Icons';
import { deleteIssueAction } from '@/app/actions';
import { Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IssueCardProps {
  issue: Issue;
  index: number;
}

export default function IssueCard({ issue, index }: IssueCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteIssueAction,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      const previousIssues = queryClient.getQueryData<Issue[]>(['issues']);
      
      queryClient.setQueryData<Issue[]>(['issues'], (old) => 
        old ? old.filter((i) => i.id !== id) : []
      );

      return { previousIssues };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['issues'], context?.previousIssues);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });

  return (
    <Draggable draggableId={issue.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-zinc-800 p-3 rounded shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 group relative ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 rotate-2' : ''
          }`}
          style={provided.draggableProps.style}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {issue.title}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(confirm('Delete this issue?')) deleteMutation.mutate(issue.id);
              }}
              className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {getTypeIcon(issue.type)}
              {getPriorityIcon(issue.priority)}
            </div>
            <span className="text-xs text-zinc-500 font-mono">
              {issue.id.slice(0, 4).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
