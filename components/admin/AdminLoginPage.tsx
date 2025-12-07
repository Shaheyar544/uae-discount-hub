'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signInAdmin } from '@/lib/firebase/admin-auth';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

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
            await signInAdmin(email, password);
            // Set a session cookie to help middleware detect auth
            document.cookie = 'admin-session=true; path=/';
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-accent mb-4">
                        <ShieldCheckIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold gradient-text mb-2">Admin Portal</h1>
                    <p className="text-muted-foreground">UAE Discount Hub</p>
                </div>

                {/* Login Card */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    placeholder="admin@uaediscounthub.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                className="p-4 rounded-lg bg-red-50 border border-red-200"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <p className="text-sm text-red-700">{error}</p>
                            </motion.div>
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
                        <p className="text-xs text-muted-foreground">
                            Authorized personnel only. All access is logged.
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        🔒 Secured with Firebase Authentication
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
