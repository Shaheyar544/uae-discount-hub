# Firebase Setup Instructions

## Step 1: Create `.env.local` file

Create a new file at the root: `c:\Users\shahe\OneDrive\Documents\Affliate Marketing\uae-discount-hub\.env.local`

Copy and paste this content:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCyCOIZFUa2Q6afRqJooJTso_cUfIeJ4Tc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=uae-discount-hub.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=uae-discount-hub
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=uae-discount-hub.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=920298316310
NEXT_PUBLIC_FIREBASE_APP_ID=1:920298316310:web:ea2d2fbd7e2796a47e8b37

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://uaediscounthub.com
NEXT_PUBLIC_SITE_NAME=UAE Discount Hub

# Add your affiliate API keys here when you get them
AMAZON_ACCESS_KEY=your_key_here
AMAZON_SECRET_KEY=your_secret_here
AMAZON_PARTNER_TAG=your_tag_here
```

## Step 2: Restart the dev server

After creating `.env.local`, restart the dev server:
1. Stop the current server (Ctrl+C in the terminal)
2. Run: `npm run dev`

## Step 3: Deploy Firebase Rules

In Firebase Console, you need to deploy the security rules:

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore (rules and indexes)
# - Storage
# - Hosting (optional)

# Deploy rules
firebase deploy --only firestore:rules,storage:rules,firestore:indexes
```

Or manually copy the rules from these files:
- `firestore.rules` → Firebase Console → Firestore Database → Rules
- `storage.rules` → Firebase Console → Storage → Rules
- `firestore.indexes.json` → Firebase Console → Firestore Database → Indexes

Your Firebase is now connected! ✅
