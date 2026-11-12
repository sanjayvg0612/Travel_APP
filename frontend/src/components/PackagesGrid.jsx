import React, { useState, useMemo } from 'react';
import { useTravel } from '../context/TravelContext';

export const PackagesGrid = () => {
  const {
    packages,
    formatPrice,
    isWishlisted,
    toggleWishlist,
    setActiveItineraryPackage,
    setActiveBookingPackage
  } = useTravel();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [durationFilter, setDurationFilter] = useState('All');

  const categories = ['All', 'Romance & Luxury', 'Cultural Heritage', 'Adventure & Nature'];

  const filteredPackages = useMemo(() => {
    return (packages || []).filter(pkg => {
      // 1. Keyword search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesQ =
          (pkg.title || '').toLowerCase().includes(q) ||
          (pkg.destinationName || '').toLowerCase().includes(q) ||
          (pkg.summary || '').toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'All') {
        if (!pkg.category?.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // 3. Price filter
      const effectivePrice = pkg.discountPriceUSD || pkg.priceUSD || 0;
      if (effectivePrice > maxPrice) return false;

      // 4. Duration filter
      if (durationFilter === 'short' && pkg.durationDays >= 7) return false;
      if (durationFilter === 'medium' && (pkg.durationDays < 7 || pkg.durationDays > 9)) return false;
      if (durationFilter === 'long' && pkg.durationDays < 10) return false;

      return true;
    });
  }, [packages, searchTerm, selectedCategory, maxPrice, durationFilter]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || maxPrice < 5000 || durationFilter !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMaxPrice(5000);
    setDurationFilter('All');
  };

  return (
    <section style={{ background: 'var(--bg-secondary)', padding: '6rem 0' }} id="packages-section">
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              PRIVATE TOUR CHARTERS
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '0.4rem' }}>
              Curated Grand Expeditions
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-primary)' }}>
              Showing {filteredPackages.length} of {packages?.length || 0} Expeditions
            </span>
          </div>
        </div>

        {/* Interactive Filter Suite */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem 2rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-luxe)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Search Expeditions
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Kyoto, Caldera, Glacier, Safari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem 0.65rem 2.2rem',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>🔍</span>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Curated Categories' : c}</option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                Duration
              </label>
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              >
                <option value="All">Any Duration</option>
                <option value="short">Under 7 Days (Short Getaway)</option>
                <option value="medium">7 – 9 Days (Classic Odyssey)</option>
                <option value="long">10+ Days (Grand Immersion)</option>
              </select>
            </div>

            {/* Price Cap Range */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Max Rate
                </label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  Up to {formatPrice(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="5000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Active Filter Indicators & Reset Button */}
          {hasActiveFilters && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Active Filters: {selectedCategory !== 'All' ? `• ${selectedCategory} ` : ''}{durationFilter !== 'All' ? `• Duration filter active ` : ''}{searchTerm ? `• "${searchTerm}" ` : ''}{maxPrice < 5000 ? `• ≤ ${formatPrice(maxPrice)}` : ''}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--accent-primary)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer'
                }}
              >
                ✕ Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Packages Grid / Zero State */}
        {filteredPackages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧭</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
              No Expeditions Match Your Criteria
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              We could not find an expedition matching all active filters. Try expanding your budget, selecting another category, or resetting filters.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={resetFilters}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="packages-grid">
            {filteredPackages.map(pkg => {
              const favorited = isWishlisted(pkg.id);
              const price = pkg.discountPriceUSD || pkg.priceUSD;

              return (
                <div key={pkg.id} className="package-card" id={`package-${pkg.id}`}>
                  <div className="pkg-image-box">
                    <img src={pkg.image} alt={pkg.title} loading="lazy" />
                    <div className="pkg-gradient-overlay" />
                    <span className="pkg-badge">{pkg.badge}</span>
                    <button
                      type="button"
                      className="wishlist-toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(pkg.id);
                      }}
                      title="Save Expedition"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill={favorited ? 'var(--accent-primary)' : 'none'}
                        stroke={favorited ? 'var(--accent-primary)' : '#fff'}
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <span className="pkg-duration-pill">⏳ {pkg.durationDays} Days • First Class</span>
                  </div>

                  <div className="pkg-body">
                    <div className="pkg-meta-row">
                      <span className="pkg-category">{pkg.category}</span>
                      <span className="pkg-rating">★ {pkg.rating} ({pkg.reviewCount})</span>
                    </div>

                    <h3 className="pkg-title">{pkg.title}</h3>
                    <p className="pkg-summary">{pkg.summary}</p>

                    <div className="pkg-price-row">
                      <div className="price-display">
                        <span className="price-label">Per Explorer</span>
                        <span className="current-price">{formatPrice(price)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setActiveItineraryPackage(pkg)}
                        >
                          Itinerary
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setActiveBookingPackage(pkg)}
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
