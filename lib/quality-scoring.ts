// lib/quality-scoring.ts
import { type Product } from './firebase/db';

export interface QualityScore {
    total: number; // 0-100
    breakdown: {
        title: number;
        description: number;
        brand: number;
        images: number;
        specs: number;
        proscons: number;
    };
    suggestions: string[];
    grade: 'poor' | 'fair' | 'good' | 'excellent';
}

export function calculateQualityScore(product: Partial<Product>): QualityScore {
    let total = 0;
    const breakdown = {
        title: 0,
        description: 0,
        brand: 0,
        images: 0,
        specs: 0,
        proscons: 0
    };
    const suggestions: string[] = [];

    // Title: 10 points
    if (product.title && product.title.trim().length > 0) {
        breakdown.title = 10;
        total += 10;
    } else {
        suggestions.push('Add a product title');
    }

    // Brand: 10 points
    if (product.brand && product.brand.trim().length > 0) {
        breakdown.brand = 10;
        total += 10;
    } else {
        suggestions.push('Add brand name');
    }

    // Description: 20 points max
    if (product.description) {
        const descLength = product.description.trim().length;
        if (descLength >= 200) {
            breakdown.description = 20;
            total += 20;
        } else if (descLength >= 100) {
            breakdown.description = 15;
            total += 15;
            suggestions.push('Expand description to 200+ characters for maximum score');
        } else if (descLength >= 50) {
            breakdown.description = 10;
            total += 10;
            suggestions.push('Expand description to 100+ characters');
        } else if (descLength > 0) {
            breakdown.description = 5;
            total += 5;
            suggestions.push('Write a detailed description (100+ characters)');
        } else {
            suggestions.push('Add a product description');
        }
    } else {
        suggestions.push('Add a product description');
    }

    // Images: 30 points max
    const imageCount = product.images?.length || 0;
    if (imageCount >= 5) {
        breakdown.images = 30;
        total += 30;
    } else if (imageCount >= 3) {
        breakdown.images = 25;
        total += 25;
        suggestions.push(`Add ${5 - imageCount} more images for perfect score`);
    } else if (imageCount >= 2) {
        breakdown.images = 15;
        total += 15;
        suggestions.push(`Add ${3 - imageCount} more images (minimum 3 recommended)`);
    } else if (imageCount === 1) {
        breakdown.images = 10;
        total += 10;
        suggestions.push('Add at least 2 more images');
    } else {
        suggestions.push('Upload product images (minimum 3 recommended)');
    }

    // Specifications: 20 points max
    const specCount = Object.keys(product.specs || {}).length;
    if (specCount >= 5) {
        breakdown.specs = 20;
        total += 20;
    } else if (specCount >= 3) {
        breakdown.specs = 15;
        total += 15;
        suggestions.push(`Add ${5 - specCount} more specifications for perfect score`);
    } else if (specCount >= 1) {
        breakdown.specs = 10;
        total += 10;
        suggestions.push(`Add ${3 - specCount} more specifications`);
    } else {
        suggestions.push('Add product specifications (minimum 3 recommended)');
    }

    // Pros & Cons: 10 points max
    const prosCount = product.pros?.filter(p => p.trim()).length || 0;
    const consCount = product.cons?.filter(c => c.trim()).length || 0;

    if (prosCount >= 3 && consCount >= 2) {
        breakdown.proscons = 10;
        total += 10;
    } else if (prosCount >= 2 && consCount >= 1) {
        breakdown.proscons = 7;
        total += 7;
        suggestions.push('Add more pros/cons for better comparison (3+ pros, 2+ cons)');
    } else if (prosCount >= 1 || consCount >= 1) {
        breakdown.proscons = 5;
        total += 5;
        suggestions.push('Add pros and cons for product comparison');
    } else {
        suggestions.push('Add pros and cons to help users compare');
    }

    // Determine grade
    let grade: 'poor' | 'fair' | 'good' | 'excellent';
    if (total >= 85) {
        grade = 'excellent';
    } else if (total >= 70) {
        grade = 'good';
    } else if (total >= 50) {
        grade = 'fair';
    } else {
        grade = 'poor';
    }

    return {
        total,
        breakdown,
        suggestions,
        grade
    };
}
