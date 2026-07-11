'use client';

import Link from 'next/link';
import { Product } from '@/context/AdminContext';

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">📦</span>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-400 mb-6">Add some cakes to get started!</p>
        <Link
          href="/admin/products/new"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Product</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/48?text=🍰';
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-800">NPR {product.price.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {product.trending && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs font-medium">
                        🔥 Trending
                      </span>
                    )}
                    {product.popular && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs font-medium">
                        ⭐ Popular
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
