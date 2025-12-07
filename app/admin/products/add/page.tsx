import ProductForm from '@/components/admin/ProductForm';

export default function AddProductPage() {
    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-600 mt-1">Create a new product listing</p>
            </div>
            <ProductForm />
        </div>
    );
}
