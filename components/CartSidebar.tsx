'use client';

import { useCart } from '@/context/CartContext';
import { addons } from '@/data';
import { deliveryZones } from '@/data/locations';

const sizes = [
  { id: 'mini', name: 'Mini', weight: '0.5 lb', multiplier: 0.6, serves: '1-2 people' },
  { id: 'small', name: '1 lb', weight: '1 lb', multiplier: 1, serves: '4-6 people' },
  { id: 'medium', name: '1.5 lb', weight: '1.5 lb', multiplier: 1.5, serves: '6-8 people' },
  { id: 'large', name: '2 lb', weight: '2 lb', multiplier: 2, serves: '8-12 people' },
  { id: 'xlarge', name: '3 lb', weight: '3 lb', multiplier: 2.8, serves: '12-16 people' },
];

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, isCartOpen, closeCart, openCheckout, startEditItem, clearCart, maxQuantity } = useCart();
  const { updateCartItem } = useCart();

  if (!isCartOpen) return null;

  const getAddonDetails = (addonId: string) => addons.find((a) => a.id === addonId);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={closeCart} />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col cart-sidebar-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <div className="flex items-center space-x-2">
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-4">🛒</span>
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some delicious cakes!</p>
            </div>
          ) : (
            items.map((item) => {
              const sizeData = sizes.find((s) => s.id === item.size);
              const zoneInfo = deliveryZones.find((z) => z.id === item.deliveryZone);
              const addonsTotal = Object.entries(item.addons).reduce((sum, [addonId, qty]) => {
                const addon = getAddonDetails(addonId);
                return sum + (addon?.price || 0) * qty;
              }, 0);
              const deliveryFee = zoneInfo?.deliveryFee || 0;
              const cakePrice = item.price - addonsTotal - deliveryFee;

              return (
                <div key={item.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3">
                      {item.referenceImage && (
                        <img
                          src={item.referenceImage}
                          alt="Reference"
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{item.flavor} &middot; {sizeData?.name || item.size} ({sizeData?.weight})</p>
                        {sizeData && (
                          <p className="text-xs text-gray-400">Serves {sizeData.serves}</p>
                        )}
                        {item.referenceImage && (
                          <p className="text-xs text-blue-500">📎 Reference image</p>
                        )}
                        {item.deliveryZone && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                              {zoneInfo?.icon} {item.deliveryArea}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditItem(item.id)}
                        className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Select Size (lbs):</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => {
                        const currentSizeMultiplier = sizes.find((s) => s.id === item.size)?.multiplier || 1;
                        const basePrice = cakePrice / currentSizeMultiplier;
                        const addonsTotal = Object.entries(item.addons).reduce((sum, [addonId, qty]) => {
                          const addon = getAddonDetails(addonId);
                          return sum + (addon?.price || 0) * qty;
                        }, 0);
                        const newSizePrice = Math.round(basePrice * size.multiplier + addonsTotal + deliveryFee);

                        return (
                          <button
                            key={size.id}
                            onClick={() => {
                              updateCartItem(item.id, {
                                ...item,
                                size: size.id,
                                price: newSizePrice,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              item.size === size.id
                                ? 'bg-pink-500 text-white shadow-md'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300'
                            }`}
                          >
                            {size.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-1 text-sm border-t pt-3">
                    <div className="flex justify-between text-gray-600">
                      <span className="capitalize">Cake ({item.flavor}) - {sizeData?.name || item.size}</span>
                      <span>NPR {cakePrice.toLocaleString()}</span>
                    </div>
                    {Object.entries(item.addons).map(([addonId, qty]) => {
                      const addon = getAddonDetails(addonId);
                      if (!addon || qty === 0) return null;
                      return (
                        <div key={addonId} className="flex justify-between text-gray-600">
                          <span>{addon.emoji} {addon.name} x{qty}</span>
                          <span>NPR {(addon.price * qty).toLocaleString()}</span>
                        </div>
                      );
                    })}
                    {item.deliveryZone && (
                      <div className="flex justify-between text-gray-600">
                        <span>🚚 Delivery</span>
                        <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                          {deliveryFee === 0 ? 'Free' : `NPR ${deliveryFee}`}
                        </span>
                      </div>
                    )}
                    {item.message && (
                      <div className="flex justify-between text-pink-500">
                        <span>Message</span>
                        <span className="text-xs truncate ml-2">&quot;{item.message}&quot;</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-2">
                      <span>Subtotal</span>
                      <span className="text-pink-600">NPR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-5 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
              <span className="text-pink-600">NPR {getTotalPrice().toLocaleString()}</span>
            </div>
            <button
              onClick={openCheckout}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeCart}
              className="w-full py-3 text-gray-600 font-medium hover:text-pink-600 transition-colors"
            >
              ← Back to Customize
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
