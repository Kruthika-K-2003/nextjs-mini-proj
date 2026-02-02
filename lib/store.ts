import { create } from 'zustand';
import { IssuePriority, IssueType, User, UserSchema } from './schema';
import axios from 'axios';

interface AppState {
  // Filter State
  searchQuery: string;
  typeFilter: IssueType | 'all';
  priorityFilter: IssuePriority | 'all';
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: IssueType | 'all') => void;
  setPriorityFilter: (priority: IssuePriority | 'all') => void;

  // User State
  user: User | null;
  isLoadingUser: boolean;
  fetchUser: () => Promise<void>;

  // UI State
  activeIssueId: string | null;
  setActiveIssueId: (id: string | null) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Filter
  searchQuery: '',
  typeFilter: 'all',
  priorityFilter: 'all',
  setSearchQuery: (q) => set({ searchQuery: q }),
  setTypeFilter: (t) => set({ typeFilter: t }),
  setPriorityFilter: (p) => set({ priorityFilter: p }),

  // User
  user: null,
  isLoadingUser: false,
  fetchUser: async () => {
    set({ isLoadingUser: true });
    try {
      const { data } = await axios.get('https://randomuser.me/api/');
      set({ user: UserSchema.parse(data.results[0]), isLoadingUser: false });
    } catch (e) {
      console.error(e);
      set({ isLoadingUser: false });
    }
  },

  // UI
  activeIssueId: null,
  setActiveIssueId: (id) => set({ activeIssueId: id }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
