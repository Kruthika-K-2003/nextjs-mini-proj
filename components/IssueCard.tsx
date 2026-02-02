'use client';

import { Issue } from '@/lib/schema';
import { Draggable } from '@hello-pangea/dnd';
import { getPriorityIcon, getTypeIcon } from './Icons';
import { deleteIssueAction } from '@/app/actions';
import { Trash2, MessageSquare } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/lib/store';

interface IssueCardProps {
  issue: Issue;
  index: number;
}

export default function IssueCard({ issue, index }: IssueCardProps) {
  const queryClient = useQueryClient();
  const { setActiveIssueId } = useUIStore();

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
          onClick={() => setActiveIssueId(issue.id)}
          className={`bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-750 group relative transition-all duration-200 hover:shadow-md cursor-pointer ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500 rotate-2 scale-105 z-50' : ''
          }`}
          style={provided.draggableProps.style}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight">
              {issue.title}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(confirm('Delete this issue?')) deleteMutation.mutate(issue.id);
              }}
              className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {getTypeIcon(issue.type)}
              {getPriorityIcon(issue.priority)}
              {issue.comments && issue.comments.length > 0 && (
                <div className="flex items-center text-zinc-400 text-xs ml-1">
                  <MessageSquare className="w-3 h-3 mr-0.5" />
                  {issue.comments.length}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-zinc-400 font-mono">
                {issue.id.slice(0, 4).toUpperCase()}
              </span>
              {issue.reporter && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={issue.reporter.picture.thumbnail} 
                  alt="Reporter" 
                  className="w-5 h-5 rounded-full border border-zinc-100 dark:border-zinc-700"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
