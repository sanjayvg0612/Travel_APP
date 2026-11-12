import React, { useState, useEffect } from 'react';

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Return to Horizon Top"
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 900,
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-glass)',
        color: 'var(--accent-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-luxe)',
        transition: 'all var(--transition-smooth)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'var(--border-glass)';
      }}
    >
      ↑
    </button>
  );
};
