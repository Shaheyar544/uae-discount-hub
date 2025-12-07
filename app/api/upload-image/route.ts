// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

export const runtime = 'nodejs'; // Ensure Node.js runtime for Sharp

interface UploadResult {
    original: string;
    medium: string;
    small: string;
}

export async function POST(request: NextRequest) {
    try {
        // Get the form data
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const productId = formData.get('productId') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!productId) {
            return NextResponse.json(
                { error: 'No product ID provided' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Generate timestamp and clean filename
        const timestamp = Date.now();
        const cleanFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const baseFilename = `${timestamp}_${cleanFilename}`;

        // Generate optimized versions
        const [originalWebp, mediumWebp, smallWebp] = await Promise.all([
            // Original size optimized as WebP
            sharp(buffer)
                .webp({ quality: 85 })
                .toBuffer(),

            // Medium: 400px wide
            sharp(buffer)
                .resize(400, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: 80 })
                .toBuffer(),

            // Small thumbnail: 100px wide
            sharp(buffer)
                .resize(100, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: 75 })
                .toBuffer()
        ]);

        // Upload all versions to Firebase Storage
        const originalRef = ref(storage, `products/${productId}/original_${baseFilename.replace(/\.[^.]+$/, '.webp')}`);
        const mediumRef = ref(storage, `products/${productId}/medium_${baseFilename.replace(/\.[^.]+$/, '.webp')}`);
        const smallRef = ref(storage, `products/${productId}/small_${baseFilename.replace(/\.[^.]+$/, '.webp')}`);

        await Promise.all([
            uploadBytes(originalRef, originalWebp, { contentType: 'image/webp' }),
            uploadBytes(mediumRef, mediumWebp, { contentType: 'image/webp' }),
            uploadBytes(smallRef, smallWebp, { contentType: 'image/webp' })
        ]);

        // Get download URLs
        const [originalUrl, mediumUrl, smallUrl] = await Promise.all([
            getDownloadURL(originalRef),
            getDownloadURL(mediumRef),
            getDownloadURL(smallRef)
        ]);

        const result: UploadResult = {
            original: originalUrl,
            medium: mediumUrl,
            small: smallUrl
        };

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error processing image:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process image' },
            { status: 500 }
        );
    }
}
