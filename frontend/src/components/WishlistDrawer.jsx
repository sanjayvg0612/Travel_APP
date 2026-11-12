import React from 'react';
import { useTravel } from '../context/TravelContext';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    packages,
    formatPrice,
    toggleWishlist,
    setActiveBookingPackage
  } = useTravel();

  if (!isWishlistOpen) return null;

  const savedPackages = (packages || []).filter(p => (wishlist || []).includes(p.id));

  return (
    <aside className="wishlist-drawer" aria-label="Saved Expeditions">
      <div className="wishlist-header">
        <h3 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.05em', margin: 0 }}>
          <span>🤍</span> Saved Journeys ({wishlist.length})
        </h3>
        <button
          type="button"
          className="modal-close-btn"
          style={{ position: 'static' }}
          onClick={() => setIsWishlistOpen(false)}
          aria-label="Close wishlist"
        >
          ✕
        </button>
      </div>

      <div className="wishlist-items-container">
        {savedPackages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧭</div>
            <h4 style={{ margin: '0 0 0.5rem' }}>No Expeditions Bookmarked</h4>
            <p style={{ fontSize: '0.85rem' }}>
              Click the heart seal on any package card to assemble your curated journey list.
            </p>
          </div>
        ) : (
          savedPackages.map(pkg => (
            <div
              key={pkg.id}
              style={{
                display: 'flex',
                gap: '1rem',
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h5 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-serif)', margin: '0 0 0.25rem' }}>
                  {pkg.title}
                </h5>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  {formatPrice(pkg.discountPriceUSD || pkg.priceUSD)}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setActiveBookingPackage(pkg);
                    }}
                  >
                    Reserve
                  </button>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#f43f5e', fontSize: '0.75rem', cursor: 'pointer' }}
                    onClick={() => toggleWishlist(pkg.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
