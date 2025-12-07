'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';
import { getCategoryById, deleteCategory, type Category } from '@/lib/firebase/categories';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function EditCategoryPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadCategory();
    }, [categoryId]);

    const loadCategory = async () => {
        try {
            const data = await getCategoryById(categoryId);
            if (!data) {
                alert('Category not found');
                router.push('/admin/categories');
                return;
            }
            setCategory(data);
        } catch (err) {
            console.error('Error loading category:', err);
            alert('Failed to load category');
            router.push('/admin/categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!category) return;

        if (category.product_count > 0) {
            if (!confirm(
                `Warning: This category has ${category.product_count} products. ` +
                `Deleting it will orphan those products. Are you sure you want to continue?`
            )) {
                return;
            }

            // Force delete with reassignment
            const { forceDeleteCategoryWithReassignment } = await import('@/lib/firebase/categories');
            try {
                setDeleting(true);
                await forceDeleteCategoryWithReassignment(categoryId);
                router.push('/admin/categories');
            } catch (err: any) {
                alert(`Failed to delete category: ${err.message}`);
                setDeleting(false);
            }
        } else {
            if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
                return;
            }

            try {
                setDeleting(true);
                await deleteCategory(categoryId);
                router.push('/admin/categories');
            } catch (err: any) {
                alert(`Failed to delete category: ${err.message}`);
                setDeleting(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!category) {
        return null;
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                    <p className="text-sm text-gray-600 mt-1">Update category details</p>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                    <TrashIcon className="w-5 h-5" />
                    {deleting ? 'Deleting...' : 'Delete Category'}
                </button>
            </div>

            <CategoryForm category={category} isEdit />
        </div>
    );
}
