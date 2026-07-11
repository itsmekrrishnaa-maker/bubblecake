'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Orders', href: '/admin/orders', icon: '📦' },
  { name: 'Products', href: '/admin/products', icon: '🎂' },
  { name: 'Add Product', href: '/admin/products/new', icon: '➕' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, logout } = useAdmin();

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-2xl">⚙️</span>
              <span className="text-xl font-bold">Admin Panel</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-400 transition-colors text-sm"
              >
                View Store
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-400 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  pathname === item.href
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
