'use client';

import Link from 'next/link';
import FloatingBubbles from '@/components/FloatingBubbles';
import HeroSlider from '@/components/HeroSlider';
import CakeGrid from '@/components/CakeGrid';
import { useAdmin } from '@/context/AdminContext';

export default function Home() {
  const { products } = useAdmin();
  const trendingCakes = products.filter((cake) => cake.trending);
  const popularCakes = products.filter((cake) => cake.popular);

  return (
    <div className="relative">
      {/* Floating Bubbles */}
      <FloatingBubbles />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <HeroSlider />
      </section>

      {/* Welcome Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-pink-500">Bubble Cake</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creating delicious memories for your special occasions.
            From birthdays to anniversaries, we have the perfect cake for every celebration.
          </p>
        </div>

        {/* Quick Category Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <Link
            href="/categories/birthday"
            className="bg-gradient-to-br from-pink-100 to-pink-200 p-6 rounded-2xl text-center hover:shadow-lg transition-all transform hover:scale-105"
          >
            <span className="text-4xl block mb-2">🎂</span>
            <span className="font-semibold text-gray-800">Birthday</span>
          </Link>
          <Link
            href="/categories/anniversary"
            className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl text-center hover:shadow-lg transition-all transform hover:scale-105"
          >
            <span className="text-4xl block mb-2">💝</span>
            <span className="font-semibold text-gray-800">Anniversary</span>
          </Link>
          <Link
            href="/categories/kids"
            className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl text-center hover:shadow-lg transition-all transform hover:scale-105"
          >
            <span className="text-4xl block mb-2">🧸</span>
            <span className="font-semibold text-gray-800">Kids</span>
          </Link>
          <Link
            href="/categories/bento"
            className="bg-gradient-to-br from-teal-100 to-teal-200 p-6 rounded-2xl text-center hover:shadow-lg transition-all transform hover:scale-105"
          >
            <span className="text-4xl block mb-2">🍱</span>
            <span className="font-semibold text-gray-800">Bento</span>
          </Link>
          <Link
            href="/categories/custom"
            className="bg-gradient-to-br from-orange-100 to-orange-200 p-6 rounded-2xl text-center hover:shadow-lg transition-all transform hover:scale-105"
          >
            <span className="text-4xl block mb-2">✨</span>
            <span className="font-semibold text-gray-800">Custom</span>
          </Link>
        </div>
      </section>

      {/* Trending Cakes */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CakeGrid cakes={trendingCakes} title="🔥 Trending Now" viewAllLink="/categories/birthday" />
      </section>

      {/* Popular Cakes */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CakeGrid cakes={popularCakes} title="⭐ Popular Cakes" viewAllLink="/categories/anniversary" />
      </section>

      {/* Why Choose Us */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600">We use only the finest and freshest ingredients for our cakes.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Custom Designs</h3>
            <p className="text-gray-600">Get your cake designed exactly as you envision it.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Same-day delivery available across Kathmandu.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
