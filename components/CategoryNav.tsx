'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllCategories, type Category } from '@/lib/firebase/categories';

export default function CategoryNav() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            // Show only featured categories in nav menu
            const featured = data.filter(cat => cat.featured);
            setCategories(featured.slice(0, 8)); // Limit to 8 for horizontal layout
        } catch (err) {
            console.error('Failed to load categories:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || categories.length === 0) {
        return null;
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 overflow-x-auto py-3 scrollbar-hide">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-xl">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-700 hover:text-primary">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                    <Link
                        href="/categories"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                        View All →
                    </Link>
                </div>
            </div>
        </nav>
    );
}
