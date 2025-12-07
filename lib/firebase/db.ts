// lib/firebase/db.ts
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
    limit,
    Timestamp,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';

// ============================================
// PRODUCT OPERATIONS
// ============================================

export interface Product {
    id?: string;
    title: string;
    description: string;
    images: string[];
    category_id: string;
    brand: string;
    specs: Record<string, any>;
    pros: string[];
    cons: string[];
    seo: {
        meta_title?: string;
        meta_description?: string;
        slug: string;
    };
    created_at: Timestamp;
    updated_at: Timestamp;
}

export interface Price {
    marketplace: string;
    price: number;
    currency: string;
    in_stock: boolean;
    last_updated: Timestamp;
    affiliate_url: string;
    discount_percent: number;
    // Error recovery fields
    retry_count: number;
    next_retry_at: Timestamp | null;
    last_error: string | null;
    status: 'success' | 'pending' | 'retrying' | 'failed';
    consecutive_failures: number;
}

// Get all products
export async function getAllProducts(limitCount: number = 50) {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('created_at', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];
}

// Get product by ID
export async function getProductById(productId: string) {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
        return null;
    }

    return {
        id: productSnap.id,
        ...productSnap.data()
    } as Product;
}

// Get product by slug
export async function getProductBySlug(slug: string) {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('seo.slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data()
    } as Product;
}

// Get products by category
export async function getProductsByCategory(categoryId: string, limitCount: number = 20) {
    const productsRef = collection(db, 'products');
    const q = query(
        productsRef,
        where('category_id', '==', categoryId),
        orderBy('created_at', 'desc'),
        limit(limitCount)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];
}

// Get product prices
export async function getProductPrices(productId: string): Promise<Price[]> {
    const pricesRef = collection(db, 'products', productId, 'prices');
    const snapshot = await getDocs(pricesRef);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Price, 'id'>
    })) as Price[];
}

// Get best price for a product
export async function getBestPrice(productId: string) {
    const prices = await getProductPrices(productId);

    if (prices.length === 0) return null;

    // Filter only in-stock and successful prices
    const availablePrices = prices.filter(p => p.in_stock && p.status === 'success');

    if (availablePrices.length === 0) return null;

    // Return the lowest price
    return availablePrices.reduce((min, price) =>
        price.price < min.price ? price : min
    );
}

// Create product
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const productsRef = collection(db, 'products');
    const now = Timestamp.now();

    const docRef = await addDoc(productsRef, {
        ...product,
        created_at: now,
        updated_at: now
    });

    return docRef.id;
}

// Update product
export async function updateProduct(productId: string, updates: Partial<Product>) {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
        ...updates,
        updated_at: Timestamp.now()
    });
}

// Delete product
export async function deleteProduct(productId: string) {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
}

// Get total product count
export async function getProductsCount() {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    return snapshot.size;
}

// Advanced search with pagination
export async function searchProductsAdvanced(
    searchQuery: string = '',
    categoryId: string | null = null,
    page: number = 1,
    limitCount: number = 20
) {
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('created_at', 'desc'));

    // Apply category filter if provided
    if (categoryId) {
        q = query(productsRef, where('category_id', '==', categoryId), orderBy('created_at', 'desc'));
    }

    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Product[];

    // Client-side search filter
    if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        products = products.filter(product =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.brand.toLowerCase().includes(searchLower)
        );
    }

    // Pagination
    const total = products.length;
    const start = (page - 1) * limitCount;
    const end = start + limitCount;
    const paginatedProducts = products.slice(start, end);

    return {
        products: paginatedProducts,
        total,
        page,
        totalPages: Math.ceil(total / limitCount)
    };
}

// Upload product images to Firebase Storage
export async function uploadProductImages(files: File[], productId: string): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `products/${productId}/${filename}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    });

    return await Promise.all(uploadPromises);
}

// Delete product images from Firebase Storage
export async function deleteProductImages(imageUrls: string[]) {
    const deletePromises = imageUrls.map(async (url) => {
        try {
            // Extract path from URL
            const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
            const storageRef = ref(storage, path);
            await deleteObject(storageRef);
        } catch (error) {
            console.error('Error deleting image:', url, error);
        }
    });

    await Promise.all(deletePromises);
}

// Create product with initial prices
export async function createProductWithPrices(
    product: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
    prices: Omit<Price, 'id'>[] = []
) {
    const productId = await createProduct(product);

    // Add prices if provided
    if (prices.length > 0) {
        const pricesRef = collection(db, 'products', productId, 'prices');
        const pricePromises = prices.map(price =>
            addDoc(pricesRef, {
                ...price,
                last_updated: Timestamp.now()
            })
        );
        await Promise.all(pricePromises);
    }

    return productId;
}

// Batch create products (for bulk import)
export async function batchCreateProducts(products: Omit<Product, 'id' | 'created_at' | 'updated_at'>[]) {
    const results = {
        success: [] as string[],
        errors: [] as { product: string; error: string }[]
    };

    for (const product of products) {
        try {
            const productId = await createProduct(product);
            results.success.push(productId);
        } catch (error: any) {
            results.errors.push({
                product: product.title,
                error: error.message
            });
        }
    }

    return results;
}

// ============================================
// CATEGORY OPERATIONS
// ============================================

export interface Category {
    id?: string;
    name: string;
    slug: string;
    parent_id: string | null;
    image: string;
    seo: {
        meta_title?: string;
        meta_description?: string;
    };
    order: number;
}

// Get all categories
export async function getAllCategories() {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Category[];
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data()
    } as Category;
}

// ============================================
// ANALYTICS OPERATIONS
// ============================================

export async function trackEvent(eventType: string, productId: string, marketplace: string) {
    const analyticsRef = collection(db, 'analytics');

    await addDoc(analyticsRef, {
        event_type: eventType,
        product_id: productId,
        marketplace,
        timestamp: Timestamp.now(),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        conversion_tracked: false
    });
}

// Track affiliate click
export async function trackAffiliateClick(productId: string, marketplace: string) {
    await trackEvent('affiliate_click', productId, marketplace);
}

// ============================================
// SLIDER OPERATIONS
// ============================================

export interface Slider {
    id?: string;
    title: string;
    description: string;
    image_url: string;
    video_url?: string;
    cta_text: string;
    cta_link: string;
    order: number;
    active: boolean;
    lottie_animation?: string;
}

// Get active sliders
export async function getActiveSliders() {
    const slidersRef = collection(db, 'sliders');
    const q = query(
        slidersRef,
        where('active', '==', true),
        orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Slider[];
}

// ============================================
// SEARCH OPERATIONS
// ============================================

export async function searchProducts(searchTerm: string, limitCount: number = 20) {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation. For production, consider:
    // 1. Algolia
    // 2. Elasticsearch
    // 3. Cloud Functions with custom indexing

    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    const searchLower = searchTerm.toLowerCase();

    return snapshot.docs
        .map(doc => ({
            id: doc.id,
            ...doc.data()
        }) as Product)
        .filter(product =>
            product.title.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.brand.toLowerCase().includes(searchLower)
        )
        .slice(0, limitCount);
}
