import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';

export const NewsletterSection = () => {
  const { submitNewsletter } = useTravel();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitting(true);

    const res = await submitNewsletter(email);
    if (res?.success) {
      setVoucher(res.voucherCode || 'WANDER150');
    }
    setIsSubmitting(false);
  };

  const handleCopy = () => {
    if (voucher) {
      navigator.clipboard.writeText(voucher);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <section style={{ padding: '6rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-glass)', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ maxWidth: '880px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid var(--border-glass)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', marginBottom: '1.5rem' }}>
          <span>⚜️</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            PRIVATE EXPLORERS CLUB DISPATCHES
          </span>
        </div>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.6rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
          Unlock Unlisted Charters & Receive a <span style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>$150 Credit</span>
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          Subscribe to our fortnightly dispatch for private wine cellar invitations in Santorini, solitary bullet-train routes across Japan, and exclusive suite upgrades.
        </p>

        {!voucher ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '520px', margin: '0 auto', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter your confidential email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: '1 1 280px',
                padding: '0.9rem 1.25rem',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                fontSize: '0.95rem'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ padding: '0.9rem 1.75rem' }}
            >
              {isSubmitting ? 'Joining Club...' : 'Claim $150 Credit ✉️'}
            </button>
          </form>
        ) : (
          <div
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--accent-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem',
              maxWidth: '540px',
              margin: '0 auto',
              boxShadow: 'var(--shadow-luxe)'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎟️</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--accent-primary)', margin: '0 0 0.5rem' }}>
              Welcome to the Royal Explorers Club!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Your $150 welcome voucher has been officially authorized. Apply it at booking checkout or show it to your personal concierge:
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'var(--bg-primary)',
                border: '1px dashed var(--accent-primary)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem'
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.2em' }}>
                {voucher}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: 'var(--accent-primary)',
                  color: 'var(--bg-primary)',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Valid for any 2026 curated grand expedition.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

