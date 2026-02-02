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
      const randomUser = data.results[0];
      const fixedUser = {
        ...randomUser,
        name: { first: 'Kruthika', last: 'K' },
        email: 'kruthika.k@shadesofweb.com',
        picture: { thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
      };
      set({ user: UserSchema.parse(fixedUser), isLoadingUser: false });
    } catch (e) {
      console.error(e);
      set({ 
        user: {
          name: { first: 'Kruthika', last: 'K' },
          email: 'kruthika.k@shadesofweb.com',
          picture: { thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
        }, 
        isLoadingUser: false 
      });
    }
  },

  // UI
  activeIssueId: null,
  setActiveIssueId: (id) => set({ activeIssueId: id }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
