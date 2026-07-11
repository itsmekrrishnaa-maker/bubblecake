'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductTable from '@/components/admin/ProductTable';

const categories = [
  { id: 'all', name: 'All', emoji: '📋' },
  { id: 'birthday', name: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', name: 'Anniversary', emoji: '💝' },
  { id: 'kids', name: 'Kids', emoji: '🧸' },
  { id: 'bento', name: 'Bento', emoji: '🍱' },
  { id: 'custom', name: 'Custom', emoji: '✨' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { products, deleteProduct, isAdmin } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.some(c => c.id === category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

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

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-500 mt-1">{products.length} total products</p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            Add Product
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{cat.emoji}</span>
                {cat.name}
                {cat.id !== 'all' && (
                  <span className="ml-1 text-xs opacity-75">
                    ({products.filter(p => p.category === cat.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <ProductTable products={filteredProducts} onDelete={deleteProduct} />
      </div>
    </AdminLayout>
  );
}
