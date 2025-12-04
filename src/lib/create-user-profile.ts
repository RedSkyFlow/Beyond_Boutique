/**
 * Admin Script: Create User Profile
 * 
 * Use this script to assign hotels to users.
 * In production, this would be done via Cloud Functions or an admin panel.
 * 
 * HOW TO USE:
 * 1. Make sure you're logged in to your app
 * 2. Open browser console (F12)
 * 3. Copy-paste this script and run it
 * 4. Replace 'YOUR_USER_ID' and 'YOUR_HOTEL_ID' with actual values
 */

import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function createUserProfileInConsole() {
    // Get current user ID from auth (you'll need to replace this)
    const userId = 'YOUR_USER_ID_HERE'; // Replace with actual Firebase Auth UID
    const hotelId = 'last-word-franschhoek'; // Or other hotel ID
    const email = 'user@example.com'; // User's email

    try {
        await setDoc(doc(db, 'users', userId), {
            email: email,
            hotelId: hotelId,
            role: 'staff',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('✅ User profile created successfully!');
        console.log(`User ${userId} assigned to hotel: ${hotelId}`);
    } catch (error) {
        console.error('❌ Error creating user profile:', error);
    }
}

// Quick version for browser console:
// window.createUserProfile = async function(userId, hotelId, email) {
//   const { db } = await import('./firebase');
//   const { doc, setDoc } = await import('firebase/firestore');
//   await setDoc(doc(db, 'users', userId), {
//     email, hotelId, role: 'staff',
//     createdAt: new Date(), updatedAt: new Date()
//   });
//   console.log('Profile created!');
// }
