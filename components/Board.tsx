'use client';

import { Issue, IssueStatus } from '@/lib/schema';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useEffect, useState, useMemo } from 'react';
import IssueCard from './IssueCard';
import { updateIssueAction, fetchIssuesAction } from '@/app/actions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFilterStore } from '@/lib/store';

interface BoardProps {
  initialIssues: Issue[];
}

const COLUMNS: { id: IssueStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function Board({ initialIssues }: BoardProps) {
  const [enabled, setEnabled] = useState(false);
  const queryClient = useQueryClient();
  const { searchQuery, typeFilter, priorityFilter } = useFilterStore();

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const { data: issues } = useQuery({
    queryKey: ['issues'],
    queryFn: fetchIssuesAction,
    initialData: initialIssues,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IssueStatus }) => 
      updateIssueAction(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      const previousIssues = queryClient.getQueryData<Issue[]>(['issues']);

      queryClient.setQueryData<Issue[]>(['issues'], (old) => {
        if (!old) return [];
        return old.map((issue) => 
          issue.id === id ? { ...issue, status } : issue
        );
      });

      return { previousIssues };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['issues'], context?.previousIssues);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            issue.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || issue.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
      
      return matchesSearch && matchesType && matchesPriority;
    });
  }, [issues, searchQuery, typeFilter, priorityFilter]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as IssueStatus;
    updateStatusMutation.mutate({ id: draggableId, status: newStatus });
  };

  if (!enabled) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4">
        {COLUMNS.map((column) => {
          const columnIssues = filteredIssues.filter((issue) => issue.status === column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col bg-zinc-100 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 h-full max-h-full">
              <div className="p-4 font-semibold text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex justify-between items-center">
                {column.title}
                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full text-xs">
                  {columnIssues.length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 p-2 overflow-y-auto min-h-[150px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    {columnIssues.map((issue, index) => (
                      <IssueCard key={issue.id} issue={issue} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
