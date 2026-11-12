import React from 'react';
import { TravelProvider } from './context/TravelContext';
import { Navbar } from './components/Navbar';
import { HeroMasthead } from './components/HeroMasthead';
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

export const App = () => {
  return (
    <TravelProvider>
      <Navbar />

      <main>
        <HeroMasthead />
        <TwilightSlider />
        <DestinationsGrid />
        <PackagesGrid />
        <ReviewsSection />
        <NewsletterSection />
      </main>

      <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border-glass)', padding: '4rem 0 2rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div className="brand-logo">
            <div className="compass-seal">⚜️</div>
            <span>WANDER<span>LUST</span></span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            &copy; 2026 Wanderlust Haute Escapes Ltd. All coordinates verified.
          </p>
        </div>
      </footer>

      {/* Interactive Modals */}
      <ItineraryModal />
      <BoardingPassModal />
      <PassportModal />
      <WishlistDrawer />
      <BookingLookupModal />
    </TravelProvider>
  );
};

export default App;
