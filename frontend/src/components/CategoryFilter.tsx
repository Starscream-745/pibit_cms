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
        cat => {
          const lowerCat = cat.toLowerCase();
          return lowerCat !== 'logos' && 
                 lowerCat !== 'logo' && 
                 lowerCat !== 'iconography' && 
                 lowerCat !== 'pitch decks' &&
                 lowerCat !== 'pitch deck';
        }
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
      {categories.map((category) => {
        const displayLabel = category.toLowerCase() === 'documents' || category.toLowerCase() === 'document' 
          ? 'Brochure' 
          : category;

        return (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
