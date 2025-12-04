import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Creates a user profile in Firestore with hotel assignment
 * Call this after user signs up or when setting up a new user
 */
export async function createUserProfile(
    userId: string,
    email: string,
    hotelId: string,
    role: 'admin' | 'staff' = 'staff'
) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
        email,
        hotelId,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

/**
 * Example usage in a Cloud Function or admin script:
 * 
 * import { createUserProfile } from '@/lib/user-management';
 * 
 * // After user signs up
 * await createUserProfile(
 *   user.uid, 
 *   'manager@lastword.com', 
 *   'last-word-franschhoek',
 *   'admin'
 * );
 */
