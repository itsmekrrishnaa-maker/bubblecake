'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const categories = [
  { name: 'Birthday', href: '/categories/birthday' },
  { name: 'Anniversary', href: '/categories/anniversary' },
  { name: 'Kids', href: '/categories/kids' },
  { name: 'Bento', href: '/categories/bento' },
  { name: 'Custom', href: '/categories/custom' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { getTotalItems, openCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <>
      <nav className="sticky top-0 z-50 glass border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎂</span>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Bubble Cake
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`nav-link text-gray-600 hover:text-pink-600 transition-colors font-medium ${
                    pathname === category.href ? 'active text-pink-600' : ''
                  }`}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className={`nav-link text-gray-600 hover:text-pink-600 transition-colors font-medium ${
                  pathname === '/contact' ? 'active text-pink-600' : ''
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Cart Icon */}
            <div className="flex items-center space-x-4">
              <Link
                href="/orders"
                className={`hidden md:flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === '/orders' ? 'text-pink-600 bg-pink-50' : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                }`}
              >
                My Orders
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-pink-600"
                onClick={() => setIsMenuOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Scrolling Text Banner */}
      <div className="text-pink-600 py-2 group">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="marquee group-hover:[animation-play-state:paused]">
            <span className="inline-block marquee-content whitespace-nowrap">
              Order your cake now, Delivery available call us: 9876543210 &nbsp;&nbsp;&nbsp;⭐ &nbsp;&nbsp;&nbsp;
              Order your cake now, Delivery available call us: 9876543210 &nbsp;&nbsp;&nbsp;⭐ &nbsp;&nbsp;&nbsp;
              Order your cake now, Delivery available call us: 9876543210 &nbsp;&nbsp;&nbsp;⭐ &nbsp;&nbsp;&nbsp;
              Order your cake now, Delivery available call us: 9876543210 &nbsp;&nbsp;&nbsp;⭐ &nbsp;&nbsp;&nbsp;
              Order your cake now, Delivery available call us: 9876543210 &nbsp;&nbsp;&nbsp;⭐ &nbsp;&nbsp;&nbsp;
              Order your cake now, Delivery available call us: 9876543210 &nbsp;&nbsp;&nbsp;⭐ &nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mt-12 space-y-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`block py-2 text-lg font-medium transition-colors ${
                  pathname === category.href
                    ? 'text-pink-600'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`block py-2 text-lg font-medium transition-colors ${
                pathname === '/contact'
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-pink-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
