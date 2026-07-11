'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getProductById, updateProduct, isAdmin } = useAdmin();
  const product = getProductById(params.id);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <span className="text-6xl block mb-4">🔐</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">Please login to access admin panel</p>
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">🔍</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/admin/products"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = (data: Parameters<typeof updateProduct>[1]) => {
    updateProduct(params.id, data);
    router.push('/admin/products');
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-500 mt-1">Update {product.name}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin/products')}
            isEditing
          />
        </div>
      </div>
    </AdminLayout>
  );
}
