
'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Guest } from '@/types';
import { guests as mockGuests } from '@/lib/mock-data';

interface GuestContextType {
  allGuests: Guest[];
  loading: boolean;
  addGuests: (newGuests: Guest[]) => void;
  updateGuest: (updatedGuest: Guest) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedGuests = localStorage.getItem('allGuests');
      if (storedGuests) {
        setAllGuests(JSON.parse(storedGuests));
      } else {
        const initialGuests = mockGuests();
        setAllGuests(initialGuests);
        localStorage.setItem('allGuests', JSON.stringify(initialGuests));
      }
    } catch (error) {
      console.error("Failed to load guests from localStorage", error);
      // Fallback to mock data if localStorage fails
      setAllGuests(mockGuests());
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocalStorage = (guests: Guest[]) => {
    localStorage.setItem('allGuests', JSON.stringify(guests));
  };

  const addGuests = (newGuests: Guest[]) => {
    setAllGuests(prevGuests => {
      const updatedGuests = [...prevGuests, ...newGuests];
      updateLocalStorage(updatedGuests);
      return updatedGuests;
    });
  };

  const updateGuest = (updatedGuest: Guest) => {
    setAllGuests(prevGuests => {
      const updatedGuests = prevGuests.map(g => g.id === updatedGuest.id ? updatedGuest : g);
      updateLocalStorage(updatedGuests);
      return updatedGuests;
    });
  };

  return (
    <GuestContext.Provider value={{ allGuests, loading, addGuests, updateGuest }}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuestContext() {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuestContext must be used within a GuestProvider');
  }
  return context;
}
