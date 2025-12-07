import CategoryForm from '@/components/admin/CategoryForm';

export default function AddCategoryPage() {
    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                <p className="text-sm text-gray-600 mt-1">Create a new product category</p>
            </div>
            <CategoryForm />
        </div>
    );
}
