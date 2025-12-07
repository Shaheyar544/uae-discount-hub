'use client';

import Link from 'next/link';
import { type Category } from '@/lib/firebase/categories';

interface CategoryCardProps {
    category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/category/${category.slug}`}
            className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300"
        >
            {/* Featured Badge */}
            {category.featured && (
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        Featured
                    </span>
                </div>
            )}

            {/* Category Icon */}
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon || '📦'}
            </div>

            {/* Category Name */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {category.name}
            </h3>

            {/* Description */}
            {category.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                </p>
            )}

            {/* Product Count */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
                </span>
                <span className="text-primary font-medium group-hover:translate-x-1 transition-transform inline-block">
                    →
                </span>
            </div>
        </Link>
    );
}
