'use client';

import Link from 'next/link';
import CustomizePanel from '@/components/CustomizePanel';
import { cakes, addons } from '@/data';

export default function CakeDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const cake = cakes.find((c) => c.id === id);

  if (!cake) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Cake Not Found</h1>
          <p className="text-gray-600 mb-8">The cake you are looking for does not exist.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-pink-500 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/categories/${cake.category}`} className="hover:text-pink-500 transition-colors">
              {cake.category.charAt(0).toUpperCase() + cake.category.slice(1)}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-800 font-medium">{cake.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Cake Image */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={cake.image}
              alt={cake.name}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
            {cake.trending && (
              <span className="absolute top-4 right-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-full">
                🔥 Trending
              </span>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{cake.name}</h1>
            <p className="text-gray-600 mb-4">{cake.description}</p>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-pink-500">
                NPR {cake.price.toLocaleString()}
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                {cake.category.charAt(0).toUpperCase() + cake.category.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Cake</h2>
          <CustomizePanel basePrice={cake.price} addons={addons} cakeName={cake.name} />
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Cakes
        </Link>
      </div>
    </div>
  );
}
