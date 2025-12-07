import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/firebase/categories';
import { getProductsByCategory } from '@/lib/firebase/db';
import Link from 'next/link';
import { Metadata } from 'next';

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.name} - Best Deals in UAE | UAE Discount Hub`,
        description: category.description || `Find the best ${category.name.toLowerCase()} deals and compare prices from top UAE retailers`,
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
        notFound();
    }

    // Fetch products in this category
    const products = await getProductsByCategory(category.id);

    return (
        <div className="min-h-screen bg-greywhite:  bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm">
                        <li>
                            <Link href="/" className="text-primary hover:underline">
                                Home
                            </Link>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li>
                            <Link href="/categories" className="text-primary hover:underline">
                                Categories
                            </Link>
                        </li>
                        <li className="text-gray-400">/</li>
                        <li className="text-gray-600">{category.name}</li>
                    </ol>
                </nav>

                {/* Category Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="text-5xl">{category.icon || '📦'}</span>
                        <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
                    </div>
                    {category.description && (
                        <p className="text-lg text-gray-600">{category.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                        {category.product_count} {category.product_count === 1 ? 'product' : 'products'} available
                    </p>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <p className="text-gray-600 mb-4">
                            No products available in this category yet.
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Browse All Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.seo.slug}`}
                                className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Product Image */}
                                {product.images && product.images[0] ? (
                                    <div className="aspect-square bg-gray-100 overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                        <span className="text-6xl">{category.icon || '📦'}</span>
                                    </div>
                                )}

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                                    {product.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                                            {product.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary font-medium">
                                            Compare Prices →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
