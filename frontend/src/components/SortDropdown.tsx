import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Type, Folder, ChevronDown } from 'lucide-react';
import '../styles/SortDropdown.css';

export type SortOption = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'category';

interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'date-newest', label: 'Newest First', icon: <Calendar size={14} /> },
    { value: 'date-oldest', label: 'Oldest First', icon: <Calendar size={14} /> },
    { value: 'name-asc', label: 'Name (A-Z)', icon: <Type size={14} /> },
    { value: 'name-desc', label: 'Name (Z-A)', icon: <Type size={14} /> },
    { value: 'category', label: 'Category', icon: <Folder size={14} /> },
  ];

  const currentOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <span className="sort-label">Sort by:</span>
      <div className="custom-select-container">
        <button 
          className="custom-select-button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="current-selection">
            {currentOption.icon}
            {currentOption.label}
          </span>
          <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
        </button>

        {isOpen && (
          <div className="custom-select-menu">
            {options.map((option) => (
              <button
                key={option.value}
                className={`custom-select-item ${value === option.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;
