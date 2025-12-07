import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Admin roles
export type AdminRole = 'admin' | 'editor' | 'viewer';

export interface AdminUser {
    uid: string;
    email: string;
    role: AdminRole;
    createdAt: any;
    lastLogin: any;
}

/**
 * Sign in admin user with email and password
 */
export async function signInAdmin(email: string, password: string): Promise<User> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Update last login timestamp
        const adminRef = doc(db, 'admins', userCredential.user.uid);
        await setDoc(adminRef, {
            lastLogin: serverTimestamp()
        }, { merge: true });

        return userCredential.user;
    } catch (error: any) {
        console.error('Admin sign in error:', error);
        throw new Error(getAuthErrorMessage(error.code));
    }
}

/**
 * Sign out admin user
 */
export async function signOutAdmin(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Sign out error:', error);
        throw error;
    }
}

/**
 * Check if user has admin privileges
 */
export async function checkAdminRole(uid: string): Promise<AdminUser | null> {
    try {
        const adminRef = doc(db, 'admins', uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
            return null;
        }

        return adminSnap.data() as AdminUser;
    } catch (error) {
        console.error('Error checking admin role:', error);
        return null;
    }
}

/**
 * Create initial admin user (run this once in setup)
 * NOTE: You need to manually create this user in Firebase Console first
 */
export async function createAdminUser(uid: string, email: string, role: AdminRole = 'admin'): Promise<void> {
    try {
        const adminRef = doc(db, 'admins', uid);
        await setDoc(adminRef, {
            uid,
            email,
            role,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
}

/**
 * Subscribe to auth state changes
 */
export function onAdminAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

/**
 * Get current admin user
 */
export function getCurrentAdmin(): User | null {
    return auth.currentUser;
}

/**
 * Convert Firebase auth error codes to user-friendly messages
 */
function getAuthErrorMessage(code: string): string {
    switch (code) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/too-many-requests':
            return 'Too many failed login attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return 'An error occurred during sign in. Please try again.';
    }
}
