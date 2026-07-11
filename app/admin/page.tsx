'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminPage() {
  const { isAdmin, login, products } = useAdmin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (login(pin)) {
      setPin('');
      setError('');
    } else {
      setError('Invalid PIN. Default PIN is 1234');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🔐</span>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 mt-2">Enter your admin PIN to continue</p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                PIN Code
              </label>
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className={`w-full p-3 border-2 rounded-xl text-center text-2xl tracking-widest focus:outline-none ${
                  error ? 'border-red-400' : 'border-gray-200 focus:border-indigo-500'
                }`}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Login
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Default PIN: 1234
          </p>
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(products.map(p => p.category)));
  const trendingCount = products.filter(p => p.trending).length;
  const popularCount = products.filter(p => p.popular).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{products.length}</p>
              </div>
              <span className="text-4xl">🎂</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
              </div>
              <span className="text-4xl">📁</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Trending</p>
                <p className="text-3xl font-bold text-orange-500">{trendingCount}</p>
              </div>
              <span className="text-4xl">🔥</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Popular</p>
                <p className="text-3xl font-bold text-yellow-500">{popularCount}</p>
              </div>
              <span className="text-4xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/products"
              className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-gray-800">View Products</p>
                <p className="text-sm text-gray-500">Manage your product catalog</p>
              </div>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl">➕</span>
              <div>
                <p className="font-medium text-gray-800">Add Product</p>
                <p className="text-sm text-gray-500">Create a new cake product</p>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
            >
              <span className="text-2xl">🏪</span>
              <div>
                <p className="font-medium text-gray-800">View Store</p>
                <p className="text-sm text-gray-500">See your public storefront</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/admin/products?category=${category}`}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-center"
              >
                <p className="font-medium text-gray-800 capitalize">{category}</p>
                <p className="text-sm text-gray-500">
                  {products.filter(p => p.category === category).length} products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
