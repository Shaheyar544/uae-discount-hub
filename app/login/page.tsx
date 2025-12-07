'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Import Firebase Auth dynamically to avoid SSR issues
            const { signInWithEmailAndPassword } = await import('firebase/auth');
            const { auth } = await import('@/lib/firebase/config');
            const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
            const { db } = await import('@/lib/firebase/config');

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Update last login timestamp
            const adminRef = doc(db, 'admins', userCredential.user.uid);
            await setDoc(adminRef, {
                lastLogin: serverTimestamp()
            }, { merge: true });

            // Set session cookie
            document.cookie = 'admin-session=true; path=/';

            // Redirect to dashboard
            router.push('/admin/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            let errorMessage = 'Failed to sign in. Please try again.';

            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address format.';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Admin Portal
                    </h1>
                    <p className="text-gray-600">UAE Discount Hub</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="admin@uaediscounthub.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                boxShadow: loading ? 'none' : '0 4px 14px 0 rgba(59, 130, 246, 0.4)'
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In to Dashboard'
                            )}
                        </button>
                    </form>

                    {/* Footer Note */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">Authorized personnel only. All access is logged.</p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">🔒 Secured with Firebase Authentication</p>
                </div>
            </div>
        </div>
    );
}
