import React, { useEffect, useState } from 'react';
import { Asset } from '../types/asset';
import assetService from '../services/assetService';
import AssetCard from './AssetCard';
import CategoryFilter from './CategoryFilter';
import LoadingSkeleton from './LoadingSkeleton';
import SearchBar from './SearchBar';
import SortDropdown, { SortOption } from './SortDropdown';
import { useToast } from '../contexts/ToastContext';
import '../styles/AssetList.css';

const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-newest');
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [assets, selectedCategory, searchQuery, sortOption]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      setError('Failed to load assets. Please try again.');
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = assets;
    
    // Always exclude "Logos" category from main assets page
    filtered = filtered.filter(asset => 
      asset.category.toLowerCase() !== 'logos' && 
      asset.category.toLowerCase() !== 'logo'
    );
    
    // Apply category filter if selected
    if (selectedCategory !== null) {
      filtered = filtered.filter(asset => asset.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(query) ||
        asset.description.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = sortAssets(filtered, sortOption);
    
    setFilteredAssets(filtered);
  };

  const sortAssets = (assetList: Asset[], option: SortOption): Asset[] => {
    const sorted = [...assetList];

    switch (option) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'date-newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'date-oldest':
        return sorted.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'category':
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await assetService.delete(id);
      setAssets(assets.filter(asset => asset.id !== id));
      toast.success('Asset deleted successfully');
    } catch (err) {
      toast.error('Failed to delete asset. Please try again.');
      console.error('Error deleting asset:', err);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  // Group assets by category
  const groupedAssets = filteredAssets.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  if (loading) {
    return (
      <div className="asset-list-container">
        <div className="asset-list-header">
          <h2>Digital Assets</h2>
        </div>
        <LoadingSkeleton type="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="asset-list-container">
        <div className="error">{error}</div>
        <button onClick={loadAssets} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <h2>Digital Assets</h2>
        
        <div className="controls-row">
          <SearchBar onSearch={handleSearch} placeholder="Search by name, description, or category..." />
          <SortDropdown value={sortOption} onChange={handleSortChange} />
        </div>

        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />
      </div>

      {filteredAssets.length === 0 ? (
        <div className="empty-state">
          {searchQuery ? (
            <>
              <p>No assets found for "{searchQuery}"</p>
              <p>Try a different search term or clear the search.</p>
            </>
          ) : (
            <>
              <p>No assets found.</p>
              <p>Start by adding your first asset!</p>
            </>
          )}
        </div>
      ) : (
        <div className="categories-container">
          {Object.entries(groupedAssets).map(([category, categoryAssets]) => (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              <div className="assets-grid">
                {categoryAssets.map((asset, index) => (
                  <div key={asset.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    <AssetCard 
                      asset={asset} 
                      onDelete={handleDelete} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetList;
