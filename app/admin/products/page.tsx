'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { searchProductsAdvanced, deleteProduct, deleteProductImages, type Product } from '@/lib/firebase/db';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, [currentPage, searchQuery]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const result = await searchProductsAdvanced(searchQuery, null, currentPage, 20);
            setProducts(result.products);
            setTotalPages(result.totalPages);
            setTotal(result.total);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleDelete = async (productId: string, images: string[]) => {
        if (deleteConfirm !== productId) {
            setDeleteConfirm(productId);
            return;
        }

        try {
            // Delete images from storage
            if (images && images.length > 0) {
                await deleteProductImages(images);
            }

            // Delete product from Firestore
            await deleteProduct(productId);

            // Reload products
            await loadProducts();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product. Please try again.');
        }
    };

    const formatPrice = (products: Product) => {
        // This is a placeholder - in reality we'd fetch prices
        return 'View Prices';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {total} product{total !== 1 ? 's' : ''} total
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/products/import"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <CloudArrowUpIcon className="w-5 h-5" />
                        Bulk Import
                    </Link>
                    <Link
                        href="/admin/products/add"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search products by title, brand, or description..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <PlusIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
                    <p className="text-gray-600 mb-4">
                        {searchQuery ? 'No products match your search.' : 'Get started by adding your first product.'}
                    </p>
                    {!searchQuery && (
                        <Link
                            href="/admin/products/add"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Your First Product
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Brand
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-shrink-0 h-12 w-12 relative bg-gray-100 rounded overflow-hidden">
                                                        {product.images && product.images[0] ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="max-w-xs">
                                                        <div className="text-sm font-medium text-gray-900 truncate">
                                                            {product.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 truncate">
                                                            {product.description.slice(0, 50)}
                                                            {product.description.length > 50 && '...'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.brand}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {product.category_id || 'Uncategorized'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="text-primary hover:text-primary/80 p-2 hover:bg-gray-100 rounded"
                                                        title="Edit product"
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id!, product.images)}
                                                        className={`p-2 rounded transition-colors ${deleteConfirm === product.id
                                                            ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                                            : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
                                                            }`}
                                                        title={deleteConfirm === product.id ? 'Click again to confirm' : 'Delete product'}
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
