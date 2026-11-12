import React from 'react';
import { useTravel } from '../context/TravelContext';

export const PassportModal = () => {
  const {
    isPassportOpen,
    setIsPassportOpen,
    destinations,
    hasStamp,
    addStamp
  } = useTravel();

  if (!isPassportOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsPassportOpen(false)}>
      <div
        className="modal-container"
        style={{ maxWidth: '720px', background: 'transparent', border: 'none', boxShadow: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setIsPassportOpen(false)}
          aria-label="Close passport"
        >
          ✕
        </button>

        <div className="passport-modal-inner">
          <div className="passport-gold-emblem">
            <div className="passport-crest">⚜️</div>
            <h2>THE ROYAL EXPLORERS CLUB</h2>
            <p style={{ margin: 0 }}>OFFICIAL DIGITAL PASSPORT & VISA STAMP MANIFEST</p>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#c4b9a9', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
            Collect official inked border stamps by exploring destinations or issuing first-class expedition reservations.
          </p>

          <div className="passport-pages-grid">
            {(destinations || []).map(dest => {
              const isStamped = hasStamp(dest.stampCode);
              return (
                <div
                  key={dest.id}
                  className={`passport-stamp-slot ${isStamped ? 'stamped' : ''}`}
                >
                  {isStamped ? (
                    <div className="stamp-graphic">
                      <span style={{ fontSize: '1rem' }}>{dest.stampIcon}</span>
                      <span className="stamp-city">{dest.stampCity}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}>{dest.stampCode}</span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: '0.25rem' }}>
                        {dest.stampIcon}
                      </span>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#7d7568', margin: '0 0 0.5rem' }}>
                        {dest.name.split('&')[0]}
                      </p>
                      <button
                        type="button"
                        className="stamp-action-btn"
                        onClick={() => addStamp(dest.stampCode)}
                      >
                        Stamp Visa
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
