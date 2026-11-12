import React from 'react';
import { useTravel } from '../context/TravelContext';

export const ItineraryModal = () => {
  const {
    activeItineraryPackage,
    setActiveItineraryPackage,
    setActiveBookingPackage,
    formatPrice
  } = useTravel();

  if (!activeItineraryPackage) return null;
  const pkg = activeItineraryPackage;
  const price = pkg.discountPriceUSD || pkg.priceUSD;

  return (
    <div className="modal-overlay" onClick={() => setActiveItineraryPackage(null)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setActiveItineraryPackage(null)}
          aria-label="Close itinerary"
        >
          ✕
        </button>

        <div style={{ padding: '2.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            EXPEDITION BLUEPRINT • {pkg.category}
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0.5rem 0 1.5rem' }}>
            {pkg.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {(pkg.itinerary || []).map(item => (
              <div
                key={item.day}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                  DAY 0{item.day}
                </span>
                <h4 style={{ fontSize: '1.1rem', margin: '0.25rem 0 0.5rem' }}>{item.title}</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ALL-INCLUSIVE RATE</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatPrice(price)}</div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setActiveItineraryPackage(null);
                setActiveBookingPackage(pkg);
              }}
            >
              Proceed to Reserve Suite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
