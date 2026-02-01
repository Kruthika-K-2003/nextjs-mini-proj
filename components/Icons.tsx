import { CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';
import { IssuePriority, IssueType } from '@/lib/db';

export const getPriorityIcon = (priority: IssuePriority) => {
  switch (priority) {
    case 'high':
      return <div className="w-4 h-4 rounded-sm bg-red-100 dark:bg-red-900/30 flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full" /></div>;
    case 'medium':
      return <div className="w-4 h-4 rounded-sm bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center"><div className="w-2 h-2 bg-orange-500 rounded-full" /></div>;
    case 'low':
      return <div className="w-4 h-4 rounded-sm bg-green-100 dark:bg-green-900/30 flex items-center justify-center"><div className="w-2 h-2 bg-green-500 rounded-full" /></div>;
  }
};

export const getTypeIcon = (type: IssueType) => {
  switch (type) {
    case 'bug':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case 'story':
      return <Bookmark className="w-4 h-4 text-green-500" />;
    case 'task':
      return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
  }
};
