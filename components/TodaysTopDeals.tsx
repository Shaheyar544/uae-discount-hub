'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TagIcon } from '@heroicons/react/24/outline';

interface Deal {
    id: string;
    name: string;
    image: string;
    originalPrice: number;
    discountedPrice: number;
    percentOff: number;
    lowestAt: string;
    slug: string;
}

// Sample deals data - will be replaced with Firebase data
const sampleDeals: Deal[] = [
    {
        id: '1',
        name: 'Samsung Galaxy S24 Ultra 256GB',
        image: '/placeholder-phone.jpg',
        originalPrice: 4999,
        discountedPrice: 3499,
        percentOff: 30,
        lowestAt: 'Noon',
        slug: 'samsung-galaxy-s24-ultra'
    },
    {
        id: '2',
        name: 'Apple MacBook Air M2 13"',
        image: '/placeholder-laptop.jpg',
        originalPrice: 4799,
        discountedPrice: 3999,
        percentOff: 17,
        lowestAt: 'Amazon.ae',
        slug: 'macbook-air-m2'
    },
    {
        id: '3',
        name: 'Sony WH-1000XM5 Headphones',
        image: '/placeholder-headphones.jpg',
        originalPrice: 1499,
        discountedPrice: 999,
        percentOff: 33,
        lowestAt: 'Sharaf DG',
        slug: 'sony-wh-1000xm5'
    },
    {
        id: '4',
        name: 'iPad Pro 11" 128GB Wi-Fi',
        image: '/placeholder-tablet.jpg',
        originalPrice: 3199,
        discountedPrice: 2699,
        percentOff: 16,
        lowestAt: 'Noon',
        slug: 'ipad-pro-11'
    },
];

export default function TodaysTopDeals() {
    return (
        <section className="container mx-auto px-4 py-16 relative z-10">
            <div className="mb-12">
                <motion.h3
                    className="text-3xl md:text-4xl font-heading font-bold mb-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="gradient-text">Today's Top Deals</span>
                </motion.h3>
                <p className="text-muted-foreground text-lg">
                    Instant value - verified discounts updated every 6 hours
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sampleDeals.map((deal, index) => (
                    <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Link
                            href={`/product/${deal.slug}`}
                            className="block group"
                        >
                            <div className="card overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                                {/* Product Image */}
                                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <TagIcon className="w-20 h-20 opacity-20" />
                                    </div>

                                    {/* Percentage Badge */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <div className="px-3 py-1.5 rounded-lg font-bold text-sm" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white' }}>
                                            {deal.percentOff}% OFF
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h4 className="font-semibold text-base mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {deal.name}
                                    </h4>

                                    {/* Pricing */}
                                    <div className="mb-3">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-2xl font-bold text-accent">
                                                AED {deal.discountedPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-muted-foreground line-through">
                                            AED {deal.originalPrice.toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Retailer Badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Lowest at {deal.lowestAt}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
