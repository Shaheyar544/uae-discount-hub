'use client';

import { useState, FormEvent, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProductWithPrices, uploadProductImages, type Product } from '@/lib/firebase/db';
import { Timestamp } from 'firebase/firestore';
import ImageUpload from './ImageUpload';
import ProductQualityScore from './ProductQualityScore';
import { calculateQualityScore } from '@/lib/quality-scoring';
import { getAllCategories, type Category } from '@/lib/firebase/categories';

interface ProductFormProps {
    product?: Product;
    isEdit?: boolean;
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Form state
    const [title, setTitle] = useState(product?.title || '');
    const [brand, setBrand] = useState(product?.brand || '');
    const [description, setDescription] = useState(product?.description || '');
    const [categoryId, setCategoryId] = useState(product?.category_id || '');
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>(product?.images || []);
    const [specs, setSpecs] = useState<Record<string, string>>(product?.specs || {});
    const [pros, setPros] = useState<string[]>(product?.pros || ['']);
    const [cons, setCons] = useState<string[]>(product?.cons || ['']);
    const [slug, setSlug] = useState(product?.seo?.slug || '');
    const [metaTitle, setMetaTitle] = useState(product?.seo?.meta_title || '');
    const [metaDescription, setMetaDescription] = useState(product?.seo?.meta_description || '');

    // Load categories
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Failed to load categories:', err);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Auto-generate slug from title
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (!isEdit || !product?.seo?.slug) {
            setSlug(generateSlug(value));
        }
    };

    const handleAddSpec = () => {
        setSpecs({ ...specs, '': '' });
    };

    const handleSpecChange = (oldKey: string, newKey: string, value: string) => {
        const newSpecs = { ...specs };
        if (oldKey !== newKey && oldKey in newSpecs) {
            delete newSpecs[oldKey];
        }
        newSpecs[newKey] = value;
        setSpecs(newSpecs);
    };

    const handleRemoveSpec = (key: string) => {
        const newSpecs = { ...specs };
        delete newSpecs[key];
        setSpecs(newSpecs);
    };

    const handleAddPro = () => {
        setPros([...pros, '']);
    };

    const handleProChange = (index: number, value: string) => {
        const newPros = [...pros];
        newPros[index] = value;
        setPros(newPros);
    };

    const handleRemovePro = (index: number) => {
        setPros(pros.filter((_, i) => i !== index));
    };

    const handleAddCon = () => {
        setCons([...cons, '']);
    };

    const handleConChange = (index: number, value: string) => {
        const newCons = [...cons];
        newCons[index] = value;
        setCons(newCons);
    };

    const handleRemoveCon = (index: number) => {
        setCons(cons.filter((_, i) => i !== index));
    };

    // Calculate quality score in real-time
    const qualityScore = useMemo(() => {
        const currentProduct: Partial<Product> = {
            title,
            brand,
            description,
            images: [...existingImages, ...images.map(() => 'temp')], // Count new images
            specs,
            pros: pros.filter(p => p.trim()),
            cons: cons.filter(c => c.trim())
        };
        return calculateQualityScore(currentProduct);
    }, [title, brand, description, existingImages.length, images.length, specs, pros, cons]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!title.trim()) {
                throw new Error('Title is required');
            }
            if (!description.trim()) {
                throw new Error('Description is required');
            }
            if (!brand.trim()) {
                throw new Error('Brand is required');
            }
            if (!categoryId) {
                throw new Error('Category is required');
            }

            // Filter out empty pros/cons
            const filteredPros = pros.filter(p => p.trim());
            const filteredCons = cons.filter(c => c.trim());

            // Create product data
            const productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
                title: title.trim(),
                brand: brand.trim(),
                description: description.trim(),
                category_id: categoryId,
                images: existingImages,
                specs,
                pros: filteredPros,
                cons: filteredCons,
                seo: {
                    slug: slug || generateSlug(title),
                    meta_title: metaTitle.trim() || undefined,
                    meta_description: metaDescription.trim() || undefined
                }
            };

            if (isEdit && product?.id) {
                // Update existing product
                const { updateProduct } = await import('@/lib/firebase/db');

                // Upload new images if any
                let newImageUrls: string[] = [];
                if (images.length > 0) {
                    newImageUrls = await uploadProductImages(images, product.id);
                }

                await updateProduct(product.id, {
                    ...productData,
                    images: [...existingImages, ...newImageUrls]
                });

                router.push('/admin/products');
            } else {
                // Create new product
                // First create product to get ID
                const tempProductId = 'temp-' + Date.now();

                // Upload images
                let imageUrls: string[] = [];
                if (images.length > 0) {
                    imageUrls = await uploadProductImages(images, tempProductId);
                }

                // Create product with images
                const productId = await createProductWithPrices({
                    ...productData,
                    images: imageUrls
                });

                router.push('/admin/products');
            }
        } catch (err: any) {
            console.error('Error saving product:', err);
            setError(err.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Quality Score - Sticky at top */}
            <div className="sticky top-4 z-10">
                <ProductQualityScore score={qualityScore} />
            </div>

            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Product Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., Samsung Galaxy S24 Ultra"
                        />
                    </div>

                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                            Brand *
                        </label>
                        <input
                            id="brand"
                            type="text"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="e.g., Samsung"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Detailed product description..."
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        {loadingCategories ? (
                            <div className="px-3 py-2 text-sm text-gray-500">Loading categories...</div>
                        ) : categories.length === 0 ? (
                            <div className="text-sm text-gray-500">
                                No categories available.
                                <a href="/admin/categories/add" className="text-primary hover:underline ml-1">
                                    Create one first
                                </a>
                            </div>
                        ) : (
                            <select
                                id="category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="">Select a category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Products are organized by category</p>
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
                <ImageUpload
                    images={images}
                    existingImages={existingImages}
                    onChange={setImages}
                    onExistingImagesChange={setExistingImages}
                />
            </div>

            {/* Specifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>

                <div className="space-y-3">
                    {Object.entries(specs).map(([key, value], index) => (
                        <div key={index} className="flex gap-3">
                            <input
                                type="text"
                                value={key}
                                onChange={(e) => handleSpecChange(key, e.target.value, value)}
                                placeholder="Spec name (e.g., Display)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleSpecChange(key, key, e.target.value)}
                                placeholder="Value (e.g., 6.8 inch)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveSpec(key)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleAddSpec}
                    className="mt-3 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg"
                >
                    + Add Specification
                </button>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Pros</h2>
                    <div className="space-y-3">
                        {pros.map((pro, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={pro}
                                    onChange={(e) => handleProChange(index, e.target.value)}
                                    placeholder="Enter a positive point..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePro(index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddPro}
                        className="mt-3 px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg"
                    >
                        + Add Pro
                    </button>
                </div>

                {/* Cons */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Cons</h2>
                    <div className="space-y-3">
                        {cons.map((con, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={con}
                                    onChange={(e) => handleConChange(index, e.target.value)}
                                    placeholder="Enter a negative point..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCon(index)}
                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddCon}
                        className="mt-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        + Add Con
                    </button>
                </div>
            </div>

            {/* SEO */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                            URL Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="auto-generated-from-title"
                        />
                        <p className="mt-1 text-xs text-gray-500">Auto-generated from title. Customize if needed.</p>
                    </div>

                    <div>
                        <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Title
                        </label>
                        <input
                            id="metaTitle"
                            type="text"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Optional: Override default title for SEO"
                        />
                    </div>

                    <div>
                        <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Description
                        </label>
                        <textarea
                            id="metaDescription"
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Optional: Custom meta description for search engines"
                        />
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
                    {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
}
