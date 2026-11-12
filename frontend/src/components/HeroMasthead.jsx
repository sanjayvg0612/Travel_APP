import React from 'react';
import { VibeMatrix } from './VibeMatrix';

export const HeroMasthead = () => {
  return (
    <section className="hero-editorial" id="hero-banner">
      <div className="hero-editorial-inner">
        <div className="hero-issue-stamp">
          <span>VOL. VIII • DISPATCHES FOR DISCERNING EXPLORERS</span>
        </div>

        <h1 className="hero-editorial-title">
          The World Awaits Those Who<br />
          <span className="italic-flourish">Travel With Soul & Stillness</span>
        </h1>

        <p className="hero-editorial-lead">
          Forget commercial tourist itineraries. We curate solitary Greek wine cellars, private bullet trains through snow-capped Japanese mountain passes, and private Riva yacht voyages along the Amalfi Riviera.
        </p>

        {/* 3-Axis Psychological Travel Dial */}
        <VibeMatrix />
      </div>
    </section>
  );
};
