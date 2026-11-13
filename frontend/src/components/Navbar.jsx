import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';

export const Navbar = () => {
  const {
    theme,
    setTheme,
    currency,
    setCurrency,
    isAtmospherePlaying,
    toggleAtmosphere,
    wishlist,
    stamps,
    setIsPassportOpen,
    setIsWishlistOpen,
    setIsBookingLookupOpen,
    backendOnline
  } = useTravel();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar" id="main-navigation">
      <div className="container nav-content">
        <a href="#" className="brand-logo" aria-label="Wanderlust Haute Home">
          <div className="compass-seal">⚜️</div>
          <span>WANDER<span>LUST</span></span>
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Editorial Sections" className="desktop-nav">
          <ul className="nav-links">
            <li><a href="#vibe-matrix-anchor" className="nav-link">Vibe Matrix</a></li>
            <li><a href="#twilight-anchor" className="nav-link">Day & Night</a></li>
            <li><a href="#destinations-section" className="nav-link">Sanctuaries</a></li>
            <li><a href="#packages-section" className="nav-link">Expeditions</a></li>
            <li><a href="#dispatches-section" className="nav-link">Dispatches</a></li>
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* 4 Curated Editorial Themes Switcher */}
          <div className="theme-picker-box" title="Curated Editorial Aesthetics">
            <button
              type="button"
              className={`theme-pill-btn theme-obsidian ${theme === 'obsidian' ? 'active' : ''}`}
              onClick={() => setTheme('obsidian')}
              title="Obsidian & 24K Gold"
            />
            <button
              type="button"
              className={`theme-pill-btn theme-heritage ${theme === 'heritage' ? 'active' : ''}`}
              onClick={() => setTheme('heritage')}
              title="Wes Anderson Heritage Parchment"
            />
            <button
              type="button"
              className={`theme-pill-btn theme-zen ${theme === 'zen' ? 'active' : ''}`}
              onClick={() => setTheme('zen')}
              title="Kyoto Zen Stone & Clay"
            />
            <button
              type="button"
              className={`theme-pill-btn theme-aegean ${theme === 'aegean' ? 'active' : ''}`}
              onClick={() => setTheme('aegean')}
              title="Aegean Cobalt & Sunlit White"
            />
          </div>

          {/* Ambient Soundscapes Synthesizer (Desktop) */}
          <button
            type="button"
            className={`soundscape-btn desktop-only-btn ${isAtmospherePlaying ? 'playing' : ''}`}
            onClick={toggleAtmosphere}
            title="Toggle Generative Nature Soundscape"
          >
            <div className="sound-bars">
              <span className="sound-bar" />
              <span className="sound-bar" />
              <span className="sound-bar" />
            </div>
            <span>{isAtmospherePlaying ? 'Atmosphere: On' : 'Atmosphere'}</span>
          </button>

          {/* Digital Passport Stamp Book */}
          <button
            type="button"
            className="passport-toggle-btn desktop-only-btn"
            onClick={() => setIsPassportOpen(true)}
            title="View Digital Passport & Visa Stamps"
          >
            <span>🛂</span>
            <span className="passport-stamp-badge">{stamps.length} Stamps</span>
          </button>

          {/* Booking Status & Tracker Trigger */}
          <button
            type="button"
            className="passport-toggle-btn desktop-only-btn"
            onClick={() => setIsBookingLookupOpen(true)}
            title="Track Live Reservation Status & Boarding Pass"
            style={{ padding: '0.4rem 0.8rem' }}
          >
            <span>🧭</span>
            <span style={{ fontSize: '0.78rem' }}>Track Status</span>
          </button>

          {/* API Connectivity Status */}
          {backendOnline && (
            <span
              className="api-status-badge desktop-only-btn"
              title="Connected to Wanderlust Concierge REST API"
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              API Live
            </span>
          )}

          {/* Currency Selector */}
          <div className="currency-selector-box">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
              aria-label="Select Currency"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            className="icon-btn"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Saved Itineraries"
          >
            🤍
            {wishlist.length > 0 && (
              <span className="badge-count">{wishlist.length}</span>
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-links">
            <li>
              <a href="#vibe-matrix-anchor" onClick={closeMobileMenu}>
                🧭 Vibe Matrix
              </a>
            </li>
            <li>
              <a href="#twilight-anchor" onClick={closeMobileMenu}>
                🌅 Day & Night View
              </a>
            </li>
            <li>
              <a href="#destinations-section" onClick={closeMobileMenu}>
                🏛️ Sanctuaries
              </a>
            </li>
            <li>
              <a href="#packages-section" onClick={closeMobileMenu}>
                ✨ Grand Expeditions
              </a>
            </li>
            <li>
              <a href="#dispatches-section" onClick={closeMobileMenu}>
                ✍️ Explorer Dispatches
              </a>
            </li>
          </ul>

          <div className="mobile-nav-actions">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                closeMobileMenu();
                setIsPassportOpen(true);
              }}
            >
              🛂 Digital Passport ({stamps.length} Stamps)
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                closeMobileMenu();
                setIsBookingLookupOpen(true);
              }}
            >
              🧭 Track Booking Status & Pass
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                toggleAtmosphere();
              }}
            >
              🎵 {isAtmospherePlaying ? 'Mute Atmosphere' : 'Play Nature Atmosphere'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
