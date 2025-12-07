'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeftIcon,
    StarIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import type { Product, Price } from '@/lib/firebase/db';
import { trackAffiliateClick } from '@/lib/firebase/db';

interface Props {
    product: Product;
    prices: Price[];
    bestPrice: Price | null;
}

export default function ProductComparisonClient({ product, prices, bestPrice }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);

    const handleAffiliateClick = async (marketplace: string, url: string) => {
        // Track the click
        await trackAffiliateClick(product.id!, marketplace);

        // Open affiliate link in new tab
        window.open(url, '_blank');
    };

    // Calculate average rating (placeholder - you can add actual reviews later)
    const averageRating = 4.5;

    return (
        <div className="min-h-screen bg-background">
            {/* Header with Back Button */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Product Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{product.title}</h1>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    star <= Math.floor(averageRating) ? (
                                        <StarSolidIcon key={star} className="w-5 h-5 text-accent" />
                                    ) : (
                                        <StarIcon key={star} className="w-5 h-5 text-muted-foreground" />
                                    )
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {averageRating} out of 5
                            </span>
                        </div>

                        {/* Best Price Badge */}
                        {bestPrice && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full">
                                <span className="text-sm font-medium text-accent">
                                    Best Price: AED {bestPrice.price.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Images */}
                    <div>
                        <div className="card p-4 mb-4">
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                                {product.images[selectedImage] ? (
                                    <Image
                                        src={product.images[selectedImage]}
                                        alt={product.title}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ShoppingCartIcon className="w-24 h-24 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-primary scale-105'
                                                : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.title} ${index + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="card p-6 mb-6">
                            <h2 className="text-xl font-heading font-semibold mb-4">Description</h2>
                            <p className="text-muted-foreground mb-6">{product.description}</p>

                            {bestPrice && (
                                <button
                                    onClick={() => handleAffiliateClick(bestPrice.marketplace, bestPrice.affiliate_url)}
                                    className="btn-accent w-full mb-4"
                                >
                                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                    Buy Now at Best Price - AED {bestPrice.price.toFixed(2)}
                                </button>
                            )}

                            <p className="text-xs text-muted-foreground text-center">
                                *Clicking will redirect you to the seller's website. We may earn a commission.
                            </p>
                        </div>

                        {/* Pros and Cons */}
                        {(product.pros.length > 0 || product.cons.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.pros.length > 0 && (
                                    <div className="card p-4">
                                        <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                            Pros
                                        </h3>
                                        <ul className="space-y-2">
                                            {product.pros.map((pro, index) => (
                                                <li key={index} className="text-sm flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">✓</span>
                                                    <span>{pro}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {product.cons.length > 0 && (
                                    <div className="card p-4">
                                        <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                                            <XCircleIcon className="w-5 h-5 text-red-500" />
                                            Cons
                                        </h3>
                                        <ul className="space-y-2">
                                            {product.cons.map((con, index) => (
                                                <li key={index} className="text-sm flex items-start gap-2">
                                                    <span className="text-red-500 mt-1">✗</span>
                                                    <span>{con}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Price Comparison Table */}
                <div className="card p-6 mb-8">
                    <h2 className="text-2xl font-heading font-bold mb-6">Price Comparison</h2>

                    {prices.length === 0 ? (
                        <div className="text-center py-12">
                            <ChartBarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No prices available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-heading">Store</th>
                                        <th className="text-left py-3 px-4 font-heading">Price</th>
                                        <th className="text-left py-3 px-4 font-heading">Discount</th>
                                        <th className="text-left py-3 px-4 font-heading">Status</th>
                                        <th className="text-left py-3 px-4 font-heading">Updated</th>
                                        <th className="text-right py-3 px-4 font-heading">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prices
                                        .filter(p => p.status === 'success')
                                        .sort((a, b) => a.price - b.price)
                                        .map((price, index) => (
                                            <tr
                                                key={price.marketplace}
                                                className={`border-b border-border hover:bg-secondary/50 transition-colors ${index === 0 ? 'bg-accent/5' : ''
                                                    }`}
                                            >
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{price.marketplace}</span>
                                                        {index === 0 && (
                                                            <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                                                                Best Price
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-lg font-bold">AED {price.price.toFixed(2)}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {price.discount_percent > 0 && (
                                                        <span className="text-green-600 font-medium">
                                                            -{price.discount_percent}%
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`text-sm ${price.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                                                        {price.in_stock ? 'In Stock' : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-muted-foreground">
                                                    {new Date(price.last_updated.toDate()).toLocaleDateString()}
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => handleAffiliateClick(price.marketplace, price.affiliate_url)}
                                                        disabled={!price.in_stock}
                                                        className={`btn-primary ${!price.in_stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        View Deal
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Affiliate Disclosure */}
                <div className="border-t border-border pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                        <strong>Affiliate Disclosure:</strong> UAE Discount Hub may earn a commission when you purchase through our links.
                        This doesn't affect the price you pay. Prices are updated every 6 hours and may change.
                    </p>
                </div>
            </div>
        </div>
    );
}
