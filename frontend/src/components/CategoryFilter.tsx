import React, { useEffect, useState } from 'react';
import assetService from '../services/assetService';
import '../styles/CategoryFilter.css';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await assetService.getCategories();
      // Filter out "Logos" and "Logo" categories
      const filteredCategories = data.filter(
        cat => cat.toLowerCase() !== 'logos' && cat.toLowerCase() !== 'logo'
      );
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="category-filter">Loading categories...</div>;
  }

  return (
    <div className="category-filter">
      <button
        className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
        onClick={() => onCategoryChange(null)}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
