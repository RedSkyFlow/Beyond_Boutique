'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Guest } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, Timestamp, writeBatch } from 'firebase/firestore';
import { useAuth } from './auth-context';

// TODO: In a real app, this would come from the user's assigned hotel or a selector
const CURRENT_HOTEL_ID = 'last-word-franschhoek';

interface GuestContextType {
  allGuests: Guest[];
  loading: boolean;
  addGuests: (newGuests: Guest[]) => Promise<void>;
  updateGuest: (updatedGuest: Guest) => Promise<void>;
  updateOrAddGuests: (guestsFromImport: Guest[]) => Promise<{ updatedCount: number; newCount: number }>;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export function GuestProvider({ children }: { children: ReactNode }) {
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setAllGuests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'guests'),
      where('hotelId', '==', CURRENT_HOTEL_ID)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guests: Guest[] = [];
      snapshot.forEach((doc) => {
        guests.push({ id: doc.id, ...doc.data() } as Guest);
      });
      setAllGuests(guests);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching guests: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addGuests = async (newGuests: Guest[]) => {
    const batch = writeBatch(db);

    newGuests.forEach(guest => {
      const docRef = doc(collection(db, "guests"));
      batch.set(docRef, {
        ...guest,
        hotelId: CURRENT_HOTEL_ID,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    });

    await batch.commit();
  };

  const updateGuest = async (updatedGuest: Guest) => {
    if (!updatedGuest.id) return;

    const guestRef = doc(db, 'guests', updatedGuest.id);
    // Exclude id from the update data
    const { id, ...data } = updatedGuest;

    await updateDoc(guestRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  };

  const updateOrAddGuests = async (guestsFromImport: Guest[]) => {
    let updatedCount = 0;
    let newCount = 0;

    // This is a naive implementation for the prototype. 
    // In production, this should be a Cloud Function to handle large datasets and avoid client-side complexity.

    const batch = writeBatch(db);
    const guestMap = new Map(allGuests.map(g => [g.email.toLowerCase(), g]));

    for (const importGuest of guestsFromImport) {
      const existingGuest = guestMap.get(importGuest.email.toLowerCase());

      if (existingGuest) {
        const guestRef = doc(db, 'guests', existingGuest.id);
        batch.update(guestRef, {
          onSiteActivity: importGuest.onSiteActivity,
          age: existingGuest.age || importGuest.age,
          gender: existingGuest.gender || importGuest.gender,
          dateOfBirth: existingGuest.dateOfBirth || importGuest.dateOfBirth,
          homeTown: existingGuest.homeTown || importGuest.homeTown,
          updatedAt: Timestamp.now()
        });
        updatedCount++;
      } else {
        const docRef = doc(collection(db, "guests"));
        batch.set(docRef, {
          ...importGuest,
          hotelId: CURRENT_HOTEL_ID,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        newCount++;
      }
    }

    await batch.commit();
    return { updatedCount, newCount };
  };

  return (
    <GuestContext.Provider value={{ allGuests, loading, addGuests, updateGuest, updateOrAddGuests }}>
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
