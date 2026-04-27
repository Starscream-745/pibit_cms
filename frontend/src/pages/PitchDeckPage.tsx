import React, { useEffect, useState } from 'react';
import assetService from '../services/assetService';
import { Asset } from '../types/asset';
import Preloader from '../components/Preloader';
import SearchBar from '../components/SearchBar';
import { Presentation, Download } from 'lucide-react';
import '../styles/PitchDeckPage.css';

const PitchDeckPage: React.FC = () => {
  const [decks, setDecks] = useState<Asset[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      // Get all assets from "Pitch Decks" category
      const data = await assetService.getByCategory('Pitch Decks');
      setDecks(data);
      setFilteredDecks(data);
    } catch (err) {
      setError('Failed to load pitch decks. Please try again.');
      console.error('Error loading pitch decks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredDecks(decks);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = decks.filter(deck => 
      deck.name.toLowerCase().includes(lowerQuery) || 
      (deck.description && deck.description.toLowerCase().includes(lowerQuery))
    );
    setFilteredDecks(filtered);
  };

  const handleDownload = (deck: Asset) => {
    if (deck.url.includes('drive.google.com') || deck.url.includes('drive.usercontent.google.com')) {
      window.location.href = deck.url;
    } else {
      const link = document.createElement('a');
      link.href = deck.url;
      link.download = deck.name || 'pitch-deck';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="pitch-deck-page">
        <div style={{ position: 'relative', height: '400px' }}>
          <Preloader isLoading={true} fullScreen={false} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pitch-deck-page">
        <div className="error">{error}</div>
        <button onClick={loadDecks} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="pitch-deck-page">
      <div className="pitch-deck-header">
        <h1>Pitch Decks</h1>
        <p className="pitch-deck-subtitle">Browse and download company presentations and pitch decks</p>
        <div className="pitch-deck-search-container">
          <SearchBar onSearch={handleSearch} placeholder="Search pitch decks by name..." />
        </div>
        <p className="pitch-deck-count">{filteredDecks.length} Deck{filteredDecks.length !== 1 ? 's' : ''} found</p>
      </div>

      {decks.length === 0 ? (
        <div className="empty-state">
          <p>No pitch decks available yet.</p>
          <p>Add assets to the "Pitch Decks" category to display them here.</p>
        </div>
      ) : filteredDecks.length === 0 ? (
        <div className="empty-state">
          <p>No pitch decks found matching your search.</p>
        </div>
      ) : (
        <div className="pitch-deck-grid">
          {filteredDecks.map((deck) => (
            <div 
              key={deck.id} 
              className="deck-item" 
              onClick={() => handleDownload(deck)}
              title={`${deck.name} - Click to download`}
            >
              <div className="deck-wrapper">
                <Presentation className="deck-icon" />
                <div className="deck-hover-overlay">
                  <div className="download-btn-pill">
                    <Download size={18} />
                    <span>Download Deck</span>
                  </div>
                </div>
              </div>
              <div className="deck-info">
                <h4>{deck.name}</h4>
                {deck.description && <p>{deck.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pitch-deck-footer">
        <p>Click any deck to download • Confidential PIBIT.AI Materials</p>
      </div>
    </div>
  );
};

export default PitchDeckPage;
