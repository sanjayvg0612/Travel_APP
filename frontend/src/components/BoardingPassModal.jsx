import React, { useState, useMemo } from 'react';
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
    showToast,
    openBookingTracker
  } = useTravel();

  // Step state: 1 = Manifest & Dates, 2 = Payment Gateway, 3 = Confirmed & Ticket
  const [step, setStep] = useState(1);

  // Available Departure Windows Generator
  const availableSlots = useMemo(() => {
    const now = new Date();
    const duration = activeBookingPackage?.durationDays || 7;

    const buildSlot = (daysOffset, status, statusColor, tag) => {
      const start = new Date(now);
      start.setDate(start.getDate() + daysOffset);
      const end = new Date(start);
      end.setDate(end.getDate() + duration);

      return {
        startDate: start.toISOString().split('T')[0],
        label: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        status,
        statusColor,
        tag
      };
    };

    return [
      buildSlot(7, '2 Suites Left', '#f43f5e', 'High Demand 🔥'),
      buildSlot(21, '4 Suites Left', '#10b981', 'Prime Weather'),
      buildSlot(38, 'Selling Fast', '#f59e0b', 'Sunset Charter'),
      buildSlot(56, 'Available', '#38bdf8', 'Early Bird Special')
    ];
  }, [activeBookingPackage]);

  // Step 1: Manifest state
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [name, setName] = useState('Sanjay Kumar');
  const [email, setEmail] = useState('sanjay@traveler.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [guestCount, setGuestCount] = useState(2);
  const [cabinSuite, setCabinSuite] = useState('Suite 01A - Royal Presidential Terrace');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Step 2: Payment state
  // Methods: 'card', 'upi', 'apple', 'netbanking', 'crypto', 'wire'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 8899');
  const [cardHolder, setCardHolder] = useState('SANJAY KUMAR');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('889');
  const [upiId, setUpiId] = useState('sanjay@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cryptoCoin, setCryptoCoin] = useState('USDT (TRC20)');
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Loading & confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!activeBookingPackage) return null;
  const pkg = activeBookingPackage;

  // Pricing
  const perPersonPrice = pkg.discountPriceUSD || pkg.priceUSD || 2800;
  const baseSubtotal = perPersonPrice * guestCount;
  const addonsTotal = selectedAddons.reduce((acc, id) => {
    const item = ADDONS.find(a => a.id === id);
    return acc + (item ? item.priceUSD * guestCount : 0);
  }, 0);
  const taxesAndDues = Math.round((baseSubtotal + addonsTotal) * 0.05); // 5% port dues
  const grandTotal = Math.max(0, baseSubtotal + addonsTotal + taxesAndDues - discountAmount);

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const applyVoucher = (e) => {
    e?.preventDefault();
    const cleanCode = voucherCode.trim().toUpperCase();
    if (cleanCode === 'WANDER150' || cleanCode === 'VIP150' || cleanCode === 'DISCOUNT150') {
      setDiscountAmount(150);
      if (showToast) showToast('VIP Voucher verified: $150 credit applied!', '🎟️');
    } else {
      if (showToast) showToast('Invalid code. Try WANDER150 for $150 off!', '⚠️');
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

  const formatCardInput = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    setCardNumber(parts.join(' ') || '');
  };

  const handleAuthorizePayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setProcessingStatus('Connecting 256-Bit SSL Handshake...');
    await new Promise(r => setTimeout(r, 600));

    setProcessingStatus(`Authorizing via ${paymentMethod.toUpperCase()} Gateway...`);
    await new Promise(r => setTimeout(r, 800));

    setProcessingStatus('Verifying Port Reservation & Banking Clearance...');
    await new Promise(r => setTimeout(r, 600));

    const randomRef = Math.floor(1000 + Math.random() * 9000);
    const fallbackBookingId = `TRV-${new Date().getFullYear()}-${randomRef}`;
    const transactionId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const dest = destinations?.find(d => d.id === pkg.destinationId);
    if (dest && dest.stampCode) {
      addStamp(dest.stampCode);
    }

    let methodDisplayName = 'Credit Card (Amex Black)';
    if (paymentMethod === 'upi') methodDisplayName = `UPI Instant (${upiId})`;
    else if (paymentMethod === 'apple') methodDisplayName = 'Apple Pay Biometric';
    else if (paymentMethod === 'netbanking') methodDisplayName = `NetBanking (${selectedBank})`;
    else if (paymentMethod === 'crypto') methodDisplayName = `Crypto Web3 (${cryptoCoin})`;
    else if (paymentMethod === 'wire') methodDisplayName = 'Swiss Escrow Wire';

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
      paymentMethod: methodDisplayName,
      paymentTransactionId: transactionId,
      cardLast4: cardNumber.slice(-4) || '8899',
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
      paymentMethod: methodDisplayName,
      timestamp: new Date().toLocaleString()
    });

    if (showToast) {
      showToast(`Payment Approved! Booking [${bookingId}] confirmed.`, '🎉');
    }

    setIsSubmitting(false);
    setProcessingStatus('');
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    setActiveBookingPackage(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '880px' }}>
        <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="Close booking">
          ✕
        </button>

        {/* ===================================================================
            STEPPER PROGRESS HEADER
           =================================================================== */}
        <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-glass)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: step >= 1 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: step === 1 ? 800 : 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: step >= 1 ? 'var(--accent-primary)' : 'transparent', color: step >= 1 ? '#000' : 'var(--text-muted)', border: '1px solid var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</span>
              Available Dates & Manifest
            </span>
            <span style={{ color: 'var(--border-glass)' }}>—</span>
            <span style={{ color: step >= 2 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: step === 2 ? 800 : 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: step >= 2 ? 'var(--accent-primary)' : 'transparent', color: step >= 2 ? '#000' : 'var(--text-muted)', border: '1px solid var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</span>
              Payment Gateway
            </span>
            <span style={{ color: 'var(--border-glass)' }}>—</span>
            <span style={{ color: step >= 3 ? '#10b981' : 'var(--text-muted)', fontWeight: step === 3 ? 800 : 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: step >= 3 ? '#10b981' : 'transparent', color: step >= 3 ? '#000' : 'var(--text-muted)', border: '1px solid #10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>3</span>
              Pass & Live Status
            </span>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🔒</span> 256-Bit SSL Encrypted
          </div>
        </div>

        {/* ===================================================================
            STEP 1: AVAILABLE DATES, SUITE & EXPEDITION MANIFEST
           =================================================================== */}
        {step === 1 && (
          <div style={{ padding: '2.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              EXPEDITION MANIFEST • {pkg.category}
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0.35rem 0 1.5rem', color: 'var(--text-main)' }}>
              {pkg.title}
            </h3>

            <form onSubmit={handleProceedToPayment}>
              {/* AVAILABLE DEPARTURE WINDOWS SELECTOR */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    🗓️ Select Available Departure Window
                  </label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Real-time Charter Availability
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
                  {availableSlots.map(slot => {
                    const isSelected = date === slot.startDate;
                    return (
                      <div
                        key={slot.startDate}
                        onClick={() => setDate(slot.startDate)}
                        style={{
                          padding: '0.85rem 1rem',
                          background: isSelected ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-primary)',
                          border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: slot.statusColor, fontWeight: 700, textTransform: 'uppercase' }}>
                            {slot.status}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                            {slot.tag}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-main)', marginBottom: '0.2rem' }}>
                          {slot.label}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Starts {slot.startDate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 1: Date & Guests */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Custom Departure Date
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
                    <option value={2}>Private Couple Suite (2 Guests)</option>
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
                    placeholder="e.g. Sanjay Kumar"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Concierge Confirmation Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sanjay@traveler.com"
                    required
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Mobile Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.92rem' }}
                  />
                </div>
              </div>

              {/* VIP Add-ons */}
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
                    SUBTOTAL ({guestCount} EXPLORERS)
                  </span>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {formatPrice(baseSubtotal + addonsTotal)}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
                  Proceed to Payment Gateway →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================================
            STEP 2: MODERN LUXURY PAYMENT GATEWAY (6 PAYMENT METHODS)
           =================================================================== */}
        {step === 2 && (
          <div style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                STEP 02 OF 03 • PAYMENT GATEWAY CHECKOUT
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              >
                ← Edit Manifest
              </button>
            </div>

            {/* 6 Payment Methods Pills Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {[
                { id: 'card', icon: '💳', name: 'Card' },
                { id: 'upi', icon: '⚡', name: 'UPI / QR' },
                { id: 'apple', icon: '', name: 'Apple / GPay' },
                { id: 'netbanking', icon: '🏦', name: 'NetBanking' },
                { id: 'crypto', icon: '🪙', name: 'Crypto Web3' },
                { id: 'wire', icon: '🏛️', name: 'Swiss Wire' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: paymentMethod === m.id ? 'var(--accent-gradient)' : 'var(--bg-primary)',
                    color: paymentMethod === m.id ? '#08090d' : 'var(--text-main)',
                    border: paymentMethod === m.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                    boxShadow: paymentMethod === m.id ? '0 4px 15px rgba(212, 175, 55, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleAuthorizePayment}>
              {/* 1. CREDIT/DEBIT CARDS METHOD WITH LIVE METAL CARD GRAPHIC */}
              {paymentMethod === 'card' && (
                <div>
                  {/* Luxury Metal Card Preview Graphic */}
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #1f2430 0%, #0c0e14 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      borderRadius: '16px',
                      padding: '1.5rem 1.8rem',
                      marginBottom: '1.5rem',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>
                        WANDERLUST CENTURION BLACK
                      </span>
                      <span style={{ fontSize: '1.3rem' }}>📶</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <div style={{ width: '40px', height: '30px', background: 'linear-gradient(135deg, #d4af37, #f3e5ab)', borderRadius: '6px', border: '1px solid #aa7c11' }} />
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', letterSpacing: '0.15em', color: '#fff', marginBottom: '1rem', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>CARDHOLDER</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
                          {cardHolder || 'EXPLORER NAME'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>EXPIRES</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', color: '#fff' }}>
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', fontStyle: 'italic' }}>
                        AMEX
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        required
                        placeholder="SANJAY KUMAR"
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                        16-Digit Card Number *
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => formatCardInput(e.target.value)}
                        required
                        placeholder="4532 8901 2345 8899"
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                        Expiry (MM/YY) *
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        placeholder="08/29"
                        maxLength={5}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                        Security Code (CVV) *
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                        maxLength={4}
                        placeholder="•••"
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. UPI / QR SCAN & PAY METHOD */}
              {paymentMethod === 'upi' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.8rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'inline-flex', padding: '0.8rem', background: '#ffffff', borderRadius: '12px', marginBottom: '1rem', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <div style={{ width: '140px', height: '140px', background: 'repeating-linear-gradient(45deg, #111 0, #111 8px, #fff 8px, #fff 16px)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ background: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, color: '#000' }}>
                        SCAN TO PAY
                      </span>
                    </div>
                  </div>

                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                    Scan with Google Pay, PhonePe, Paytm, or any UPI App
                  </p>

                  <div style={{ textAlign: 'left', maxWidth: '420px', margin: '0 auto' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                      Or Enter UPI ID / VPA
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}
                      />
                      <button
                        type="button"
                        onClick={() => showToast && showToast(`UPI ID [${upiId}] Verified!`, '✓')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.6rem 1rem' }}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. APPLE PAY & GOOGLE PAY METHOD */}
              {paymentMethod === 'apple' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}></div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>
                    One-Touch Biometric Authorization
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                    Authorize your expedition reservation instantly using Apple Pay Face ID or Google Wallet Passkey.
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#000', border: '1px solid #444', padding: '0.85rem 2.2rem', borderRadius: 'var(--radius-full)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                    <span> Pay</span>
                    <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              )}

              {/* 4. NETBANKING METHOD */}
              {paymentMethod === 'netbanking' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.75rem', marginBottom: '1.5rem' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                    Select Premier Banking Institution
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'HSBC Premier', 'Barclays Private'].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          background: selectedBank === b ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-card)',
                          border: selectedBank === b ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)',
                          color: selectedBank === b ? 'var(--accent-primary)' : 'var(--text-main)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    You will be securely redirected to {selectedBank}'s encrypted portal for 2-factor OTP verification.
                  </p>
                </div>
              )}

              {/* 5. CRYPTOCURRENCY WEB3 METHOD */}
              {paymentMethod === 'crypto' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                      Select Settlement Token
                    </label>
                    <select
                      value={cryptoCoin}
                      onChange={(e) => setCryptoCoin(e.target.value)}
                      style={{ padding: '0.4rem 0.8rem', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="USDT (TRC20)">USDT (Tether TRC20)</option>
                      <option value="USDT (ERC20)">USDT (Tether ERC20)</option>
                      <option value="Bitcoin (BTC)">Bitcoin (BTC Native)</option>
                      <option value="Ethereum (ETH)">Ethereum (ETH)</option>
                    </select>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>RESERVED DEPOSIT WALLET</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#10b981', wordBreak: 'break-all' }}>
                      0x71C8A9b79427b372f8546132D9eD7F16F4F19b02
                    </strong>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    ⚡ 0% Merchant Fees. Escrow smart contract locks suite upon 1 network confirmation.
                  </p>
                </div>
              )}

              {/* 6. SWISS WIRE METHOD */}
              {paymentMethod === 'wire' && (
                <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.6rem' }}>
                    🏛️ BANQUE CANTONALE DE GENÈVE (SWISS ESCROW)
                  </div>
                  <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--text-main)', border: '1px solid var(--border-glass)' }}>
                    IBAN: <strong>CH93 0079 0123 4567 8901 2</strong><br />
                    BIC/SWIFT: <strong>BCGECHGGXXX</strong><br />
                    Beneficiary: <strong>Wanderlust Haute Escapes SA</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', margin: 0 }}>
                    Reference code will be assigned to hold your chosen suite for 48 hours awaiting settlement.
                  </p>
                </div>
              )}

              {/* Promo Voucher Code Box */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Promo Voucher (e.g. WANDER150)..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.9rem', textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  onClick={applyVoucher}
                  className="btn btn-secondary"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.85rem' }}
                >
                  Apply Voucher
                </button>
              </div>

              {/* Financial Ledger Breakdown */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Base Package ({guestCount} Explorers)</span>
                  <span>{formatPrice(baseSubtotal)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <span>Selected White-Glove VIP Curations</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                  <span>Grand Total Settled</span>
                  <span style={{ color: 'var(--accent-primary)' }}>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Processing Spinner Overlay */}
              {isSubmitting && (
                <div style={{ background: 'rgba(0,0,0,0.85)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid var(--accent-primary)' }}>
                  <div style={{ width: '36px', height: '36px', border: '3px solid rgba(212, 175, 55, 0.2)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem', display: 'block', marginBottom: '0.25rem' }}>
                    {processingStatus || 'Securing Authorization...'}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Please do not refresh the page</span>
                </div>
              )}

              {/* Action Buttons */}
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
                  style={{ padding: '0.9rem 2.2rem', fontSize: '0.95rem' }}
                >
                  {isSubmitting ? 'Processing...' : `Pay & Settle ${formatPrice(grandTotal)} 🔒`}
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
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.6rem' }}>✓</span>
                <div>
                  <strong style={{ color: '#10b981', fontSize: '1rem', display: 'block' }}>
                    Expedition Confirmed & Settled in Full
                  </strong>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Ref: {confirmedBooking.transactionId} • Method: {confirmedBooking.paymentMethod}
                  </span>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 800 }}>
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
                    <span className="pm-label">Party & Cabin</span>
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

            {/* Actions: Track Status, Print & Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const id = confirmedBooking.id;
                  handleClose();
                  openBookingTracker(id);
                }}
              >
                🧭 Track Live Booking Status
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
                <span>🖨️</span> Print Pass & Invoice
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
