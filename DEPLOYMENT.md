# Deployment Guide - Beyond Boutique

This guide covers how to deploy the Beyond Boutique application to production.

## 1. Prerequisites

- **Firebase Project**: You need a Firebase project with Authentication and Firestore enabled.
- **Hosting Provider**: We recommend **Vercel** for Next.js applications, but you can also use Firebase Hosting.
- **Source Code**: Ensure your code is committed to a Git repository (GitHub, GitLab, etc.).

## 2. Environment Variables

You need to set the following environment variables in your production environment (e.g., Vercel Project Settings).

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |
| `GEMINI_API_KEY` | Google Gemini API Key (for AI predictions) |

**Note:** Do NOT commit your `.env.local` file to version control.

## 3. Firestore Configuration

### Indexes
Firestore will automatically suggest indexes if your queries require them. Check your browser console or Firebase Console for index creation links.

### Security Rules
Ensure your security rules are deployed. You can deploy them using the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Or manually copy the contents of `firestore.rules` to the Firebase Console -> Firestore -> Rules.

## 4. Deploying to Vercel (Recommended)

1.  **Push to GitHub**: Push your code to a GitHub repository.
2.  **Import Project**: Go to [Vercel](https://vercel.com/new) and import your repository.
3.  **Configure Project**:
    *   **Framework Preset**: Next.js
    *   **Root Directory**: `./`
4.  **Environment Variables**: Add all the variables listed in Section 2.
5.  **Deploy**: Click "Deploy".

Vercel will automatically build and deploy your application. Any changes pushed to the `main` branch will trigger a new deployment.

## 5. Deploying to Firebase Hosting

If you prefer to use Firebase Hosting:

1.  **Initialize Firebase**:
    ```bash
    firebase init hosting
    ```
    *   Select your project.
    *   Public directory: `.next` (or follow Next.js Firebase adapter instructions)
    *   Configure as a single-page app: Yes

2.  **Build and Deploy**:
    ```bash
    npm run build
    firebase deploy
    ```

*Note: For Next.js on Firebase, you might need to use `firebase-frameworks` or a dedicated adapter like `next-firebase-hosting` for SSR support.*

## 6. Post-Deployment Setup

1.  **Create Admin User**: Sign up for an account in your deployed app.
2.  **Assign Hotel**: Use the Firebase Console to create a user profile for your admin account in the `users` collection with the correct `hotelId`.
3.  **Import Data**: Use the Import feature to populate the database with initial guest data.

## 7. Troubleshooting

*   **Login Issues**: Check if the "Email/Password" provider is enabled in Firebase Authentication.
*   **Empty Dashboard**: Ensure your user profile has a valid `hotelId` and that there is data in the `guests` collection matching that ID.
*   **AI Errors**: Verify the `GEMINI_API_KEY` is set correctly.
