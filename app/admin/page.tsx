'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminPage() {
  const { isAdmin, login, logout, products, adminEmail } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Invalid email or password');
    }
    setLoading(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🔐</span>
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 mt-2">Sign in with your admin credentials</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="admin@bubblecake.com"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            Only authorized administrators can access this panel.
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{adminEmail}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 p-4 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors"
            >
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-medium text-gray-800">View Orders</p>
                <p className="text-sm text-gray-500">Manage customer orders</p>
              </div>
            </Link>
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
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
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
