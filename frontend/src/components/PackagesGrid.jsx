import React from 'react';
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

  return (
    <section style={{ background: 'var(--bg-secondary)', padding: '6rem 0' }} id="packages-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              PRIVATE TOUR CHARTERS
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '0.4rem' }}>
              Curated Grand Expeditions
            </h2>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Displaying {packages?.length || 0} Haute Curated Expeditions
          </span>
        </div>

        <div className="packages-grid">
          {(packages || []).map(pkg => {
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
      </div>
    </section>
  );
};
