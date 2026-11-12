import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { apiFetch } from '../utils/apiConfig';

export const BookingLookupModal = () => {
  const { isBookingLookupOpen, setIsBookingLookupOpen, formatPrice } = useTravel();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundBooking, setFoundBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isBookingLookupOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    setFoundBooking(null);

    try {
      const isEmail = query.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(query.trim())}` : `code=${encodeURIComponent(query.trim())}`;
      const res = await apiFetch(`/api/bookings?${param}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (Array.isArray(data)) {
          if (data.length > 0) setFoundBooking(data[0]);
          else setErrorMessage('No verified bookings found matching this email address.');
        } else if (data) {
          setFoundBooking(data);
        } else {
          setErrorMessage('Booking reference not found in current records.');
        }
      } else {
        setErrorMessage('Booking reference not found in current records.');
      }
    } catch {
      setErrorMessage('Unable to connect to concierge server. Please verify your connection.');
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsBookingLookupOpen(false);
    setQuery('');
    setFoundBooking(null);
    setErrorMessage('');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div style={{ padding: '2.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            CONCIERGE MANIFEST RETRIEVAL
          </span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', margin: '0.4rem 0 1.25rem' }}>
            Find Your First-Class Reservation
          </h3>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter Booking Code (e.g. TRV-2026-1234) or Email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              style={{
                flex: '1 1 300px',
                padding: '0.8rem 1.2rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.92rem'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ padding: '0.8rem 1.5rem' }}
            >
              {isLoading ? 'Searching...' : 'Locate Pass 🔍'}
            </button>
          </form>

          {errorMessage && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                marginBottom: '1rem'
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {foundBooking && (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--accent-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                marginTop: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                    CONFIRMED EXPEDITION RESERVATION
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '0.25rem 0' }}>
                    {foundBooking.packageTitle}
                  </h4>
                </div>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  ✓ {foundBooking.status || 'Confirmed'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>LEAD PASSENGER</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{foundBooking.travelerName}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>BOOKING CODE</span>
                  <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>{foundBooking.id}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>DEPARTURE DATE</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{foundBooking.travelDate}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>CABIN & SUITE</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{foundBooking.roomType || 'Suite 01A - Presidential Terrace'}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PAYMENT METHOD</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{foundBooking.paymentMethod || 'Credit Card (Amex Black)'}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TRANSACTION ID</span>
                  <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                    {foundBooking.paymentTransactionId || 'TXN-89217492'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL AMOUNT SETTLED</span>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                    {formatPrice ? formatPrice(foundBooking.totalPriceUSD || 0) : `$${foundBooking.totalPriceUSD}`}
                  </strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PAYMENT STATUS</span>
                  <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>✓ Paid in Full</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => window.print()}
                >
                  🖨️ Print Pass
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleClose}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

