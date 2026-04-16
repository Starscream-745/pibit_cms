import React from 'react';
import '../styles/SortDropdown.css';

export type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'category';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const options: { value: SortOption; label: string }[] = [
    { value: 'date-newest', label: '📅 Newest First' },
    { value: 'date-oldest', label: '📅 Oldest First' },
    { value: 'name-asc', label: '🔤 Name (A-Z)' },
    { value: 'name-desc', label: '🔤 Name (Z-A)' },
    { value: 'category', label: '📁 Category' },
  ];

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
