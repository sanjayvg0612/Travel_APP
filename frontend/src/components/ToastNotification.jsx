import React from 'react';
import { useTravel } from '../context/TravelContext';

export const ToastNotification = () => {
  const { toast } = useTravel();

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--accent-primary)',
        borderRadius: 'var(--radius-full)',
        padding: '0.85rem 1.6rem',
        color: 'var(--text-main)',
        boxShadow: 'var(--shadow-luxe)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        animation: 'slideInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '420px'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{toast.icon || '⚜️'}</span>
      <span style={{ fontSize: '0.88rem', fontWeight: 500, fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>
        {toast.message}
      </span>
    </div>
  );
};
