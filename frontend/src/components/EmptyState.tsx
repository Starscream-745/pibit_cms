import React from 'react';
import { SearchX, FolderPlus } from 'lucide-react';
import '../styles/EmptyState.css';

interface EmptyStateProps {
  type: 'search' | 'empty';
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, title, description, action }) => {
  return (
    <div className="empty-state-modern">
      <div className="empty-state-icon">
        {type === 'search' ? (
          <SearchX size={48} strokeWidth={1.5} />
        ) : (
          <FolderPlus size={48} strokeWidth={1.5} />
        )}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};

export default EmptyState;
