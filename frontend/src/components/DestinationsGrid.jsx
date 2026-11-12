import React from 'react';
import { useTravel } from '../context/TravelContext';

export const DestinationsGrid = () => {
  const { destinations, addStamp, hasStamp, setIsPassportOpen, setActiveDestination } = useTravel();

  return (
    <section className="container" id="destinations-section" style={{ padding: '6rem 2rem' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            PORTFOLIO OF SANCTUARIES
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
            Eight Coordinates of Wonder
          </h2>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsPassportOpen(true)}
        >
          Open Passport Collection 🛂
        </button>
      </div>

      <div className="destinations-grid">
        {(destinations || []).map(dest => {
          const isStamped = hasStamp(dest.stampCode);
          return (
            <div
              key={dest.id}
              className="destination-card"
              onClick={() => setActiveDestination(dest)}
              style={{ cursor: 'pointer' }}
            >
              <div className="dest-image-wrapper">
                <img src={dest.image} alt={dest.name} loading="lazy" />
                <span className="dest-coordinates">🌐 {dest.coordinates}</span>
                <button
                  type="button"
                  className={`dest-stamp-trigger ${isStamped ? 'stamped' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    addStamp(dest.stampCode);
                  }}
                  title="Stamp Digital Passport"
                >
                  {isStamped ? '✓ Visa Stamped' : '🖋️ Collect Stamp'}
                </button>
              </div>

              <div className="dest-content">
                <div className="dest-header">
                  <h3>{dest.name}</h3>
                  <span className="dest-country">{dest.country}</span>
                </div>
                <p className="dest-tagline">"{dest.tagline}"</p>
                <div className="dest-info-row">
                  <span>🗓️ {dest.bestTimeToVisit}</span>
                  <span>🌡️ {dest.avgTemperature}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.82rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDestination(dest);
                    }}
                  >
                    View Sanctuary Dossier 🧭
                  </button>
                  <a
                    href="#packages-section"
                    className="btn btn-secondary"
                    style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Tours ({dest.packagesCount}) →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
