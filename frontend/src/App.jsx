import React from 'react';
import { TravelProvider } from './context/TravelContext';
import { Navbar } from './components/Navbar';
import { HeroMasthead } from './components/HeroMasthead';
import { VibeMatrix } from './components/VibeMatrix';
import { TwilightSlider } from './components/TwilightSlider';
import { DestinationsGrid } from './components/DestinationsGrid';
import { PackagesGrid } from './components/PackagesGrid';
import { ReviewsSection } from './components/ReviewsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { ItineraryModal } from './components/ItineraryModal';
import { BoardingPassModal } from './components/BoardingPassModal';
import { PassportModal } from './components/PassportModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { BookingLookupModal } from './components/BookingLookupModal';
import { DestinationModal } from './components/DestinationModal';
import { ToastNotification } from './components/ToastNotification';
import { BackToTop } from './components/BackToTop';

export const App = () => {
  return (
    <TravelProvider>
      <Navbar />

      <main>
        <HeroMasthead />

        {/* AI Travel Persona Harmonizer */}
        <section className="container" style={{ padding: '0 2rem 4rem' }}>
          <VibeMatrix />
        </section>

        <DestinationsGrid />
        <TwilightSlider />
        <PackagesGrid />
        <ReviewsSection />
        <NewsletterSection />
      </main>

      {/* Modern Luxury Footer */}
      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-glass)', padding: '5rem 0 2.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            {/* Column 1: Brand */}
            <div>
              <div className="brand-logo" style={{ marginBottom: '1.25rem' }}>
                <div className="compass-seal">⚜️</div>
                <span>WANDER<span>LUST</span></span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Purveyors of private catamaran voyages, solitary cliffside cave suites, and bespoke alpine charters across 7 continents.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>ALB Concierge Operational</span>
              </div>
            </div>

            {/* Column 2: Sanctuaries */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                Sanctuaries
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <li><a href="#destinations-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Santorini Caldera</a></li>
                <li><a href="#destinations-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kyoto Bamboo Groves</a></li>
                <li><a href="#destinations-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Amalfi & Capri Cliffs</a></li>
                <li><a href="#destinations-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Zermatt & Matterhorn</a></li>
                <li><a href="#destinations-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Serengeti Endless Plains</a></li>
              </ul>
            </div>

            {/* Column 3: Expeditions */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                Expedition Categories
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <li><a href="#packages-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Romance & Honeymoon Luxury</a></li>
                <li><a href="#packages-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ancient Cultural Heritage</a></li>
                <li><a href="#packages-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Glacial & Polar Odyssey</a></li>
                <li><a href="#packages-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Private Wilderness Safaris</a></li>
              </ul>
            </div>

            {/* Column 4: Private Concierge */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                Concierge Desk
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1rem' }}>
                24/7 dedicated satellite liaison for private jet charters, sommelier cave tastings, and suite upgrades.
              </p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                concierge@wanderlust.luxury
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              &copy; 2026 Wanderlust Haute Escapes Ltd. All planetary coordinates verified.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Privacy Codex</span>
              <span>Terms of Charter</span>
              <span>Carbon Ledger</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modals & Floating Tools */}
      <ItineraryModal />
      <BoardingPassModal />
      <PassportModal />
      <WishlistDrawer />
      <BookingLookupModal />
      <DestinationModal />
      <ToastNotification />
      <BackToTop />
    </TravelProvider>
  );
};

export default App;
