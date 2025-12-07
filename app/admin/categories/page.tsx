'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getAllCategories, deleteCategory, updateCategoryProductCount, type Category } from '@/lib/firebase/categories';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getAllCategories();
            setCategories(data);
        } catch (err: any) {
            setError('Failed to load categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (category: Category) => {
        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
            return;
        }

        if (category.product_count > 0) {
            alert(
                `Cannot delete "${category.name}" because it has ${category.product_count} products. ` +
                `Please reassign or delete those products first.`
            );
            return;
        }

        try {
            setDeleting(category.id);
            await deleteCategory(category.id);
            await loadCategories();
        } catch (err: any) {
            alert(`Failed to delete category: ${err.message}`);
            console.error(err);
        } finally {
            setDeleting(null);
        }
    };

    const handleRefreshCount = async (categoryId: string) => {
        try {
            await updateCategoryProductCount(categoryId);
            await loadCategories();
        } catch (err) {
            console.error('Failed to refresh count:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage product categories and organization
                    </p>
                </div>
                <Link
                    href="/admin/categories/add"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Category
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Categories List */}
            {categories.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600 mb-4">No categories yet</p>
                    <Link
                        href="/admin/categories/add"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create First Category
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Icon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Products
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Featured
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {category.order}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-2xl">
                                        {category.icon || '📦'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {category.name}
                                        </div>
                                        {category.description && (
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {category.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {category.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleRefreshCount(category.id)}
                                            className="text-sm text-primary hover:underline"
                                            title="Click to refresh count"
                                        >
                                            {category.product_count}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {category.featured ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Regular
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="Edit category"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                disabled={deleting === category.id}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                title="Delete category"
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
            )}
        </div>
    );
}
