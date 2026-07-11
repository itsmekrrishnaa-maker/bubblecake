'use client';

import Link from 'next/link';

interface Cake {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  trending: boolean;
  popular: boolean;
}

interface CakeCardProps {
  cake: Cake;
}

export default function CakeCard({ cake }: CakeCardProps) {
  return (
    <Link href={`/cakes/${cake.id}`}>
      <div className="cake-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={cake.image}
            alt={cake.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          
          {/* Category Badge */}
          <span className="category-badge">
            {cake.category.charAt(0).toUpperCase() + cake.category.slice(1)}
          </span>

          {/* Trending Badge */}
          {cake.trending && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
              🔥 Trending
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{cake.name}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{cake.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="price-tag">NPR {cake.price.toLocaleString()}</span>
            <button className="px-4 py-2 bg-pink-500 text-white text-sm font-medium rounded-full hover:bg-pink-600 transition-colors">
              Customize
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
