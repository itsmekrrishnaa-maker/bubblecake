'use client';

import Link from 'next/link';
import CakeGrid from '@/components/CakeGrid';
import { useAdmin } from '@/context/AdminContext';

const categoryInfo: { [key: string]: { title: string; description: string; emoji: string } } = {
  birthday: {
    title: 'Birthday Cakes',
    description: 'Make their birthday extra special with our delicious birthday cakes',
    emoji: '🎂',
  },
  anniversary: {
    title: 'Anniversary Cakes',
    description: 'Celebrate your love with our elegant anniversary cakes',
    emoji: '💝',
  },
  kids: {
    title: 'Kids Cakes',
    description: 'Fun and colorful cakes that kids will love',
    emoji: '🧸',
  },
  bento: {
    title: 'Bento Cakes',
    description: 'Mini cakes perfect for individual servings',
    emoji: '🍱',
  },
  custom: {
    title: 'Custom Cakes',
    description: 'Design your dream cake with our custom options',
    emoji: '✨',
  },
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const { products } = useAdmin();
  const info = categoryInfo[category] || { title: 'Cakes', description: '', emoji: '🍰' };
  const categoryCakes = products.filter((cake) => cake.category === category);

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
          <li className="text-gray-800 font-medium">{info.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-6xl mb-4 block">{info.emoji}</span>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{info.title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{info.description}</p>
      </div>

      {/* Cakes Grid */}
      {categoryCakes.length > 0 ? (
        <CakeGrid cakes={categoryCakes} title={`${info.title}`} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No cakes available in this category yet.</p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Browse All Cakes
          </Link>
        </div>
      )}
    </div>
  );
}
