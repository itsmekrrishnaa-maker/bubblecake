'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { deliveryZones } from '@/data/locations';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

export default function OrdersPage() {
  const { orders, fetchOrders } = useCart();
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      fetchOrders(phone.trim());
      setSearched(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {/* Phone Search Form */}
      {!searched && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Find Your Orders</h2>
          <p className="text-gray-500 mb-4">Enter the phone number you used when placing your order.</p>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 9848874295"
              className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
            >
              Find Orders
            </button>
          </form>
        </div>
      )}

      {/* Search Again */}
      {searched && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing orders for: <span className="font-medium">{phone}</span>
          </p>
          <button
            onClick={() => { setSearched(false); setPhone(''); }}
            className="text-sm text-pink-500 hover:text-pink-600 font-medium"
          >
            Search different number
          </button>
        </div>
      )}

      {/* Orders List */}
      {searched && orders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-6xl block mb-4">📦</span>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h2>
          <p className="text-gray-400 mb-6">No orders found for this phone number.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            Browse Cakes
          </Link>
        </div>
      ) : searched ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderZone = deliveryZones.find((z) => z.id === order.deliveryZone);
            return (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-5 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                  <p className="text-xs text-blue-600">
                    📦 Delivery: {new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </p>
                  {orderZone && order.deliveryArea && (
                    <p className="text-xs text-pink-600">
                      📍 {orderZone.icon} {orderZone.name} - {order.deliveryArea}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        {item.referenceImage && (
                          <img
                            src={item.referenceImage}
                            alt="Reference"
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{item.flavor} · {item.size} · Qty: {item.quantity}</p>
                          {item.message && (
                            <p className="text-xs text-pink-500">&quot;{item.message}&quot;</p>
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-gray-700">NPR {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {order.paymentMethod === 'qr' ? '📱 QR Payment' : '💵 Cash on Delivery'}
                    </span>
                    {order.paymentMethod === 'qr' && order.advancePaid > 0 && (
                      <span className="text-xs text-green-600">Advance: NPR {order.advancePaid.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-pink-600">NPR {order.total.toLocaleString()}</span>
                    <button
                      onClick={() => window.print()}
                      className="text-sm text-gray-500 hover:text-gray-700 print:hidden"
                    >
                      🖨️ Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
