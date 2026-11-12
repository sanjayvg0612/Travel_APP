import React, { useState, useMemo } from 'react';
import { useTravel } from '../context/TravelContext';

export const VibeMatrix = () => {
  const { packages } = useTravel();

  const [pace, setPace] = useState(2);
  const [scenery, setScenery] = useState(10);
  const [social, setSocial] = useState(3);

  // Real-time Euclidean distance harmonic calculation
  const matchResult = useMemo(() => {
    if (!packages || packages.length === 0) {
      return { best: null, score: 95 };
    }

    let best = packages[0];
    let minDistance = Infinity;

    packages.forEach(pkg => {
      const v = pkg.vibe || { pace: 5, scenery: 8, social: 5 };
      const dist = Math.sqrt(
        Math.pow(v.pace - pace, 2) +
        Math.pow(v.scenery - scenery, 2) +
        Math.pow(v.social - social, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        best = pkg;
      }
    });

    const maxDist = Math.sqrt(Math.pow(9, 2) * 3);
    const score = Math.max(76, Math.round(100 - (minDistance / maxDist) * 30));

    return { best, score };
  }, [pace, scenery, social, packages]);

  const handleReveal = () => {
    if (!matchResult.best) return;
    const el = document.getElementById(`package-${matchResult.best.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.outline = '3px solid var(--accent-primary)';
      el.style.boxShadow = 'var(--accent-glow)';
      setTimeout(() => {
        el.style.outline = '';
        el.style.boxShadow = '';
      }, 3000);
    }
  };

  return (
    <div className="vibe-matrix-card" id="vibe-matrix-anchor">
      <div className="vibe-matrix-header">
        <div className="vibe-title">
          <span>🧭</span>
          <span>The Wanderlust Vibe Matrix™</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ALGORITHMIC EXPEDITION HARMONIZER
        </span>
      </div>

      <div className="vibe-sliders-grid">
        <div className="vibe-slider-col">
          <label htmlFor="react-vibe-pace">Expedition Pace</label>
          <input
            id="react-vibe-pace"
            type="range"
            className="vibe-custom-slider"
            min="1"
            max="10"
            value={pace}
            onChange={(e) => setPace(Number(e.target.value))}
          />
          <div className="vibe-indicator-row">
            <span>Unhurried Slow</span>
            <span className="active-val">Pace: {pace}/10</span>
            <span>High Octane</span>
          </div>
        </div>

        <div className="vibe-slider-col">
          <label htmlFor="react-vibe-scenery">Landscape Essence</label>
          <input
            id="react-vibe-scenery"
            type="range"
            className="vibe-custom-slider"
            min="1"
            max="10"
            value={scenery}
            onChange={(e) => setScenery(Number(e.target.value))}
          />
          <div className="vibe-indicator-row">
            <span>Bamboo Grove</span>
            <span className="active-val">Scenery: {scenery}/10</span>
            <span>Glacial Summit</span>
          </div>
        </div>

        <div className="vibe-slider-col">
          <label htmlFor="react-vibe-social">Social Atmosphere</label>
          <input
            id="react-vibe-social"
            type="range"
            className="vibe-custom-slider"
            min="1"
            max="10"
            value={social}
            onChange={(e) => setSocial(Number(e.target.value))}
          />
          <div className="vibe-indicator-row">
            <span>Solitary Hermit</span>
            <span className="active-val">Serenity: {social}/10</span>
            <span>Cultural Tribe</span>
          </div>
        </div>
      </div>

      <div className="vibe-matrix-actions">
        <div className="vibe-match-preview">
          <div className="match-pulse" />
          <div className="match-text">
            Matched Journey: <strong>{matchResult.best ? matchResult.best.title : 'Curated Expedition'}</strong>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
              {matchResult.score}% Harmonious Match
            </span>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleReveal}>
          Reveal Matched Journey →
        </button>
      </div>
    </div>
  );
};
