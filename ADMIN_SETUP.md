# Admin Panel Setup Guide

## Step 1: Create Admin User in Firebase Console

Since Firebase doesn't allow creating users programmatically without admin privileges, you need to create the admin user manually first.

### Option A: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **uae-discount-hub-15fd7**
3. Navigate to **Authentication** → **Users** tab
4. Click **Add User**
5. Enter:
   - **Email:** `admin@uaediscounthub.com`
   - **Password:** (Choose a strong password - you'll use this to login)
6. Click **Add User**
7. **Copy the UID** that Firebase generates (you'll need it for Step 2)

### Option B: Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create user (replace YOUR_PASSWORD)
firebase auth:import users.json --project uae-discount-hub-15fd7
```

Create `users.json`:
```json
{
  "users": [{
    "localId": "admin-user-id",
    "email": "admin@uaediscounthub.com",
    "passwordHash": "YOUR_HASHED_PASSWORD"
  }]
}
```

---

## Step 2: Add Admin Role to Firestore

After creating the user in Firebase Auth, you need to give them admin privileges in Firestore.

### Using Firebase Console:

1. Go to **Firestore Database** in Firebase Console
2. Click **Start Collection**
3. Collection ID: `admins`
4. Document ID: **[Paste the UID from Step 1]**
5. Add fields:
   ```
   uid: [The UID from Step 1]
   email: admin@uaediscounthub.com
   role: admin
   createdAt: [Click "Add field" → Select "timestamp" type → Click "Set to current time"]
   lastLogin: [Same as above]
   ```
6. Click **Save**

### Using the Admin Script:

Alternatively, after logging in with the created user, you can run:

```typescript
import { createAdminUser } from '@/lib/firebase/admin-auth';

// Call this once with your UID
await createAdminUser('YOUR_UID_FROM_STEP_1', 'admin@uaediscounthub.com', 'admin');
```

---

## Step 3: Test the Login

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Navigate to: **http://localhost:3000/admin/login**

3. Login with:
   - **Email:** admin@uaediscounthub.com
   - **Password:** [The password you set in Step 1]

4. You should be redirected to: **http://localhost:3000/admin/dashboard**

---

## Troubleshooting

### "Firebase: Error (auth/user-not-found)"
- The user doesn't exist in Firebase Authentication
- Go back to Step 1 and create the user

### "No account found with this email"
- Same as above - create user in Firebase Console

### Login successful but redirected back to login
- The admin role is not set in Firestore
- Go to Firestore and add the admin document (Step 2)

### "Too many failed login attempts"
- Wait 15 minutes or reset in Firebase Console

---

## Security Notes

✅ **Password Requirements:**
- Minimum 6 characters (Firebase requirement)
- Recommended: 12+ characters with mix of letters, numbers, symbols

✅ **Best Practices:**
- Change your password after first login
- Enable 2FA in Firebase Console (under Authentication → Sign-in method)
- Monitor failed login attempts in Firebase Console

---

## Next Steps

After successful login:
1. ✅ Explore the admin dashboard
2. 📦 Add your first product (coming next)
3. 🏷️ Create promotional deals
4. 📊 Monitor price updates

---

## Quick Start Checklist

- [ ] Created admin user in Firebase Authentication
- [ ] Added admin role document in Firestore `admins` collection
- [ ] Tested login at `/admin/login`
- [ ] Successfully accessed `/admin/dashboard`
- [ ] Changed default password (recommended)
