'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
    images: File[];
    existingImages: string[];
    onChange: (files: File[]) => void;
    onExistingImagesChange: (urls: string[]) => void;
    maxImages?: number;
    maxSizeMB?: number;
}

export default function ImageUpload({
    images,
    existingImages,
    onChange,
    onExistingImagesChange,
    maxImages = 10,
    maxSizeMB = 5
}: ImageUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalImages = images.length + existingImages.length;

    const validateFile = (file: File): string | null => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            return `${file.name} is not an image file`;
        }

        // Check file size (convert MB to bytes)
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return `${file.name} is too large (max ${maxSizeMB}MB)`;
        }

        return null;
    };

    const handleFiles = (fileList: FileList | null) => {
        if (!fileList) return;

        setError('');
        const files = Array.from(fileList);

        // Check total image count
        if (totalImages + files.length > maxImages) {
            setError(`Maximum ${maxImages} images allowed`);
            return;
        }

        // Validate each file
        const errors: string[] = [];
        const validFiles: File[] = [];

        files.forEach(file => {
            const validationError = validateFile(file);
            if (validationError) {
                errors.push(validationError);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            setError(errors.join(', '));
        }

        if (validFiles.length > 0) {
            onChange([...images, ...validFiles]);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const removeExistingImage = (index: number) => {
        const newExistingImages = existingImages.filter((_, i) => i !== index);
        onExistingImagesChange(newExistingImages);
    };

    return (
        <div className="space-y-4">
            {/* Drag and Drop Zone */}
            {totalImages < maxImages && (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />

                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to {maxSizeMB}MB ({maxImages - totalImages} remaining)
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Image Previews */}
            {(existingImages.length > 0 || images.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Existing images from server */}
                    {existingImages.map((url, index) => (
                        <div key={`existing-${index}`} className="relative group aspect-square">
                            <Image
                                src={url}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary text-white text-xs rounded">
                                    Main
                                </div>
                            )}
                        </div>
                    ))}

                    {/* New images to upload */}
                    {images.map((file, index) => (
                        <div key={`new-${index}`} className="relative group aspect-square">
                            <Image
                                src={URL.createObjectURL(file)}
                                alt={`New image ${index + 1}`}
                                fill
                                className="object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                            <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                                New
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info */}
            <p className="text-xs text-gray-500">
                First image will be used as the main product image. Maximum {maxImages} images.
            </p>
        </div>
    );
}
