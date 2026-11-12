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
    submitBooking,
    showToast
  } = useTravel();

  // Step 1: Manifest state
  const [step, setStep] = useState(1); // 1 = Manifest, 2 = Payment, 3 = Confirmed Pass
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [guestCount, setGuestCount] = useState(2);
  const [cabinSuite, setCabinSuite] = useState('Suite 01A - Royal Presidential Terrace');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Step 2: Payment state
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'apple', 'wire'
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8899');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('889');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherApplied, setVoucherApplied] = useState(false);

  // Step 3: Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeBookingPackage) return null;
  const pkg = activeBookingPackage;

  // Price calculations
  const perPersonPrice = pkg.discountPriceUSD || pkg.priceUSD || 2800;
  const baseSubtotal = perPersonPrice * guestCount;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = ADDONS.find(a => a.id === id);
    return acc + (item ? item.priceUSD * guestCount : 0);
  }, 0);
  const taxesAndDues = Math.round((baseSubtotal + addonsTotal) * 0.05); // 5% port & sanctuary dues
  const grandTotal = Math.max(0, baseSubtotal + addonsTotal + taxesAndDues - discountAmount);

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const applyVoucher = (e) => {
    e?.preventDefault();
    const cleanCode = voucherCode.trim().toUpperCase();
    if (cleanCode === 'WANDER150' || cleanCode === 'VIP150' || cleanCode === 'SANCTUARY150') {
      setDiscountAmount(150);
      setVoucherApplied(true);
      if (showToast) showToast('VIP Voucher applied! $150 credit deducted.', '🎟️');
    } else {
      if (showToast) showToast('Invalid code. Try WANDER150 from our club newsletter!', '⚠️');
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      if (showToast) showToast('Please enter your lead explorer name and email.', '⚠️');
      return;
    }
    setCardHolder(name.trim().toUpperCase());
    setStep(2);
  };

  const handleAuthorizePayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomRef = Math.floor(1000 + Math.random() * 9000);
    const fallbackBookingId = `TRV-${new Date().getFullYear()}-${randomRef}`;
    const transactionId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const dest = destinations?.find(d => d.id === pkg.destinationId);
    if (dest && dest.stampCode) {
      addStamp(dest.stampCode);
    }

    const bookingPayload = {
      packageId: pkg.id,
      packageTitle: pkg.title,
      travelerName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      travelDate: date,
      guests: { adults: guestCount, children: 0 },
      roomType: cabinSuite,
      selectedAddons,
      totalPriceUSD: grandTotal,
      discountUSD: discountAmount,
      paymentMethod: paymentMethod === 'card' ? 'Centurion Black Card' : paymentMethod === 'apple' ? 'Apple Pay Express' : 'Swiss Private Wire',
      paymentTransactionId: transactionId,
      cardLast4: '8899',
      specialRequests: specialRequests.trim()
    };

    let bookingId = fallbackBookingId;
    if (submitBooking) {
      try {
        const result = await submitBooking(bookingPayload);
        if (result?.success && result?.booking?.id) {
          bookingId = result.booking.id;
        }
      } catch (err) {
        console.warn('Backend booking submission failed, using local confirmation:', err);
      }
    }

    setConfirmedBooking({
      id: bookingId,
      transactionId,
      name,
      email,
      date,
      guests: guestCount,
      cabin: cabinSuite,
      totalUSD: grandTotal,
      paymentMethod: bookingPayload.paymentMethod,
      timestamp: new Date().toLocaleString()
    });

    if (showToast) {
      showToast(`Expedition Confirmed! Reference ${bookingId} inked to passport.`, '✈️');
    }

    setIsSubmitting(false);
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    setActiveBookingPackage(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close booking">
          ✕
        </button>

        {/* ===================================================================
            STEP 1: EXPEDITION MANIFEST & SUITE CUSTOMIZATION
           =================================================================== */}
        {step === 1 && (
          <div style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                STEP 01 OF 03 • EXPEDITION MANIFEST
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Next: Payment Checkout
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0 0 1.5rem', color: 'var(--text-main)' }}>
              {pkg.title}
            </h3>

            <form onSubmit={handleProceedToPayment}>
              {/* Row 1: Date & Guests */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Party Size (Explorers)
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  >
                    <option value={1}>Solo Explorer (1 Guest)</option>
                    <option value={2}>Private Couple (2 Guests)</option>
                    <option value={4}>Private Clan / Villa (4 Guests)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    First-Class Cabin Suite
                  </label>
                  <select
                    value={cabinSuite}
                    onChange={(e) => setCabinSuite(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  >
                    <option value="Suite 01A - Royal Presidential Terrace">Suite 01A - Royal Presidential Terrace</option>
                    <option value="Suite 02B - Cliffside Cave Sanctuary">Suite 02B - Cliffside Cave Sanctuary</option>
                    <option value="Villa Horizon - Private Solarium & Plunge">Villa Horizon - Private Solarium & Plunge</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Traveler Contact Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Lead Explorer Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lord Julian Sterling"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Private Concierge Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@sterling.co.uk"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Satellite Contact / Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  />
                </div>
              </div>

              {/* VIP Curated Add-ons */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
                  White-Glove VIP Curations (For {guestCount} {guestCount === 1 ? 'Explorer' : 'Explorers'})
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {ADDONS.map(addon => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          background: isSelected ? 'rgba(212, 175, 55, 0.12)' : 'var(--bg-card)',
                          padding: '0.85rem 1rem',
                          border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAddon(addon.id)}
                          style={{ accentColor: 'var(--accent-primary)', width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '1.2rem' }}>{addon.icon}</span>
                        <div style={{ flexGrow: 1 }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                            {addon.name}
                          </span>
                        </div>
                        <strong style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                          +{formatPrice(addon.priceUSD * guestCount)}
                        </strong>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Preview & Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    ESTIMATED EXPEDITION SUB-TOTAL
                  </span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {formatPrice(baseSubtotal + addonsTotal)}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.8rem' }}>
                  Proceed to Payment Checkout →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================
            STEP 2: LUXURY PAYMENT TERMINAL & VOUCHER SETTLEMENT
           =================================================================== */}
        {step === 2 && (
          <div style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                STEP 02 OF 03 • SECURE LUXURY PAYMENT
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              >
                ← Edit Manifest
              </button>
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', margin: '0 0 1.5rem', color: 'var(--text-main)' }}>
              Concierge Checkout & Settlement
            </h3>

            {/* Payment Method Selector */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: '1 1 180px',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: paymentMethod === 'card' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
                  border: paymentMethod === 'card' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>💳</span> Credit / Black Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple')}
                style={{
                  flex: '1 1 180px',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: paymentMethod === 'apple' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
                  border: paymentMethod === 'apple' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>🍏</span> Apple / Google Pay
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wire')}
                style={{
                  flex: '1 1 180px',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: paymentMethod === 'wire' ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
                  border: paymentMethod === 'wire' ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>🏛️</span> Swiss Escrow Wire
              </button>
            </div>

            <form onSubmit={handleAuthorizePayment}>
              {paymentMethod === 'card' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                      placeholder="LORD JULIAN STERLING"
                      style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      placeholder="4532 •••• •••• 8899"
                      style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '0.1em' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        placeholder="08/29"
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                        maxLength={4}
                        placeholder="•••"
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}></div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                    Apple Pay Instant Biometric Authorization
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Biometric fingerprint or Face ID will be requested upon clicking Authorize Payment below.
                  </p>
                </div>
              )}

              {paymentMethod === 'wire' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                    🏛️ BANQUE CANTONALE DE GENÈVE (SWISS ESCROW)
                  </div>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                    IBAN: <strong>CH93 0079 0123 4567 8901 2</strong> • BIC/SWIFT: <strong>BCGECHGGXXX</strong><br />
                    Reference will be generated instantly to hold your suite with 48 hours settlement window.
                  </p>
                </div>
              )}

              {/* Voucher Code Box */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="VIP Promo Voucher (e.g. WANDER150)..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  style={{ flex: 1, padding: '0.7rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.88rem', textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  onClick={applyVoucher}
                  className="btn btn-secondary"
                  style={{ padding: '0.7rem 1.25rem', fontSize: '0.85rem' }}
                >
                  Apply Code
                </button>
              </div>

              {/* Itemized Financial Ledger */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Base Charter ({guestCount} Explorers)</span>
                  <span>{formatPrice(baseSubtotal)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <span>White-Glove VIP Curations</span>
                    <span>+{formatPrice(addonsTotal)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Maritime Dues & Conservation Tax (5%)</span>
                  <span>+{formatPrice(taxesAndDues)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#10b981', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <span>VIP Member Credit (Voucher)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span>Total Settled USD</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Security Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>🛡️ Lloyd's London Insured</span>
                <span>✓ 100% Flexible Cancel</span>
              </div>

              {/* Settle Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  ← Back to Manifest
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
                >
                  {isSubmitting ? 'Verifying Settle...' : `Authorize & Settle ${formatPrice(grandTotal)} 🔒`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================
            STEP 3: CONFIRMED FIRST-CLASS BOARDING PASS & OFFICIAL TAX RECEIPT
           =================================================================== */}
        {step === 3 && confirmedBooking && (
          <div style={{ padding: '2rem' }}>
            {/* Top Confirmed Ribbon */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✓</span>
                <div>
                  <strong style={{ color: '#10b981', fontSize: '0.95rem', display: 'block' }}>
                    Expedition Manifest Confirmed & Paid in Full
                  </strong>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Transaction Ref: {confirmedBooking.transactionId} • Settled via {confirmedBooking.paymentMethod}
                  </span>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                {confirmedBooking.id}
              </span>
            </div>

            {/* Vintage Printable Boarding Pass */}
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
                    <span className="pm-label">Explorers & Cabin</span>
                    <span className="pm-val">{confirmedBooking.guests} Guests • Suite 01A</span>
                  </div>
                </div>

                <div style={{ background: '#f2ebd9', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#1a1715', marginBottom: '0.25rem' }}>
                    <strong>Expedition:</strong> {pkg.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#9e2a2b', fontWeight: 800 }}>
                      Paid in Full: {formatPrice(confirmedBooking.totalUSD)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#574e41' }}>
                      Settled via {confirmedBooking.paymentMethod}
                    </span>
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
                      ✓ CONFIRMED & PAID
                    </span>
                  </div>

                  <div className="pass-wax-seal">
                    WL<br />SEAL
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Print & Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
                <span>🖨️</span> Print Boarding Pass & Tax Invoice
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
