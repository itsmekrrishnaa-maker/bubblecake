'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { useCart, OrderDetails } from '@/context/CartContext';
import AdminLayout from '@/components/admin/AdminLayout';

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

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'] as const;

export default function AdminOrdersPage() {
  const { isAdmin } = useAdmin();
  const { orders, fetchOrders } = useCart();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <span className="text-6xl block mb-4">🔐</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">Please login to access admin panel</p>
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(o => o.status === selectedStatus);

  const statusCounts = statusOptions.reduce((acc, status) => {
    acc[status] = orders.filter(o => o.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  const handleStatusChange = async (orderId: string, newStatus: OrderDetails['status']) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh orders from API
        await fetchOrders();
      }
    } catch {
      // Error updating status
    }
    setUpdatingId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            <p className="text-gray-500 mt-1">{orders.length} total orders</p>
          </div>
          <button
            onClick={() => fetchOrders()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({orders.length})
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {statusLabels[status]} ({statusCounts[status] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <span className="text-6xl block mb-4">📦</span>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h2>
            <p className="text-gray-400">
              {selectedStatus === 'all' ? 'No orders yet' : `No ${statusLabels[selectedStatus].toLowerCase()} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div
                  className="p-5 border-b bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                      {order.paymentMethod === 'qr' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          📱 QR
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.name} • {order.phone}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-pink-600">NPR {order.total.toLocaleString()}</span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="p-5 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Customer Details</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-gray-500">Name:</span> {order.name}</p>
                          <p><span className="text-gray-500">Phone:</span> {order.phone}</p>
                          <p><span className="text-gray-500">Address:</span> {order.address}</p>
                          <p><span className="text-gray-500">Delivery Date:</span> {order.deliveryDate}</p>
                          {order.deliveryArea && (
                            <p><span className="text-gray-500">Delivery Area:</span> {order.deliveryArea}</p>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
                              <div className="flex justify-between">
                                <span className="font-medium">{item.name}</span>
                                <span>NPR {item.price.toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-gray-500 capitalize">
                                {item.flavor} • {item.size} • Qty: {item.quantity}
                              </p>
                              {item.message && (
                                <p className="text-sm text-pink-500 mt-1">"{item.message}"</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Payment & Status */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-gray-500">Payment: </span>
                            <span className="font-medium">
                              {order.paymentMethod === 'qr' ? '📱 QR Payment' : '💵 Cash on Delivery'}
                            </span>
                          </div>
                          {order.paymentMethod === 'qr' && order.advancePaid > 0 && (
                            <div className="text-sm">
                              <span className="text-gray-500">Advance: </span>
                              <span className="font-medium text-green-600">NPR {order.advancePaid.toLocaleString()}</span>
                            </div>
                          )}
                          {order.remarks && (
                            <div className="text-sm">
                              <span className="text-gray-500">Remarks: </span>
                              <span className="font-medium">{order.remarks}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Update */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Update Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderDetails['status'])}
                            disabled={updatingId === order.id}
                            className="p-2 border-2 border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {statusLabels[status]}
                              </option>
                            ))}
                          </select>
                          {updatingId === order.id && (
                            <span className="text-xs text-gray-400">Saving...</span>
                          )}
                        </div>
                      </div>

                      {/* Payment Screenshot */}
                      {order.paymentScreenshot && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500 mb-2">Payment Screenshot:</p>
                          <img
                            src={order.paymentScreenshot}
                            alt="Payment proof"
                            className="w-full max-w-xs h-40 object-cover rounded-xl border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
