import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';

export const HeroMasthead = () => {
  const { destinations } = useTravel();
  const [selectedDest, setSelectedDest] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [partySize, setPartySize] = useState('2');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const el = document.getElementById('packages-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero-modern" id="hero-banner">
      <div className="hero-overlay-glow" />
      
      <div className="container hero-content-wrapper">
        {/* Modern Pill Badge */}
        <div className="hero-badge-pill">
          <span className="badge-sparkle">✨</span>
          <span>HAUTE EXPEDITIONS & PRIVATE CHARTERS • 2026</span>
          <span className="badge-dot" />
        </div>

        {/* Main Modern Headline */}
        <h1 className="hero-main-title">
          The Art of Modern Escape.<br />
          <span className="hero-gradient-text">Curated With Soul.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-main-subtitle">
          Private cave suites above the Santorini caldera, tranquil bamboo ryokans in Kyoto, 
          and chartered Riva yacht voyages along the cliffs of Capri. Tailored by private concierge.
        </p>

        {/* Modern Floating Search Dock */}
        <form className="hero-search-dock" onSubmit={handleSearchSubmit}>
          <div className="search-field-item">
            <span className="field-icon">📍</span>
            <div className="field-meta">
              <label htmlFor="hero-dest-select">Sanctuary</label>
              <select
                id="hero-dest-select"
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
              >
                <option value="">All 8 Sanctuaries</option>
                {(destinations || []).map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="search-field-divider" />

          <div className="search-field-item">
            <span className="field-icon">🗓️</span>
            <div className="field-meta">
              <label htmlFor="hero-season-select">Travel Window</label>
              <select
                id="hero-season-select"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                <option value="">Any Travel Season</option>
                <option value="spring">Spring Cherry Blossom & Wildflowers</option>
                <option value="summer">High Summer Aegean & Riviera Sun</option>
                <option value="autumn">Autumn Terroir & Vintage Harvest</option>
                <option value="winter">Celestial Arctic Aurora & Alpine Snow</option>
              </select>
            </div>
          </div>

          <div className="search-field-divider" />

          <div className="search-field-item">
            <span className="field-icon">👥</span>
            <div className="field-meta">
              <label htmlFor="hero-party-select">Explorers</label>
              <select
                id="hero-party-select"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
              >
                <option value="1">Solo Connoisseur (1 Guest)</option>
                <option value="2">Private Couple Suite (2 Guests)</option>
                <option value="4">Intimate Clan / Villa (4+ Guests)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="hero-search-submit-btn">
            <span>Discover Journeys</span>
            <span className="btn-arrow">→</span>
          </button>
        </form>

        {/* Trust Badges Bar */}
        <div className="hero-trust-bar">
          <div className="trust-item">
            <span className="trust-star">★</span>
            <strong>4.98 / 5.0</strong>
            <span>Verified Explorer Score</span>
          </div>
          <div className="trust-item-divider" />
          <div className="trust-item">
            <span>⚜️</span>
            <strong>100% Private</strong>
            <span>First-Class Charters</span>
          </div>
          <div className="trust-item-divider" />
          <div className="trust-item">
            <span>🛡️</span>
            <strong>Zero-Compromise</strong>
            <span>Lloyd's Insured Cover</span>
          </div>
          <div className="trust-item-divider" />
          <div className="trust-item">
            <span>🌱</span>
            <strong>Carbon Neutral</strong>
            <span>Offset Expeditions</span>
          </div>
        </div>
      </div>
    </section>
  );
};
