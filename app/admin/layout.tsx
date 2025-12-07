'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { onAdminAuthStateChanged, signOutAdmin, checkAdminRole, type AdminUser } from '@/lib/firebase/admin-auth';
import {
    HomeIcon,
    ShoppingBagIcon,
    TagIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    FolderIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Categories', href: '/admin/categories', icon: FolderIcon },
    { name: 'Deals', href: '/admin/deals', icon: TagIcon },
    { name: 'Prices', href: '/admin/prices', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Skip layout for login page - just render children
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    useEffect(() => {
        const unsubscribe = onAdminAuthStateChanged(async (user) => {
            if (user) {
                const admin = await checkAdminRole(user.uid);
                if (admin) {
                    setAdminUser(admin);
                    setLoading(false);
                } else {
                    // User is authenticated but not an admin
                    await signOutAdmin();
                    router.push('/login');
                }
            } else {
                setLoading(false);
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await signOutAdmin();
            router.push('/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
                    {/* Logo */}
                    <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-600 to-accent flex items-center justify-center">
                            <TagIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold gradient-text">UAE Discount Hub</h1>
                            <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Sign Out */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                {adminUser?.email?.[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{adminUser?.email}</p>
                                <p className="text-xs text-gray-500 capitalize">{adminUser?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <motion.div
                        className="fixed inset-y-0 left-0 w-64 bg-white"
                        initial={{ x: -264 }}
                        animate={{ x: 0 }}
                        exit={{ x: -264 }}
                    >
                        {/* Mobile sidebar content (same as desktop) */}
                        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-purple-600 to-accent flex items-center justify-center">
                                    <TagIcon className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-sm font-bold gradient-text">Admin</h1>
                            </div>
                            <button onClick={() => setSidebarOpen(false)}>
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-1 px-3 py-4">
                            {navigation.map((item) => {
                                const isActive = pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.div>
                </div>
            )}

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden -ml-2 p-2 text-gray-700 hover:text-primary"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {navigation.find(item => pathname.startsWith(item.href))?.name || 'Admin Panel'}
                            </h2>
                        </div>

                        {/* Desktop user menu */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{adminUser?.email}</p>
                                <p className="text-xs text-gray-500 capitalize">{adminUser?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
