import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { apiFetch } from '../utils/apiConfig';

export const BookingLookupModal = () => {
  const {
    isBookingLookupOpen,
    setIsBookingLookupOpen,
    trackerBookingId,
    setTrackerBookingId,
    formatPrice,
    showToast
  } = useTravel();

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundBooking, setFoundBooking] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-search if trackerBookingId was passed
  useEffect(() => {
    if (trackerBookingId && isBookingLookupOpen) {
      setQuery(trackerBookingId);
      performLookup(trackerBookingId);
    }
  }, [trackerBookingId, isBookingLookupOpen]);

  const performLookup = async (searchCode) => {
    if (!searchCode.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    setFoundBooking(null);

    try {
      const isEmail = searchCode.includes('@');
      const param = isEmail ? `email=${encodeURIComponent(searchCode.trim())}` : `code=${encodeURIComponent(searchCode.trim())}`;
      const res = await apiFetch(`/api/bookings?${param}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (Array.isArray(data)) {
          if (data.length > 0) setFoundBooking(data[0]);
          else setErrorMessage('No verified reservations found matching this email address.');
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

  const handleSearch = (e) => {
    e.preventDefault();
    performLookup(query);
  };

  const handleClose = () => {
    setIsBookingLookupOpen(false);
    setQuery('');
    setTrackerBookingId('');
    setFoundBooking(null);
    setErrorMessage('');
  };

  // Calculate days until departure
  const getDaysUntilDeparture = (dateStr) => {
    if (!dateStr) return null;
    const dep = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((dep - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (!isBookingLookupOpen) return null;

  const daysLeft = foundBooking ? getDaysUntilDeparture(foundBooking.travelDate) : null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              RESERVATION & LIVE STATUS TRACKER
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
              ● Live Radar Connected
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0 0 1.25rem', color: 'var(--text-main)' }}>
            Track Expedition & Booking Status
          </h3>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter Booking Reference (e.g. TRV-2026-1234) or Email..."
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
              style={{ padding: '0.8rem 1.75rem' }}
            >
              {isLoading ? 'Tracking...' : 'Check Status 🧭'}
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

          {/* FOUND BOOKING STATUS CARD */}
          {foundBooking && (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--accent-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                marginTop: '1.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
              }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                    RESERVATION CODE: <strong>{foundBooking.id}</strong>
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', margin: '0.25rem 0', color: 'var(--text-main)' }}>
                    {foundBooking.packageTitle}
                  </h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Guest: <strong style={{ color: '#fff' }}>{foundBooking.travelerName}</strong> • {foundBooking.email}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      display: 'inline-block',
                      marginBottom: '0.35rem'
                    }}
                  >
                    ✓ {foundBooking.status || 'Confirmed & Settled'}
                  </span>
                  {daysLeft !== null && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: daysLeft > 0 ? 'var(--accent-primary)' : '#10b981' }}>
                      {daysLeft > 0 ? `⏳ Departure in ${daysLeft} Days` : '✈️ Departs Today / Active'}
                    </div>
                  )}
                </div>
              </div>

              {/* 4-STAGE INTERACTIVE LIFECYCLE TIMELINE */}
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>
                  RESERVATION LIFECYCLE TIMELINE
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                  {/* Stage 1 */}
                  <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #10b981', textAlign: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: '#000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>✓</div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Manifest Logged</span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Suite Assigned</span>
                  </div>

                  {/* Stage 2 */}
                  <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #10b981', textAlign: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: '#000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>✓</div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Payment Cleared</span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{foundBooking.paymentMethod ? 'Paid in Full' : 'Settled'}</span>
                  </div>

                  {/* Stage 3 */}
                  <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', textAlign: 'center' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>3</div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Concierge Liaison</span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Customizing VIP</span>
                  </div>

                  {/* Stage 4 */}
                  <div style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', textAlign: 'center', opacity: 0.75 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>4</div>
                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Harbor Departure</span>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{foundBooking.travelDate}</span>
                  </div>
                </div>
              </div>

              {/* Grid Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>DEPARTURE DATE</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>🗓️ {foundBooking.travelDate}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>SUITE CATEGORY</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>🏨 {foundBooking.roomType || 'Suite 01A - Presidential Terrace'}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>PAYMENT METHOD</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>💳 {foundBooking.paymentMethod || 'Credit Card (Amex Black)'}</strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>TRANSACTION ID</span>
                  <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    {foundBooking.paymentTransactionId || 'TXN-89217492'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>SETTLED AMOUNT</span>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
                    {formatPrice ? formatPrice(foundBooking.totalPriceUSD || 0) : `$${foundBooking.totalPriceUSD}`}
                  </strong>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>STATUS</span>
                  <strong style={{ color: '#10b981', fontSize: '0.92rem' }}>✓ Settled in Full</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    if (showToast) showToast('Concierge liaison alerted! An advisor will reach out via WhatsApp/Email.', '🛎️');
                  }}
                  style={{ fontSize: '0.82rem' }}
                >
                  🛎️ Request Concierge Liaison
                </button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => window.print()}
                    style={{ fontSize: '0.82rem' }}
                  >
                    🖨️ Print Pass & Invoice
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleClose}
                    style={{ fontSize: '0.82rem' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
