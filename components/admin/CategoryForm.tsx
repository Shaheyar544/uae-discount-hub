'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateCategorySlug, validateCategoryData, type Category } from '@/lib/firebase/categories';

interface CategoryFormProps {
    category?: Category;
    isEdit?: boolean;
}

// Popular category icons
const CATEGORY_ICONS = [
    { emoji: '📱', label: 'Smartphone' },
    { emoji: '💻', label: 'Laptop' },
    { emoji: '🎧', label: 'Audio' },
    { emoji: '📷', label: 'Camera' },
    { emoji: '⌚', label: 'Watch' },
    { emoji: '🎮', label: 'Gaming' },
    { emoji: '🖥️', label: 'Monitor' },
    { emoji: '⌨️', label: 'Keyboard' },
    { emoji: '🖱️', label: 'Mouse' },
    { emoji: '🏠', label: 'Home' },
    { emoji: '👕', label: 'Fashion' },
    { emoji: '⚽', label: 'Sports' },
    { emoji: '🎨', label: 'Art' },
    { emoji: '📚', label: 'Books' },
    { emoji: '🔧', label: 'Tools' }
];

export default function CategoryForm({ category, isEdit = false }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [name, setName] = useState(category?.name || '');
    const [slug, setSlug] = useState(category?.slug || '');
    const [description, setDescription] = useState(category?.description || '');
    const [icon, setIcon] = useState(category?.icon || '📱');
    const [featured, setFeatured] = useState(category?.featured || false);
    const [order, setOrder] = useState(category?.order || 0);

    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
        setName(value);
        if (!isEdit || !category?.slug) {
            setSlug(generateCategorySlug(value));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate data
            const categoryData = {
                name: name.trim(),
                slug: slug.trim(),
                description: description.trim(),
                icon,
                featured,
                order
            };

            const validation = validateCategoryData(categoryData);
            if (!validation.valid) {
                throw new Error(validation.errors.join(', '));
            }

            if (isEdit && category?.id) {
                // Update existing category
                const { updateCategory } = await import('@/lib/firebase/categories');
                await updateCategory(category.id, categoryData);
            } else {
                // Create new category
                const { createCategory } = await import('@/lib/firebase/categories');
                await createCategory(categoryData);
            }

            router.push('/admin/categories');
        } catch (err: any) {
            console.error('Error saving category:', err);
            setError(err.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                <div className="space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., Smartphones"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                            URL Slug *
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            placeholder="smartphones"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            URL: /category/{slug || 'slug'}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Brief description of this category..."
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {description.length}/500 characters
                        </p>
                    </div>

                    {/* Icon Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Icon
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {CATEGORY_ICONS.map((item) => (
                                <button
                                    key={item.emoji}
                                    type="button"
                                    onClick={() => setIcon(item.emoji)}
                                    className={`p-3 text-2xl rounded-lg border-2 transition-all ${icon === item.emoji
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    title={item.label}
                                >
                                    {item.emoji}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Selected: <span className="text-2xl">{icon}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

                <div className="space-y-4">
                    {/* Featured Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                                Featured Category
                            </label>
                            <p className="text-xs text-gray-500">Show on homepage</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={featured}
                                onChange={(e) => setFeatured(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* Order */}
                    <div>
                        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                            Display Order
                        </label>
                        <input
                            id="order"
                            type="number"
                            value={order}
                            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                            min="0"
                            max="1000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Lower numbers appear first
                        </p>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
                </button>
            </div>
        </form>
    );
}
