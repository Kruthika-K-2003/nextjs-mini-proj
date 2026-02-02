import { create } from 'zustand';
import { IssuePriority, IssueType, User } from './schema';
import axios from 'axios';
import { UserSchema } from './schema';

interface FilterState {
  searchQuery: string;
  typeFilter: IssueType | 'all';
  priorityFilter: IssuePriority | 'all';
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: IssueType | 'all') => void;
  setPriorityFilter: (priority: IssuePriority | 'all') => void;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
}

interface UIState {
  activeIssueId: string | null;
  setActiveIssueId: (id: string | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  typeFilter: 'all',
  priorityFilter: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setTypeFilter: (type) => set({ typeFilter: type }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
}));

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('https://randomuser.me/api/');
      const userData = response.data.results[0];
      const parsedUser = UserSchema.parse(userData);
      set({ user: parsedUser, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch user:', error);
      set({ isLoading: false });
    }
  },
}));

export const useUIStore = create<UIState>((set) => ({
  activeIssueId: null,
  setActiveIssueId: (id) => set({ activeIssueId: id }),
}));
