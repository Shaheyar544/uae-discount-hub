'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, type Product } from '@/lib/firebase/db';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const productData = await getProductById(id);
            if (!productData) {
                setError('Product not found');
            } else {
                setProduct(productData);
            }
        } catch (err: any) {
            console.error('Error loading product:', err);
            setError(err.message || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-600">Loading product...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Product not found'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-600 mt-1">Update product details</p>
            </div>
            <ProductForm product={product} isEdit={true} />
        </div>
    );
}
