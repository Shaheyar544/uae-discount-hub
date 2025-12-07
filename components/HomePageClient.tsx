'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    TagIcon,
    SparklesIcon,
    BoltIcon,
    RocketLaunchIcon,
    ClockIcon,
    CubeIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import TodaysTopDeals from './TodaysTopDeals';
import TrustStrip from './TrustStrip';
import TransparencyFooter from './TransparencyFooter';

export default function HomePageClient() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Shrinking header animation -  50% height reduction on scroll
    const headerBg = useTransform(scrollY, [0, 100], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']);
    const headerShadow = useTransform(scrollY, [0, 100], ['0px 0px 0px rgba(0,0,0,0)', '0px 4px 20px rgba(0,0,0,0.1)']);
    const headerPadding = useTransform(scrollY, [0, 100], ['1.25rem', '0.625rem']);
    const logoSize = useTransform(scrollY, [0, 100], ['3.5rem', '2.25rem']);
    const titleSize = useTransform(scrollY, [0, 100], ['1.5rem', '1.125rem']);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground relative">
            {/* Shrinking Fixed Header */}
            <motion.header
                className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
                style={{ backgroundColor: headerBg, boxShadow: headerShadow }}
            >
                <motion.div
                    className="container mx-auto px-4"
                    style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
                >
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <motion.div
                                className="relative rounded-2xl bg-gradient-to-br from-primary via-purple-600 to-accent flex items-center justify-center"
                                style={{ width: logoSize, height: logoSize }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div style={{ width: '50%', height: '50%' }}>
                                    <TagIcon className="w-full h-full text-white" />
                                </motion.div>
                            </motion.div>
                            <div>
                                <motion.h1
                                    className="font-heading font-bold gradient-text"
                                    style={{ fontSize: titleSize }}
                                >
                                    UAE Discount Hub
                                </motion.h1>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <SparklesIcon className="w-3 h-3" />
                                    AI-Powered Price Discovery
                                </p>
                            </div>
                        </Link>

                        <nav className="flex items-center gap-6">
                            <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors relative group hidden md:inline">
                                <span className="relative z-10">Top Deals</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors relative group hidden md:inline">
                                <span className="relative z-10">Categories</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors relative group hidden md:inline">
                                <span className="relative z-10">About</span>
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </nav>
                    </div>
                </motion.div>
            </motion.header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 pt-32 pb-16 relative z-10">
                <motion.div className="text-center max-w-6xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    {/* Simplified AI Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-6 py-2.5 mb-10 rounded-full"
                        style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))', color: 'white' }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <RocketLaunchIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold">Next-Gen AI Price Comparison</span>
                    </motion.div>

                    <motion.h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-tight" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
                        Discover the <span className="gradient-text">Ultimate Deals</span>
                        <br />
                        <span className="text-4xl md:text-6xl lg:text-7xl">Across UAE's Leading Stores</span>
                    </motion.h2>

                    <motion.p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-4xl mx-auto font-light leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.4 }}>
                        Our AI scans <strong className="text-foreground font-semibold">10,000+ products</strong> every 6 hours from Amazon.ae, Noon, Namshi & more.
                    </motion.p>

                    {/* Refined Search Bar */}
                    <motion.div className="max-w-4xl mx-auto mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
                        <div className="relative smart-search" style={{ padding: '0.75rem' }}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <MagnifyingGlassIcon className="w-6 h-6 text-primary" />
                                <span className="ai-badge">
                                    <BoltIcon className="w-3 h-3" />
                                    AI
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Try 'Samsung Galaxy S24' or 'Gaming Laptop under 5000 AED'..."
                                className="w-full pl-32 pr-6 py-5 text-base bg-transparent border-0 focus:outline-none font-medium"
                            />
                        </div>
                    </motion.div>

                    {/* Simplified Primary CTA */}
                    <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
                        <Link
                            href="/search"
                            className="relative inline-flex items-center gap-3 px-10 py-5 text-xl font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 transition-all hover:scale-105 hover:shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5)',
                                color: 'white'
                            }}
                        >
                            <SparklesIcon className="w-6 h-6" />
                            Start Comparing Prices
                        </Link>

                        <Link href="/deals" className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-primary border-2 border-primary/30 rounded-xl hover:bg-primary/5 hover:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 transition-all duration-300">
                            <motion.span className="flex items-center gap-2" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <TagIcon className="w-6 h-6" />
                                Browse Hot Deals
                            </motion.span>
                        </Link>
                    </motion.div>

                    {/* Floating Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        <motion.div className="flex items-center gap-2 px-5 py-3 glass rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                            <CheckIcon className="w-5 h-5 text-success" />
                            <span className="font-medium">Real-time Updates</span>
                        </motion.div>
                        <motion.div className="flex items-center gap-2 px-5 py-3 glass rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                            <CheckIcon className="w-5 h-5 text-success" />
                            <span className="font-medium">AI-Verified Deals</span>
                        </motion.div>
                        <motion.div className="flex items-center gap-2 px-5 py-3 glass rounded-full" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}>
                            <CheckIcon className="w-5 h-5 text-success" />
                            <span className="font-medium">Price Drop Alerts</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-28 max-w-6xl mx-auto">
                    <motion.div className="card text-center group cursor-pointer" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} whileHover={{ y: -10, scale: 1.02 }}>
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full"></div>
                            <CubeIcon className="w-20 h-20 text-blue-500 relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        </div>
                        <div className="text-5xl font-heading font-bold gradient-text mb-3">10,000+</div>
                        <div className="text-lg text-muted-foreground font-medium mb-2">Products Tracked</div>
                        <div className="text-sm text-primary font-semibold">Updated every 6 hours</div>
                    </motion.div>

                    <motion.div className="card text-center group cursor-pointer" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -10, scale: 1.02 }}>
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full"></div>
                            <CurrencyDollarIcon className="w-20 h-20 text-amber-500 relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        </div>
                        <div className="text-5xl font-heading font-bold text-accent mb-3">AED 1M+</div>
                        <div className="text-lg text-muted-foreground font-medium mb-2">Money Saved</div>
                        <div className="text-sm text-accent font-semibold">By smart shoppers</div>
                    </motion.div>

                    <motion.div className="card text-center group cursor-pointer" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ y: -10, scale: 1.02 }}>
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full"></div>
                            <ClockIcon className="w-20 h-20 text-purple-500 relative z-10 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                        </div>
                        <div className="text-5xl font-heading font-bold gradient-text mb-3">6 Hours</div>
                        <div className="text-lg text-muted-foreground font-medium mb-2">Price Update Cycle</div>
                        <div className="text-sm text-primary font-semibold">AI-powered monitoring</div>
                    </motion.div>
                </div>
            </section>

            {/* Trust Strip - Phase 2 */}
            <TrustStrip />

            {/* Today's Top Deals - Phase 2 */}
            <TodaysTopDeals />

            {/* Categories */}
            <section className="container mx-auto px-4 py-24 relative z-10">
                <div className="text-center mb-16">
                    <motion.h3 className="text-4xl md:text-5xl font-heading font-bold mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                        Explore <span className="gradient-text">Popular Categories</span>
                    </motion.h3>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        Browse thousands of products across your favorite categories
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {categories.map((category, index) => (
                        <motion.div key={category.name} className={category.name === 'Electronics' ? 'lg:col-span-2' : ''} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -8, scale: 1.03 }}>
                            <Link href={category.href} className="block relative rounded-2xl overflow-hidden group h-full" style={{ background: category.gradient, padding: '2px' }}>
                                <div className="bg-card rounded-2xl p-8 h-full relative z-10">
                                    <div className="text-center h-full flex flex-col justify-center">
                                        <div className="relative inline-block mb-5 mx-auto">
                                            <div className="absolute inset-0 blur-2xl rounded-full opacity-50" style={{ background: category.iconBg }}></div>
                                            <div className="text-7xl relative z-10 group-hover:scale-125 transition-transform duration-500">{category.icon}</div>
                                        </div>
                                        <h4 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors">{category.name}</h4>
                                        <p className="text-sm text-muted-foreground mb-2">{category.count} products</p>
                                        <div className="mt-4 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                                            Explore now
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Transparency Footer - Phase 2 */}
            <TransparencyFooter />

            {/* Footer */}
            <footer className="border-t border-border/50 relative z-10">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">© 2025 UAE Discount Hub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function CheckIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    );
}

