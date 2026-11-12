import React, { useState, useEffect } from 'react';
import { useTravel } from '../context/TravelContext';
import { SEED_REVIEWS } from '../data/travelData';
import { apiFetch } from '../utils/apiConfig';

export const ReviewsSection = () => {
  const { packages, submitReview } = useTravel();
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedTrip, setSelectedTrip] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      try {
        const res = await apiFetch('/api/reviews');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json?.data && json.data.length > 0) {
            setReviews(json.data);
          }
        }
      } catch {
        // Fall back to seed reviews
      }
    };
    loadReviews();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author || !comment) return;
    setIsSubmitting(true);

    const tripTitle = selectedTrip || (packages && packages[0]?.title) || 'Curated Haute Expedition';
    const payload = {
      packageId: packages?.find(p => p.title === tripTitle)?.id || 'general',
      author: author.trim(),
      location: location.trim() || 'Verified Explorer',
      rating: Number(rating),
      trip: tripTitle,
      comment: comment.trim()
    };

    const res = await submitReview(payload);
    if (res?.success && res?.review) {
      setReviews(prev => [res.review, ...prev]);
      setSuccessBanner(true);
      setTimeout(() => setSuccessBanner(false), 5000);
      setAuthor('');
      setLocation('');
      setComment('');
      setIsModalOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <section id="dispatches-section" style={{ padding: '6rem 0', background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              VERIFIED EXPEDITION DISPATCHES
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '0.4rem' }}>
              Chronicles from the Field
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            🖋️ Compose Dispatch
          </button>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              color: '#10b981',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem'
            }}
          >
            <span>⚜️</span>
            <span>Your expedition dispatch was submitted and archived to the Wanderlust travel chronicles!</span>
          </div>
        )}

        {/* Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {reviews.map(rev => (
            <div
              key={rev.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-luxe)',
                position: 'relative'
              }}
            >
              <div>
                {/* Rating Stars & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
                    {'★'.repeat(rev.rating)}
                    {'☆'.repeat(Math.max(0, 5 - rev.rating))}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {rev.date}
                  </span>
                </div>

                {/* Trip Badge */}
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '0.75rem' }}>
                  {rev.trip}
                </div>

                {/* Comment */}
                <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                <img
                  src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={rev.author}
                  style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-primary)' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', margin: 0, fontFamily: 'var(--font-serif)' }}>{rev.author}</h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    📍 {rev.location} • Verified Traveler
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal to Submit Review */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>

              <div style={{ padding: '2.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  EXPEDITION DISPATCH • ARCHIVE ENTRY
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', margin: '0.4rem 0 1.5rem' }}>
                  Chronicle Your Journey
                </h3>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lady Vivienne Montgomery"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                        Home City / Port
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Zurich, Switzerland"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                      Expedition Completed
                    </label>
                    <select
                      value={selectedTrip}
                      onChange={(e) => setSelectedTrip(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)' }}
                    >
                      {(packages || []).map(p => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                      Overall Rating (1 to 5 Stars)
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.6rem',
                            color: star <= rating ? 'var(--accent-primary)' : 'var(--text-muted)',
                            cursor: 'pointer'
                          }}
                        >
                          ★
                        </button>
                      ))}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-primary)', marginLeft: '0.5rem' }}>
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                      Your Review & Dispatches
                    </label>
                    <textarea
                      rows="4"
                      placeholder="Share details regarding your private guides, cliffside accommodations, and memorable moments..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting to Archive...' : 'Submit Dispatch 🖋️'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
