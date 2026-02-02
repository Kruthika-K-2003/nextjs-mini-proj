'use client';

import { api } from '@/lib/api';
import { useStore } from '@/lib/store';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import IssueCard from './IssueCard';
import IssueDetailsModal from './IssueDetailsModal';
import { Issue, IssueStatus } from '@/lib/schema';

const COLUMNS: { id: IssueStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function Board() {
  const [ready, setReady] = useState(false);
  const queryClient = useQueryClient();
  const { searchQuery, typeFilter, priorityFilter, activeIssueId, setActiveIssueId } = useStore();

  useEffect(() => setReady(true), []);

  const { data: issues = [] } = useQuery({ queryKey: ['issues'], queryFn: api.fetchIssues });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IssueStatus }) => api.updateIssue(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      const prev = queryClient.getQueryData<Issue[]>(['issues']);
      queryClient.setQueryData<Issue[]>(['issues'], old => old?.map(i => i.id === id ? { ...i, status } : i) ?? []);
      return { prev };
    },
    onError: (_, __, ctx) => queryClient.setQueryData(['issues'], ctx?.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });

  const filtered = useMemo(() => issues.filter(i => 
    (i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.content?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (typeFilter === 'all' || i.type === typeFilter) &&
    (priorityFilter === 'all' || i.priority === priorityFilter)
  ), [issues, searchQuery, typeFilter, priorityFilter]);

  const onDragEnd = (res: DropResult) => {
    if (!res.destination || (res.destination.droppableId === res.source.droppableId && res.destination.index === res.source.index)) return;
    updateStatus.mutate({ id: res.draggableId, status: res.destination.droppableId as IssueStatus });
  };

  if (!ready) return null;

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 h-full max-h-full shadow-inner">
              <div className="p-4 font-semibold text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex justify-between items-center">
                {col.title}
                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2 py-0.5 rounded-full text-xs font-bold">
                  {filtered.filter(i => i.status === col.id).length}
                </span>
              </div>
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={`flex-1 p-2 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    {filtered.filter(i => i.status === col.id).map((issue, idx) => (
                      <IssueCard key={issue.id} issue={issue} index={idx} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      {activeIssueId && <IssueDetailsModal issue={issues.find(i => i.id === activeIssueId)!} onClose={() => setActiveIssueId(null)} />}
    </>
  );
}