const categories = [
    { name: "Electronics", icon: "💻", count: "2,450", href: "/category/electronics", gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)", iconBg: "#3b82f6" },
    { name: "Fashion", icon: "👗", count: "3,200", href: "/category/fashion", gradient: "linear-gradient(135deg, #ec4899, #f43f5e)", iconBg: "#ec4899" },
    { name: "Home & Kitchen", icon: "🏠", count: "1,800", href: "/category/home", gradient: "linear-gradient(135deg, #10b981, #14b8a6)", iconBg: "#10b981" },
    { name: "Beauty", icon: "💄", count: "1,500", href: "/category/beauty", gradient: "linear-gradient(135deg, #f59e0b, #f97316)", iconBg: "#f59e0b" },
    { name: "Sports", icon: "⚽", count: "950", href: "/category/sports", gradient: "linear-gradient(135deg, #06b6d4, #0ea5e9)", iconBg: "#06b6d4" },
    { name: "Toys", icon: "🧸", count: "780", href: "/category/toys", gradient: "linear-gradient(135deg, #a855f7, #d946ef)", iconBg: "#a855f7" },
    { name: "Books", icon: "📚", count: "1,200", href: "/category/books", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", iconBg: "#6366f1" },
    { name: "Automotive", icon: "🚗", count: "650", href: "/category/automotive", gradient: "linear-gradient(135deg, #ef4444, #dc2626)", iconBg: "#ef4444" },
];
