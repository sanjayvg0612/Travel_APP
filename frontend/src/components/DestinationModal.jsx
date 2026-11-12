import React from 'react';
import { useTravel } from '../context/TravelContext';

export const DestinationModal = () => {
  const {
    activeDestination,
    setActiveDestination,
    packages,
    formatPrice,
    addStamp,
    hasStamp,
    setActiveBookingPackage,
    setActiveItineraryPackage
  } = useTravel();

  if (!activeDestination) return null;
  const dest = activeDestination;
  const isStamped = hasStamp(dest.stampCode);
  const matchingPackages = (packages || []).filter(p => p.destinationId === dest.id);

  return (
    <div className="modal-overlay" onClick={() => setActiveDestination(null)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setActiveDestination(null)}
          aria-label="Close dossier"
        >
          ✕
        </button>

        {/* Hero Banner */}
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
          <img
            src={dest.image}
            alt={dest.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--bg-card) 0%, rgba(10, 11, 14, 0.4) 60%, transparent 100%)'
            }}
          />
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                SANCTUARY DOSSIER • {dest.continent}
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', margin: '0.25rem 0', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                {dest.name}
              </h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-primary)' }}>
                🌐 {dest.coordinates} • {dest.country}
              </span>
            </div>
            <button
              type="button"
              className={`dest-stamp-trigger ${isStamped ? 'stamped' : ''}`}
              onClick={() => addStamp(dest.stampCode)}
              style={{ position: 'static', transform: 'none' }}
            >
              {isStamped ? '✓ Official Visa Inked' : `🖋️ Stamp ${dest.stampCity}`}
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ padding: '2rem 2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', marginBottom: '1.75rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PRIME SEASON</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>🗓️ {dest.bestTimeToVisit}</strong>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>AVERAGE CLIMATE</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>🌡️ {dest.avgTemperature}</strong>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>LOCAL CURRENCY</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>💵 {dest.currency}</strong>
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>EXPLORER RATING</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>★ {dest.rating} / 5.0</strong>
            </div>
          </div>

          <p style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            {dest.description}
          </p>

          {/* Curated Expeditions for this Sanctuary */}
          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              AVAILABLE EXPEDITIONS IN THIS SANCTUARY ({matchingPackages.length})
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {matchingPackages.map(pkg => (
                <div
                  key={pkg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem 1.25rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', margin: '0 0 0.25rem' }}>{pkg.title}</h4>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      ⏳ {pkg.durationDays} Days • {pkg.category} • ★ {pkg.rating}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>From</span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                        {formatPrice(pkg.discountPriceUSD || pkg.priceUSD)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setActiveDestination(null);
                        setActiveItineraryPackage(pkg);
                      }}
                    >
                      Itinerary
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        setActiveDestination(null);
                        setActiveBookingPackage(pkg);
                      }}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

