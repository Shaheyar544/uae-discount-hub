# Admin Panel - Quick Start

## ⚠️ Important Notes

The admin panel structure is currently being set up. You'll notice some files in the `app/admin/` directory.

### Current Status:

✅ **Completed:**
- Admin authentication helpers (`lib/firebase/admin-auth.ts`)
- Login page component (`components/admin/AdminLoginPage.tsx`)
- Route protection middleware (`middleware.ts`)
- Admin dashboard interface

🔨 **In Progress:**
- Fixing layout conflicts for the login page

### Temporary Setup:

For now, the admin login page may show errors. This will be fixed shortly by restructuring the route organization.

### Once Fixed, You Can:

1. **Create Admin User** in Firebase Console:
   - Go to Authentication → Users
   - Add user: `admin@uaediscounthub.com`
   - Set a secure password

2. **Add Admin Role** in Firestore:
   - Go to Firestore → Create collection `admins`
   - Add document with the user's UID
   - Set fields: `email`, `role: 'admin'`, `createdAt`, `lastLogin`

3. **Login:**
   - Navigate to `/admin/login`
   - Use your admin credentials
   - Access the full admin panel

### Features (Once Complete):
- 📊 Dashboard with stats
- 📦 Product management
- 🏷️ Deal creation & scheduling
- 💰 Price monitoring
- ⚙️ Settings

---

Stay tuned for the fix!
