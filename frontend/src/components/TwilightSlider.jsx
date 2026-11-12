import React, { useState, useRef, useCallback, useEffect } from 'react';

export const TwilightSlider = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 - 100)
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current || !isDraggingRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(5, Math.min(95, rawPct));
    setSliderPos(clamped);
  }, []);

  const onDragStart = (e) => {
    isDraggingRef.current = true;
    const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
    if (clientX !== undefined) handleMove(clientX);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDraggingRef.current) {
        handleMove(e.clientX);
      }
    };
    const handleGlobalTouchMove = (e) => {
      if (isDraggingRef.current && e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };
    const handleGlobalEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchmove', handleGlobalTouchMove);
    window.addEventListener('touchend', handleGlobalEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [handleMove]);

  return (
    <section className="container" id="twilight-anchor" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          ATMOSPHERIC PERSPECTIVES
        </span>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', margin: '0.5rem 0' }}>
          Drag The Horizon: Daybreak to Celestial Twilight
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Experience how our sanctuaries shift from sun-drenched golden warmth to starry Mediterranean night skies.
        </p>
      </div>

      <div
        className="twilight-container"
        ref={containerRef}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        {/* Day Layer */}
        <div className="twilight-layer day-layer" />

        {/* Night Layer (Clipped via clipPath) */}
        <div
          className="twilight-layer night-layer"
          style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
        />

        <span className="twilight-label-day">☀️ SUNBURST CALDERA (14:00)</span>
        <span className="twilight-label-night">🌙 MIDNIGHT CELESTIAL (23:00)</span>

        {/* Divider bar & Drag handle */}
        <div className="twilight-divider" style={{ left: `${sliderPos}%` }} />
        <div
          className="twilight-handle"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          title="Drag to reveal day & night"
        >
          ⇄
        </div>
      </div>
    </section>
  );
};
