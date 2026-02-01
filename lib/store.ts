import { create } from 'zustand';
import { IssuePriority, IssueType } from './schema';

interface FilterState {
  searchQuery: string;
  typeFilter: IssueType | 'all';
  priorityFilter: IssuePriority | 'all';
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: IssueType | 'all') => void;
  setPriorityFilter: (priority: IssuePriority | 'all') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  typeFilter: 'all',
  priorityFilter: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
}));
