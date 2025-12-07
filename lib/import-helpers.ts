// lib/import-helpers.ts
import Papa from 'papaparse';
import Fuse from 'fuzzysort';

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    rowNumber: number;
    data?: any;
}

export interface FieldMapping {
    columnName: string;
    mappedField: string;
    confidence: number; // 0-100
}

export interface DuplicateMatch {
    existingProduct: any;
    incomingProduct: any;
    rowNumber: number;
    matchReason: string;
}

/**
 * Parse CSV file to JSON
 */
export async function parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<any>) => {
                resolve(results.data);
            },
            error: (error: Error) => {
                reject(new Error(`CSV parsing failed: ${error.message}`));
            }
        });
    });
}

/**
 * AI-powered field mapping suggestions using fuzzy string matching
 */
export function suggestFieldMapping(columnName: string): FieldMapping {
    const fieldMappings: Record<string, string[]> = {
        title: ['title', 'product_name', 'prod_name', 'name', 'product_title', 'item_name'],
        brand: ['brand', 'manufacturer', 'make', 'vendor', 'supplier'],
        description: ['description', 'desc', 'details', 'product_description', 'product_details'],
        category_id: ['category', 'cat', 'type', 'product_type', 'product_category'],
        images: ['images', 'image', 'img', 'photo', 'picture', 'image_url'],
        specs: ['specs', 'specifications', 'spec', 'attributes', 'features']
    };

    const cleanColumn = columnName.toLowerCase().trim().replace(/[_\s-]+/g, '');

    let bestMatch: { field: string; confidence: number } | null = null;

    for (const [field, variations] of Object.entries(fieldMappings)) {
        for (const variation of variations) {
            const cleanVariation = variation.toLowerCase().replace(/[_\s-]+/g, '');

            // Exact match
            if (cleanColumn === cleanVariation) {
                return { columnName, mappedField: field, confidence: 100 };
            }

            // Fuzzy match using Levenshtein-like scoring
            const similarity = calculateSimilarity(cleanColumn, cleanVariation);

            if (similarity > 0.7 && (!bestMatch || similarity * 100 > bestMatch.confidence)) {
                bestMatch = { field, confidence: Math.round(similarity * 100) };
            }
        }
    }

    return {
        columnName,
        mappedField: bestMatch?.field || '',
        confidence: bestMatch?.confidence || 0
    };
}

/**
 * Simple similarity calculation (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    // Check if one string contains the other
    if (str1.includes(str2) || str2.includes(str1)) {
        return 0.85;
    }

    // Levenshtein distance
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

/**
 * Validate a single product row
 */
export function validateProductRow(row: any, rowNumber: number, fieldMapping: Record<string, string>): ValidationResult {
    const errors: string[] = [];
    const mappedData: any = {};

    // Get mapped field names
    const titleField = fieldMapping['title'] || 'title';
    const brandField = fieldMapping['brand'] || 'brand';
    const descField = fieldMapping['description'] || 'description';
    const categoryField = fieldMapping['category_id'] || 'category';

    // Required fields validation
    if (!row[titleField] || !row[titleField].toString().trim()) {
        errors.push('Title is missing or empty');
    } else {
        mappedData.title = row[titleField].toString().trim();
    }

    if (!row[categoryField] || !row[categoryField].toString().trim()) {
        errors.push('Category is missing or empty');
    } else {
        mappedData.category_id = row[categoryField].toString().trim();
    }

    // Optional fields
    if (row[brandField]) {
        mappedData.brand = row[brandField].toString().trim();
    } else {
        mappedData.brand = 'Unknown';
    }

    if (row[descField]) {
        mappedData.description = row[descField].toString().trim();
    } else {
        mappedData.description = '';
    }

    // Map other fields
    mappedData.specs = {};
    mappedData.pros = [];
    mappedData.cons = [];
    mappedData.images = [];
    mappedData.seo = {
        slug: mappedData.title ? mappedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '',
        meta_title: null,
        meta_description: null
    };

    return {
        valid: errors.length === 0,
        errors,
        rowNumber,
        data: errors.length === 0 ? mappedData : undefined
    };
}

/**
 * Batch validate all products
 */
export async function validateProducts(
    products: any[],
    fieldMapping: Record<string, string>,
    onProgress?: (current: number, total: number) => void
): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (let i = 0; i < products.length; i++) {
        const result = validateProductRow(products[i], i + 1, fieldMapping);
        results.push(result);

        if (onProgress) {
            onProgress(i + 1, products.length);
        }
    }

    return results;
}

/**
 * Generate CSV of failed rows with error messages
 */
export function generateErrorCSV(failedResults: ValidationResult[], originalData: any[]): string {
    const errorRows = failedResults.map(result => {
        const originalRow = originalData[result.rowNumber - 1];
        return {
            Row: result.rowNumber,
            Errors: result.errors.join('; '),
            ...originalRow
        };
    });

    return Papa.unparse(errorRows);
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
