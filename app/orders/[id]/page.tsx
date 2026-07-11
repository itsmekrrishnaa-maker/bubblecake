'use client';

import Link from 'next/link';
import { useCart, ADVANCE_PERCENTAGE } from '@/context/CartContext';
import { addons as addonData } from '@/data';
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { getOrderById } = useCart();
  const order = getOrderById(params.id);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
        <p className="text-gray-500 mb-6">This order doesn&apos;t exist or may have been cleared.</p>
        <Link href="/orders" className="text-pink-500 hover:text-pink-600 font-medium">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const advanceAmount = Math.round(order.total * ADVANCE_PERCENTAGE);
  const remainingAmount = order.total - advanceAmount;
  const getAddon = (id: string) => addonData.find((a) => a.id === id);
  const orderZone = deliveryZones.find((z) => z.id === order.deliveryZone);

  const handlePrint = () => window.print();

  const handleDownloadInvoice = () => {
    const invoiceContent = `
BUBBLE CAKE - INVOICE
=====================
Order ID: #${order.id.slice(0, 8).toUpperCase()}
Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
Status: ${statusLabels[order.status]}

CUSTOMER DETAILS
----------------
Name: ${order.name}
Phone: ${order.phone}
Address: ${order.address}
${orderZone ? `Delivery Zone: ${orderZone.name} - ${order.deliveryArea}` : ''}
Delivery Date: ${new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

ORDER ITEMS
-----------
${order.items.map((item) => {
  const addonLines = Object.entries(item.addons).map(([addonId, qty]) => {
    const addon = getAddon(addonId);
    return addon ? `  ${addon.emoji} ${addon.name} x${qty} - NPR ${(addon.price * qty).toLocaleString()}` : '';
  }).filter(Boolean).join('\n');
  return `${item.name} x${item.quantity}
  Flavor: ${item.flavor}, Size: ${item.size}
  ${item.message ? `Message: "${item.message}"` : ''}
  ${item.referenceImage ? 'Reference image: Attached' : ''}
  Subtotal: NPR ${item.price.toLocaleString()}
${addonLines}`;
}).join('\n\n')}

PAYMENT
-------
Subtotal: NPR ${(order.total - (order.deliveryFee || 0)).toLocaleString()}
Delivery Fee: ${(order.deliveryFee || 0) === 0 ? 'Free' : `NPR ${(order.deliveryFee || 0).toLocaleString()}`}
Total: NPR ${order.total.toLocaleString()}
Method: ${order.paymentMethod === 'qr' ? 'QR Payment (Advance)' : 'Cash on Delivery'}
${order.paymentMethod === 'qr' ? `Advance Paid: NPR ${advanceAmount.toLocaleString()}\nRemaining on Delivery: NPR ${remainingAmount.toLocaleString()}` : `Full amount: NPR ${order.total.toLocaleString()}`}
${order.remarks ? `\nRemarks: ${order.remarks}` : ''}

=====================
Bubble Cake - Kathmandu, Nepal
info@bubblecake.com | +977-984-1234567
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bubble-cake-invoice-${order.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link href="/orders" className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium mb-6 print:hidden">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </Link>

      {/* Invoice Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden" id="invoice">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <span className="mr-2">🎂</span> Bubble Cake
              </h1>
              <p className="text-pink-100 text-sm">Kathmandu, Nepal</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">INVOICE</p>
              <p className="text-pink-100 text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="p-6 border-b grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="font-medium text-gray-800">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-400">
              {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Payment</p>
            <p className="font-medium text-gray-800">
              {order.paymentMethod === 'qr' ? '📱 QR Payment' : '💵 Cash on Delivery'}
            </p>
          </div>
        </div>

        {/* Delivery Date */}
        <div className="p-6 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-sm text-gray-500">Delivery Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(order.deliveryDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                })}
              </p>
              {orderZone && order.deliveryArea && (
                <p className="text-sm text-pink-600 mt-1">
                  {orderZone.icon} {orderZone.name} - {order.deliveryArea} (Est. {orderZone.estimatedTime})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-6 border-b grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Customer</p>
            <p className="font-medium text-gray-800">{order.name}</p>
            <p className="text-sm text-gray-600">{order.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
            <p className="text-sm text-gray-800">{order.address}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start space-x-3">
                    {item.referenceImage && (
                      <img src={item.referenceImage} alt="Reference" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{item.flavor} · {item.size}</p>
                      {item.message && <p className="text-sm text-pink-500 mt-1">&quot;{item.message}&quot;</p>}
                      {item.referenceImage && <p className="text-xs text-blue-500 mt-1">📎 Reference image attached</p>}
                    </div>
                  </div>
                  <span className="font-bold text-gray-800">NPR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
                {Object.entries(item.addons).length > 0 && (
                  <div className="ml-15 space-y-1 mt-2 pt-2 border-t border-gray-200">
                    {Object.entries(item.addons).map(([addonId, qty]) => {
                      const addon = getAddon(addonId);
                      if (!addon || qty === 0) return null;
                      return (
                        <div key={addonId} className="flex justify-between text-sm text-gray-600">
                          <span>{addon.emoji} {addon.name} x{qty}</span>
                          <span>NPR {(addon.price * qty).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 border-t bg-gray-50">
          <div className="max-w-xs ml-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">NPR {(order.total - (order.deliveryFee || 0)).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className={`font-medium ${(order.deliveryFee || 0) === 0 ? 'text-green-600' : ''}`}>
                {(order.deliveryFee || 0) === 0 ? 'Free' : `NPR ${order.deliveryFee}`}
              </span>
            </div>
            {order.paymentMethod === 'qr' && (
              <>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Advance Paid ({Math.round(ADVANCE_PERCENTAGE * 100)}%)</span>
                  <span className="font-medium">NPR {advanceAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Remaining on Delivery</span>
                  <span className="font-medium">NPR {remainingAmount.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-pink-600">NPR {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {order.remarks && (
          <div className="p-6 border-t">
            <p className="text-sm text-gray-500 mb-1">Remarks</p>
            <p className="text-gray-800">{order.remarks}</p>
          </div>
        )}

        {/* Payment Screenshot */}
        {order.paymentScreenshot && (
          <div className="p-6 border-t">
            <p className="text-sm text-gray-500 mb-2">Payment Screenshot</p>
            <img src={order.paymentScreenshot} alt="Payment proof" className="w-full max-w-xs h-40 object-cover rounded-xl border" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          🖨️ Print Invoice
        </button>
        <button
          onClick={handleDownloadInvoice}
          className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          📥 Download Invoice
        </button>
        <Link
          href="/"
          className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-colors text-center"
        >
          Order More Cakes
        </Link>
      </div>

      {/* Print-only footer */}
      <div className="hidden print:block mt-8 text-center text-sm text-gray-500 border-t pt-4">
        <p>Bubble Cake | Kathmandu, Nepal | info@bubblecake.com | +977-984-1234567</p>
        <p>Thank you for your order!</p>
      </div>
    </div>
  );
}
