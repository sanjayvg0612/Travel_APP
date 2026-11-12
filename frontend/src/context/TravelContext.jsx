import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENCIES, SEED_PACKAGES, SEED_DESTINATIONS } from '../data/travelData';
import { soundscapes } from '../utils/soundscapes';
import { apiFetch, getApiBaseUrl } from '../utils/apiConfig';

const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wanderlust_theme') || 'obsidian';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wanderlust_theme', theme);
  }, [theme]);

  // 2. Currency State
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('wanderlust_currency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('wanderlust_currency', currency);
  }, [currency]);

  const formatPrice = (usdAmount) => {
    const config = CURRENCIES[currency] || CURRENCIES.USD;
    const converted = Math.round(usdAmount * config.rate);
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  // 3. Soundscape State
  const [isAtmospherePlaying, setIsAtmospherePlaying] = useState(false);

  const toggleAtmosphere = () => {
    const playing = soundscapes.toggle();
    setIsAtmospherePlaying(playing);
  };

  // 4. Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wanderlust_wishlist')) || [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (pkgId) => {
    setWishlist(prev => {
      const next = prev.includes(pkgId) ? prev.filter(id => id !== pkgId) : [...prev, pkgId];
      localStorage.setItem('wanderlust_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (pkgId) => wishlist.includes(pkgId);

  // 5. Passport Stamps State
  const [stamps, setStamps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wanderlust_stamps')) || ['JTR-GRE-01'];
    } catch {
      return ['JTR-GRE-01'];
    }
  });

  const addStamp = (stampCode) => {
    setStamps(prev => {
      if (prev.includes(stampCode)) return prev;
      const next = [...prev, stampCode];
      localStorage.setItem('wanderlust_stamps', JSON.stringify(next));
      return next;
    });
  };

  const hasStamp = (stampCode) => stamps.includes(stampCode);

  // 6. Data & Backend Sync State
  const [destinations, setDestinations] = useState(SEED_DESTINATIONS);
  const [packages, setPackages] = useState(SEED_PACKAGES);
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadApiData = async () => {
      try {
        const [destRes, pkgRes] = await Promise.all([
          apiFetch('/api/destinations'),
          apiFetch('/api/packages')
        ]);
        if (destRes.ok && pkgRes.ok) {
          const destJson = await destRes.json();
          const pkgJson = await pkgRes.json();
          if (isMounted) {
            if (destJson?.data && destJson.data.length > 0) {
              setDestinations(destJson.data);
            }
            if (pkgJson?.data && pkgJson.data.length > 0) {
              setPackages(pkgJson.data);
            }
            setBackendOnline(true);
          }
        }
      } catch {
        // Backend offline: gracefully keep seed data active
        if (isMounted) setBackendOnline(false);
      }
    };

    loadApiData();
    return () => { isMounted = false; };
  }, []);

  const submitBooking = async (bookingData) => {
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        const result = await res.json();
        return { success: true, booking: result.data || result };
      }
    } catch {
      // Backend offline fallback
    }
    return { success: false };
  };

  // 7. Active Modals State
  const [activeItineraryPackage, setActiveItineraryPackage] = useState(null);
  const [activeBookingPackage, setActiveBookingPackage] = useState(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <TravelContext.Provider
      value={{
        theme,
        setTheme,
        currency,
        setCurrency,
        formatPrice,
        isAtmospherePlaying,
        toggleAtmosphere,
        wishlist,
        toggleWishlist,
        isWishlisted,
        stamps,
        addStamp,
        hasStamp,
        activeItineraryPackage,
        setActiveItineraryPackage,
        activeBookingPackage,
        setActiveBookingPackage,
        isPassportOpen,
        setIsPassportOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        destinations,
        packages,
        backendOnline,
        submitBooking,
        apiBaseUrl: getApiBaseUrl()
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravel = () => {
  const context = useContext(TravelContext);
  if (!context) throw new Error('useTravel must be used within TravelProvider');
  return context;
};
