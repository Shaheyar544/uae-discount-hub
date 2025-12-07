import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    writeBatch
} from 'firebase/firestore';
import { db } from './config';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon?: string;
    image_url?: string;
    parent_id?: string;
    product_count: number;
    featured: boolean;
    order: number;
    created_at: Timestamp;
    updated_at: Timestamp;
}

const CATEGORIES_COLLECTION = 'categories';

/**
 * Get all categories ordered by order field
 */
export async function getAllCategories(): Promise<Category[]> {
    try {
        const categoriesRef = collection(db, CATEGORIES_COLLECTION);
        const q = query(categoriesRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Category));
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

/**
 * Get featured categories only
 */
export async function getFeaturedCategories(): Promise<Category[]> {
    try {
        const categoriesRef = collection(db, CATEGORIES_COLLECTION);
        const q = query(
            categoriesRef,
            where('featured', '==', true),
            orderBy('order', 'asc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Category));
    } catch (error) {
        console.error('Error fetching featured categories:', error);
        throw error;
    }
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
        const categoriesRef = collection(db, CATEGORIES_COLLECTION);
        const q = query(categoriesRef, where('slug', '==', slug));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        } as Category;
    } catch (error) {
        console.error('Error fetching category by slug:', error);
        throw error;
    }
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
    try {
        const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
        const snapshot = await getDoc(categoryRef);

        if (!snapshot.exists()) {
            return null;
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        } as Category;
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        throw error;
    }
}

/**
 * Create a new category
 */
export async function createCategory(
    data: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'product_count'>
): Promise<string> {
    try {
        // Check if slug already exists
        const existing = await getCategoryBySlug(data.slug);
        if (existing) {
            throw new Error(`Category with slug "${data.slug}" already exists`);
        }

        const now = Timestamp.now();
        const categoryData = {
            ...data,
            product_count: 0,
            created_at: now,
            updated_at: now
        };

        const categoriesRef = collection(db, CATEGORIES_COLLECTION);
        const docRef = await addDoc(categoriesRef, categoryData);

        return docRef.id;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

/**
 * Update an existing category
 */
export async function updateCategory(
    id: string,
    data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at' | 'product_count'>>
): Promise<void> {
    try {
        // If updating slug, check it doesn't conflict
        if (data.slug) {
            const existing = await getCategoryBySlug(data.slug);
            if (existing && existing.id !== id) {
                throw new Error(`Category with slug "${data.slug}" already exists`);
            }
        }

        const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
        await updateDoc(categoryRef, {
            ...data,
            updated_at: Timestamp.now()
        });
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

/**
 * Delete a category
 * WARNING: This will orphan products in this category
 */
export async function deleteCategory(id: string): Promise<void> {
    try {
        const category = await getCategoryById(id);
        if (!category) {
            throw new Error('Category not found');
        }

        if (category.product_count > 0) {
            throw new Error(
                `Cannot delete category with ${category.product_count} products. ` +
                `Please reassign or delete products first.`
            );
        }

        const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
        await deleteDoc(categoryRef);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}

/**
 * Force delete a category and update all its products to "Uncategorized"
 */
export async function forceDeleteCategoryWithReassignment(
    id: string,
    reassignToCategoryId?: string
): Promise<void> {
    try {
        const batch = writeBatch(db);

        // Get all products in this category
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('category_id', '==', id));
        const productsSnapshot = await getDocs(q);

        // Update products to new category or remove category
        productsSnapshot.docs.forEach(productDoc => {
            const productRef = doc(db, 'products', productDoc.id);
            if (reassignToCategoryId) {
                batch.update(productRef, {
                    category_id: reassignToCategoryId,
                    updated_at: Timestamp.now()
                });
            } else {
                batch.update(productRef, {
                    category_id: null,
                    category_name: null,
                    category_slug: null,
                    updated_at: Timestamp.now()
                });
            }
        });

        // Delete the category
        const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
        batch.delete(categoryRef);

        // Commit all changes
        await batch.commit();
    } catch (error) {
        console.error('Error force deleting category:', error);
        throw error;
    }
}

/**
 * Update product count for a category
 */
export async function updateCategoryProductCount(categoryId: string): Promise<void> {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('category_id', '==', categoryId));
        const snapshot = await getDocs(q);

        const count = snapshot.size;

        const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
        await updateDoc(categoryRef, {
            product_count: count,
            updated_at: Timestamp.now()
        });
    } catch (error) {
        console.error('Error updating category product count:', error);
        throw error;
    }
}

/**
 * Update all category product counts
 * Useful for maintenance or after bulk operations
 */
export async function updateAllCategoryProductCounts(): Promise<void> {
    try {
        const categories = await getAllCategories();

        for (const category of categories) {
            await updateCategoryProductCount(category.id);
        }
    } catch (error) {
        console.error('Error updating all category product counts:', error);
        throw error;
    }
}

/**
 * Generate URL-safe slug from category name
 */
export function generateCategorySlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Validate category data
 */
export function validateCategoryData(data: Partial<Category>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.name !== undefined) {
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Category name is required');
        }
        if (data.name.length > 100) {
            errors.push('Category name must be less than 100 characters');
        }
    }

    if (data.slug !== undefined) {
        if (!data.slug || data.slug.trim().length === 0) {
            errors.push('Category slug is required');
        }
        if (!/^[a-z0-9-]+$/.test(data.slug)) {
            errors.push('Category slug must contain only lowercase letters, numbers, and hyphens');
        }
    }

    if (data.description !== undefined && data.description.length > 500) {
        errors.push('Description must be less than 500 characters');
    }

    if (data.order !== undefined && (data.order < 0 || data.order > 1000)) {
        errors.push('Order must be between 0 and 1000');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
