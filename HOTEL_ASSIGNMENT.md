# Dynamic Hotel Assignment - Implementation Guide

## ✅ What's Been Implemented

The app now supports **dynamic hotel assignments** per user instead of hardcoded hotel IDs.

### Changes Made:

1. **AuthContext** (`src/context/auth-context.tsx`)
   - Added `hotelId` to auth state
   - Fetches hotel assignment from Firestore `users` collection
   - Falls back to `'last-word-franschhoek'` if no profile exists

2. **GuestContext** (`src/context/guest-context.tsx`)
   - Removed hardcoded `CURRENT_HOTEL_ID`
   - Now uses `hotelId` from `AuthContext`
   - Filters guests based on user's assigned hotel

3. **Security Rules** (`firestore.rules`)
   - Updated to query user profile for hotel assignment
   - Maintains fallback for users without profiles

4. **User Management** (`src/lib/user-management.ts`)
   - Utility functions for creating user profiles

## 🏨 How Hotel Assignment Works

### User Profile Structure
```javascript
// Collection: users/{userId}
{
  email: "manager@lastword.com",
  hotelId: "last-word-franschhoek",
  role: "staff" | "admin",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Flow:
1. User logs in via Firebase Auth
2. `AuthContext` fetches their profile from `users/{userId}`
3. Extracts `hotelId` from profile
4. `GuestContext` filters guests by this `hotelId`
5. All new guests are tagged with user's `hotelId`

## 🛠️ Setting Up User Profiles

### Option 1: Firebase Console (Manual)
1. Go to Firestore Database
2. Create collection: `users`
3. Add document with ID = Firebase Auth UID
4. Add fields: `email`, `hotelId`, `role`

### Option 2: Browser Console Script
```javascript
// 1. Get your user ID
firebase.auth().currentUser.uid

// 2. Go to Firestore in console, create document:
// Collection: users
// Document ID: <your-user-id>
// Fields:
//   - email: "your@email.com"
//   - hotelId: "last-word-franschhoek"
//   - role: "staff"
//   - createdAt: (timestamp)
//   - updatedAt: (timestamp)
```

### Option 3: Cloud Function (Production)
```typescript
// Deploy this as a Cloud Function triggered on user signup
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    hotelId: 'last-word-franschhoek', // or determine based on signup context
    role: 'staff',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
```

## 🎯 Next Steps

### Immediate:
- [ ] Create user profile for your current logged-in user
- [ ] Test multi-hotel access by creating profiles with different `hotelId` values
- [ ] Update security rules in Firebase Console

### Future Enhancements:
- [ ] Admin panel to manage user-hotel assignments
- [ ] Hotel selector UI for users managing multiple hotels
- [ ] Invitation system with automatic hotel assignment
- [ ] Role-based permissions (admin vs staff)

## 📋 Testing

1. **Create a test user profile:**
   - Get your user ID from Firebase Auth console
   - Create document in `users/{userId}` with `hotelId: "last-word-franschhoek"`

2. **Verify it works:**
   - Refresh the app
   - You should see only guests for your assigned hotel
   - Import CSV - guests should be tagged with your `hotelId`

3. **Test multi-tenancy:**
   - Create another user with different `hotelId`
   - Verify they can't see your hotel's guests

## 🔒 Security

The Firestore rules now enforce:
- Users can only read/write guests from their assigned hotel
- `hotelId` cannot be changed after guest creation
- User profiles are read-only (only admins can modify via Cloud Functions)
