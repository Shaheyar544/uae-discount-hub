// lib/image-upload-helpers.ts

export interface ImageUrls {
    original: string;
    medium: string;
    small: string;
}

/**
 * Upload an image file via the API route which generates 3 optimized sizes
 */
export async function uploadImageWithThumbnails(
    file: File,
    productId: string
): Promise<ImageUrls> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', productId);

    const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
    }

    return await response.json();
}

/**
 * Upload multiple images and return all URLs
 */
export async function uploadMultipleImages(
    files: File[],
    productId: string,
    onProgress?: (current: number, total: number) => void
): Promise<ImageUrls[]> {
    const results: ImageUrls[] = [];

    for (let i = 0; i < files.length; i++) {
        const imageUrls = await uploadImageWithThumbnails(files[i], productId);
        results.push(imageUrls);

        if (onProgress) {
            onProgress(i + 1, files.length);
        }
    }

    return results;
}
