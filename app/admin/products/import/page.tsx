'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, CloudArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
    parseCSV,
    suggestFieldMapping,
    validateProducts,
    generateErrorCSV,
    downloadCSV,
    type FieldMapping,
    type ValidationResult
} from '@/lib/import-helpers';
import { batchCreateProducts } from '@/lib/firebase/db';

type Step = 'upload' | 'mapping' | 'validation' | 'importing' | 'complete';

export default function BulkImportPage() {
    const router = useRouter();

    // State
    const [currentStep, setCurrentStep] = useState<Step>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
    const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
    const [importResults, setImportResults] = useState<{ success: string[]; errors: any[] } | null>(null);

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        try {
            // Parse CSV
            const data = await parseCSV(selectedFile);
            setParsedData(data);

            // Auto-suggest field mappings
            if (data.length > 0) {
                const columns = Object.keys(data[0]);
                const mappings: Record<string, string> = {};

                columns.forEach(column => {
                    const suggestion = suggestFieldMapping(column);
                    if (suggestion.confidence >= 50) {
                        mappings[column] = suggestion.mappedField;
                    }
                });

                setFieldMappings(mappings);
            }

            setCurrentStep('mapping');
        } catch (error: any) {
            alert('Failed to parse CSV: ' + error.message);
        }
    };

    // Handle field mapping change
    const handleMappingChange = (columnName: string, mappedField: string) => {
        setFieldMappings(prev => ({
            ...prev,
            [columnName]: mappedField
        }));
    };

    // Proceed to validation
    const handleCompleteMapping = async () => {
        try {
            // Invert mapping: { column → field } to { field → column }
            const invertedMapping: Record<string, string> = {};
            Object.entries(fieldMappings).forEach(([column, field]) => {
                if (field) {
                    invertedMapping[field] = column;
                }
            });

            // Validate all products
            const results = await validateProducts(parsedData, invertedMapping, (current, total) => {
                // Could show progress here
            });

            setValidationResults(results);
            setCurrentStep('validation');
        } catch (error: any) {
            alert('Validation failed: ' + error.message);
        }
    };

    // Download error CSV
    const handleDownloadErrors = () => {
        const failedResults = validationResults.filter(r => !r.valid);
        const errorCSV = generateErrorCSV(failedResults, parsedData);
        downloadCSV(errorCSV, 'import_errors.csv');
    };

    // Start import
    const handleStartImport = async () => {
        setCurrentStep('importing');
        setImporting(true);

        try {
            // Get only valid products
            const validProducts = validationResults
                .filter(r => r.valid)
                .map(r => r.data);

            setImportProgress({ current: 0, total: validProducts.length });

            //  Batch create products
            const results = await batchCreateProducts(validProducts);

            setImportResults(results);
            setCurrentStep('complete');
        } catch (error: any) {
            alert('Import failed: ' + error.message);
        } finally {
            setImporting(false);
        }
    };

    // Download sample CSV template
    const handleDownloadTemplate = () => {
        const template = [
            { title: 'Samsung Galaxy S24', brand: 'Samsung', description: 'Latest flagship smartphone', category: 'smartphones' },
            { title: 'MacBook Air M2', brand: 'Apple', description: 'Thin and light laptop', category: 'laptops' }
        ];
        const csv = 'title,brand,description,category\n' +
            template.map(p => `"${p.title}","${p.brand}","${p.description}","${p.category}"`).join('\n');
        downloadCSV(csv, 'product_import_template.csv');
    };

    const validCount = validationResults.filter(r => r.valid).length;
    const errorCount = validationResults.filter(r => !r.valid).length;

    return (
        <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bulk Import Products</h1>
                    <p className="text-sm text-gray-600 mt-1">Import multiple products from CSV file</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    {[
                        { id: 'upload', label: 'Upload File' },
                        { id: 'mapping', label: 'Field Mapping' },
                        { id: 'validation', label: 'Validation' },
                        { id: 'importing', label: 'Import' },
                        { id: 'complete', label: 'Complete' }
                    ].map((step, index, arr) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className={`flex-1 h-2 rounded-full ${arr.findIndex(s => s.id === currentStep) >= index ? 'bg-primary' : 'bg-gray-200'
                                }`} />
                            {index < arr.length - 1 && <div className="w-2" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Upload File */}
            {currentStep === 'upload' && (
                <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h2 className="text-lg font-semibold mb-4">Upload CSV File</h2>

                    <div className="space-y-4">
                        {/* Download Template */}
                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            Download CSV Template
                        </button>

                        {/* Upload Zone */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                            <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 mb-3">Upload your CSV file</p>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="csv-upload"
                            />
                            <label
                                htmlFor="csv-upload"
                                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                            >
                                Choose File
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Field Mapping */}
            {currentStep === 'mapping' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Map CSV Columns to Product Fields</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Review and adjust the AI-suggested field mappings
                    </p>

                    <div className="space-y-3 mb-6">
                        {Object.keys(parsedData[0] || {}).map(column => {
                            const suggestion = suggestFieldMapping(column);
                            return (
                                <div key={column} className="flex items-center gap-3">
                                    <div className="w-1/3">
                                        <span className="font-medium text-sm">{column}</span>
                                        {suggestion.confidence >= 80 && <span className="ml-2 text-xs text-green-600">🟢 {suggestion.confidence}%</span>}
                                        {suggestion.confidence >= 50 && suggestion.confidence < 80 && <span className="ml-2 text-xs text-yellow-600">🟡 {suggestion.confidence}%</span>}
                                        {suggestion.confidence < 50 && <span className="ml-2 text-xs text-red-600">🔴 {suggestion.confidence}%</span>}
                                    </div>
                                    <div className="w-1/3">
                                        <select
                                            value={fieldMappings[column] || ''}
                                            onChange={(e) => handleMappingChange(column, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        >
                                            <option value="">Skip this column</option>
                                            <option value="title">Title *</option>
                                            <option value="brand">Brand</option>
                                            <option value="description">Description</option>
                                            <option value="category_id">Category *</option>
                                            <option value="images">Images (URL)</option>
                                        </select>
                                    </div>
                                    <div className="w-1/3 text-sm text-gray-600 truncate">
                                        {parsedData[0][column]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleCompleteMapping}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Continue to Validation
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Validation */}
            {currentStep === 'validation' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Validation Results</h2>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Valid Products</p>
                            <p className="text-3xl font-bold text-green-600">{validCount}</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Failed Products</p>
                            <p className="text-3xl font-bold text-red-600">{errorCount}</p>
                        </div>
                    </div>

                    {errorCount > 0 && (
                        <div className="mb-6">
                            <button
                                onClick={handleDownloadErrors}
                                className="flex items-center gap-2 text-red-600 hover:underline text-sm"
                            >
                                <DocumentArrowDownIcon className="w-5 h-5" />
                                Download Error Report (CSV)
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setCurrentStep('mapping')}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Back to Mapping
                        </button>
                        <button
                            onClick={handleStartImport}
                            disabled={validCount === 0}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                        >
                            Import {validCount} Products
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Importing */}
            {currentStep === 'importing' && (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-lg font-semibold mb-2">Importing Products...</h2>
                    <p className="text-gray-600">
                        {importProgress.current} of {importProgress.total} products imported
                    </p>
                </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 'complete' && importResults && (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold mb-2">Import Complete!</h2>
                    <div className="mb-6">
                        <p className="text-green-600 text-lg font-semibold">
                            {importResults.success.length} products imported successfully
                        </p>
                        {importResults.errors.length > 0 && (
                            <p className="text-red-600">
                                {importResults.errors.length} products failed
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => router.push('/admin/products')}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            View Products
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Import More
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
