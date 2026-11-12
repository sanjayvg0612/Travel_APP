import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { ADDONS } from '../data/travelData';

export const BoardingPassModal = () => {
  const {
    activeBookingPackage,
    setActiveBookingPackage,
    formatPrice,
    addStamp,
    destinations,
    submitBooking
  } = useTravel();

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeBookingPackage) return null;
  const pkg = activeBookingPackage;
  const basePrice = (pkg.discountPriceUSD || pkg.priceUSD) * 2; // Default 2 explorers

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = ADDONS.find(a => a.id === id);
    return acc + (item ? item.priceUSD * 2 : 0);
  }, 0);

  const grandTotal = basePrice + addonsTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomRef = Math.floor(1000 + Math.random() * 9000);
    const fallbackBookingId = `WL-${new Date().getFullYear()}-${randomRef}`;

    const dest = destinations?.find(d => d.id === pkg.destinationId);
    if (dest && dest.stampCode) {
      addStamp(dest.stampCode);
    }

    const bookingPayload = {
      packageId: pkg.id,
      packageTitle: pkg.title,
      travelerName: name.trim(),
      email: email.trim(),
      travelDate: date,
      guests: { adults: 2, children: 0 },
      roomType: 'First Class Suite 01A',
      selectedAddons,
      totalPriceUSD: grandTotal
    };

    let bookingId = fallbackBookingId;
    if (submitBooking) {
      const result = await submitBooking(bookingPayload);
      if (result?.success && result?.booking?.id) {
        bookingId = result.booking.id;
      }
    }

    setConfirmedBooking({
      id: bookingId,
      name,
      email,
      date,
      totalUSD: grandTotal
    });
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    setActiveBookingPackage(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close booking">
          ✕
        </button>

        {!confirmedBooking ? (
          /* Step 1: Manifest Form */
          <div style={{ padding: '2.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              STEP 01 OF 02 • EXPEDITION CONCIERGE MANIFEST
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: '0.5rem 0 1.5rem' }}>
              {pkg.title}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Departure Window Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Lead Explorer Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Julian Sterling"
                    required
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Concierge Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@sterling.co.uk"
                    required
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  White-Glove VIP Add-ons (For 2 Explorers)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {ADDONS.map(addon => (
                    <label
                      key={addon.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'var(--bg-card)',
                        padding: '0.75rem 1rem',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                      />
                      <span>{addon.icon}</span>
                      <span style={{ fontSize: '0.9rem', flexGrow: 1 }}>{addon.name}</span>
                      <strong style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                        +{formatPrice(addon.priceUSD * 2)}
                      </strong>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    TOTAL EXPEDITION TALLY (2 EXPLORERS)
                  </span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {formatPrice(grandTotal)}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Confirming Manifest...' : 'Issue First-Class Boarding Pass ✈️'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Step 2: Vintage First-Class Boarding Pass Voucher */
          <div style={{ padding: '2rem' }}>
            <div className="travel-voucher" id="printable-travel-voucher">
              <div className="voucher-pass-header">
                <div className="pass-airline-brand">
                  <span className="pass-crest">⚜️</span>
                  <div>
                    <h3>WANDERLUST AIRWAYS</h3>
                    <p style={{ margin: 0 }}>FIRST CLASS EXPEDITION & BOARDING PASS</p>
                  </div>
                </div>
                <div className="pass-seat-class">
                  SUITE 01A
                  <span style={{ display: 'block', fontSize: '0.65rem' }}>FIRST CLASS CABIN</span>
                </div>
              </div>

              <div className="voucher-pass-body">
                <div className="voucher-route-row">
                  <div className="route-point">
                    <h4>JFK / LHR</h4>
                    <span>ORIGIN HARBOR</span>
                  </div>

                  <div className="route-flight-path" style={{ textAlign: 'center', flexGrow: 1 }}>
                    <span style={{ fontSize: '1.4rem', color: '#9e2a2b' }}>✈️</span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#4a4237' }}>
                      ROUTE: {pkg.flightRoute || 'DIRECT'} • {pkg.durationDays} DAYS
                    </span>
                  </div>

                  <div className="route-point" style={{ textAlign: 'right' }}>
                    <h4>{pkg.airportCode || 'EXP'}</h4>
                    <span>{pkg.destinationName}</span>
                  </div>
                </div>

                <div className="voucher-pass-grid">
                  <div className="pass-meta-cell">
                    <span className="pm-label">Passenger Name</span>
                    <span className="pm-val">{confirmedBooking.name}</span>
                  </div>
                  <div className="pass-meta-cell">
                    <span className="pm-label">Departure Date</span>
                    <span className="pm-val">{confirmedBooking.date}</span>
                  </div>
                  <div className="pass-meta-cell">
                    <span className="pm-label">Booking Reference</span>
                    <span className="pm-val" style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                      {confirmedBooking.id}
                    </span>
                  </div>
                  <div className="pass-meta-cell">
                    <span className="pm-label">Party Size</span>
                    <span className="pm-val">2 Adults</span>
                  </div>
                </div>

                <div style={{ background: '#f2ebd9', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#1a1715', marginBottom: '0.25rem' }}>
                    <strong>Expedition:</strong> {pkg.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#9e2a2b', fontWeight: 800 }}>
                    Settled: {formatPrice(confirmedBooking.totalUSD)}
                  </div>
                </div>

                <div className="voucher-perforated-tear" />

                <div className="voucher-pass-footer">
                  <div>
                    <div className="pass-barcode" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.15em', color: '#574e41' }}>
                      *{confirmedBooking.id}* VIP PRIORITY
                    </span>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#827869', display: 'block' }}>
                      OFFICIAL SEAL
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1715' }}>
                      ✓ CONFIRMED
                    </span>
                  </div>

                  <div className="pass-wax-seal">
                    WL<br />SEAL
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
                <span>🖨️</span> Print Boarding Pass
              </button>
              <button type="button" className="btn btn-primary" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
