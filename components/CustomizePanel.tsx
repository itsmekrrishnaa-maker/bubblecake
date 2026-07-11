'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { deliveryZones, DeliveryZone } from '@/data/locations';

interface Addon {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
}

interface CustomizePanelProps {
  basePrice: number;
  addons: Addon[];
  cakeName: string;
}

interface SelectedAddons {
  [key: string]: number;
}

function getFlavorFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('vanilla')) return 'vanilla';
  if (lower.includes('chocolate')) return 'chocolate';
  if (lower.includes('strawberry')) return 'strawberry';
  if (lower.includes('red velvet')) return 'redvelvet';
  if (lower.includes('butterscotch')) return 'butterscotch';
  return 'chocolate';
}

export default function CustomizePanel({ basePrice, addons, cakeName }: CustomizePanelProps) {
  const [selectedFlavor, setSelectedFlavor] = useState('chocolate');
  const [selectedSize, setSelectedSize] = useState('small');
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});
  const [cakeMessage, setCakeMessage] = useState('');
  const [noMessage, setNoMessage] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [locationError, setLocationError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart, isCartOpen, closeCart, editingItem, updateCartItem, cancelEdit } = useCart();

  const currentZone = deliveryZones.find((z) => z.id === selectedZone);
  const availableAreas = currentZone?.areas || [];

  const scrollToField = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (!editingItem) {
      setSelectedFlavor(getFlavorFromName(cakeName));
    }
  }, [cakeName, editingItem]);

  useEffect(() => {
    if (editingItem) {
      setSelectedFlavor(editingItem.flavor);
      setSelectedSize(editingItem.size);
      setSelectedAddons(editingItem.addons);
      setCakeMessage(editingItem.message);
      setNoMessage(!editingItem.message);
      setReferenceImage(editingItem.referenceImage || null);
      setSelectedZone(editingItem.deliveryZone);
      setSelectedArea(editingItem.deliveryArea);
      setMessageError(false);
    }
  }, [editingItem]);

  const flavors = [
    { id: 'chocolate', name: 'Chocolate', emoji: '🍫' },
    { id: 'vanilla', name: 'Vanilla', emoji: '🍦' },
    { id: 'strawberry', name: 'Strawberry', emoji: '🍓' },
    { id: 'redvelvet', name: 'Red Velvet', emoji: '❤️' },
    { id: 'butterscotch', name: 'Butterscotch', emoji: '🍬' },
  ];

  const sizes = [
    { id: 'mini', name: 'Mini', weight: '0.5 lb', multiplier: 0.6, serves: '1-2 people' },
    { id: 'small', name: '1 lb', weight: '1 lb', multiplier: 1, serves: '4-6 people' },
    { id: 'medium', name: '1.5 lb', weight: '1.5 lb', multiplier: 1.5, serves: '6-8 people' },
    { id: 'large', name: '2 lb', weight: '2 lb', multiplier: 2, serves: '8-12 people' },
    { id: 'xlarge', name: '3 lb', weight: '3 lb', multiplier: 2.8, serves: '12-16 people' },
  ];

  const handleAddonQuantity = (addonId: string, change: number) => {
    setSelectedAddons((prev) => {
      const current = prev[addonId] || 0;
      const newQuantity = Math.max(0, Math.min(current + change, 10));
      if (newQuantity === 0) {
        const { [addonId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [addonId]: newQuantity };
    });
  };

  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
    setSelectedArea('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const calculateCakeTotal = () => {
    const sizeMultiplier = sizes.find((s) => s.id === selectedSize)?.multiplier || 1;
    const cakePrice = basePrice * sizeMultiplier;
    const addonsPrice = Object.entries(selectedAddons).reduce((total, [addonId, quantity]) => {
      const addon = addons.find((a) => a.id === addonId);
      return total + (addon?.price || 0) * quantity;
    }, 0);
    return Math.round(cakePrice + addonsPrice);
  };

  const getDeliveryFee = () => {
    return currentZone?.deliveryFee || 0;
  };

  const calculateTotal = () => {
    return calculateCakeTotal() + getDeliveryFee();
  };

  const handleAddToCart = () => {
    if (!selectedZone || !selectedArea) {
      setLocationError(true);
      scrollToField(locationRef);
      return;
    }
    if (!noMessage && !cakeMessage.trim()) {
      setMessageError(true);
      scrollToField(messageRef);
      return;
    }
    setLocationError(false);
    setMessageError(false);
    addItem({
      name: cakeName,
      price: calculateTotal(),
      quantity: 1,
      flavor: selectedFlavor,
      size: selectedSize,
      message: noMessage ? '' : cakeMessage,
      addons: selectedAddons,
      referenceImage: referenceImage || undefined,
      deliveryZone: selectedZone,
      deliveryArea: selectedArea,
    });
    setAddedToCart(true);
    setTimeout(() => {
      openCart();
      setAddedToCart(false);
    }, 600);
  };

  const handleUpdateCart = () => {
    if (!selectedZone || !selectedArea) {
      setLocationError(true);
      scrollToField(locationRef);
      return;
    }
    if (!noMessage && !cakeMessage.trim()) {
      setMessageError(true);
      scrollToField(messageRef);
      return;
    }
    setLocationError(false);
    setMessageError(false);
    if (!editingItem) return;
    updateCartItem(editingItem.id, {
      name: editingItem.name,
      price: calculateTotal(),
      quantity: editingItem.quantity,
      flavor: selectedFlavor,
      size: selectedSize,
      message: noMessage ? '' : cakeMessage,
      addons: selectedAddons,
      referenceImage: referenceImage || undefined,
      deliveryZone: selectedZone,
      deliveryArea: selectedArea,
    });
    setAddedToCart(true);
    setTimeout(() => {
      openCart();
      setAddedToCart(false);
    }, 600);
  };

  return (
    <div className={`space-y-6 ${isCartOpen ? 'pointer-events-none opacity-50' : ''}`}>
      {/* Delivery Location */}
      <div ref={locationRef} className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 scroll-mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📍</span> Delivery Location
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Select your delivery zone</label>
            <select
              value={selectedZone}
              onChange={(e) => handleZoneChange(e.target.value)}
              disabled={isCartOpen}
              className={`w-full p-3 border-2 rounded-xl focus:outline-none bg-white transition-colors ${
                locationError && !selectedZone
                  ? 'border-red-400'
                  : 'border-gray-200 focus:border-pink-500'
              }`}
            >
              <option value="">Choose a zone...</option>
              {deliveryZones.filter((z) => z.available).map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.icon} {zone.name}
                </option>
              ))}
            </select>
          </div>
          {selectedZone && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Select your area</label>
              <select
                value={selectedArea}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  if (locationError) setLocationError(false);
                }}
                disabled={isCartOpen}
                className={`w-full p-3 border-2 rounded-xl focus:outline-none bg-white transition-colors ${
                  locationError && !selectedArea
                    ? 'border-red-400'
                    : 'border-gray-200 focus:border-pink-500'
                }`}
              >
                <option value="">Choose your area...</option>
                {availableAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedZone && currentZone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-lg">
              <span>⏱️</span>
              <span>Estimated delivery: <span className="font-medium text-pink-600">{currentZone.estimatedTime}</span></span>
            </div>
          )}
          {!currentZone?.available && selectedZone && (
            <p className="text-sm text-red-500">Delivery is not available in this zone.</p>
          )}
          {locationError && (
            <p className="text-sm text-red-500">Please select a delivery zone and area</p>
          )}
        </div>
      </div>

      {/* Flavor Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Flavor</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {flavors.map((flavor) => (
            <button
              key={flavor.id}
              onClick={() => setSelectedFlavor(flavor.id)}
              disabled={isCartOpen}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                selectedFlavor === flavor.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <span className="text-2xl">{flavor.emoji}</span>
              <p className="text-sm font-medium text-gray-800 mt-1">{flavor.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Size</h3>
        <div className="grid grid-cols-2 gap-3">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.id)}
              disabled={isCartOpen}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedSize === size.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <p className="font-semibold text-gray-800">{size.name}</p>
              <p className="text-sm text-gray-500">{size.weight}</p>
              <p className="text-xs text-gray-400">Serves {size.serves}</p>
              <p className="text-pink-500 font-medium mt-1">
                NPR {Math.round(basePrice * size.multiplier).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Add-ons <span className="text-sm font-normal text-gray-400">(optional)</span></h3>
        <div className="space-y-3">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className={`addon-card flex items-center justify-between ${
                selectedAddons[addon.id] ? 'selected' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{addon.emoji}</span>
                <div>
                  <p className="font-medium text-gray-800">{addon.name}</p>
                  <p className="text-sm text-gray-500">NPR {addon.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {selectedAddons[addon.id] ? (
                  <>
                    <button
                      onClick={() => handleAddonQuantity(addon.id, -1)}
                      disabled={isCartOpen}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {selectedAddons[addon.id]}
                    </span>
                    <button
                      onClick={() => handleAddonQuantity(addon.id, 1)}
                      disabled={isCartOpen}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAddonQuantity(addon.id, 1)}
                    disabled={isCartOpen}
                    className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-200 transition-colors"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cake Message */}
      <div ref={messageRef} className="scroll-mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Cake Message</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={noMessage}
              onChange={(e) => {
                setNoMessage(e.target.checked);
                if (e.target.checked) setMessageError(false);
              }}
              disabled={isCartOpen}
              className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="text-sm text-gray-500">No message</span>
          </label>
        </div>
        {!noMessage && (
          <>
            <textarea
              value={cakeMessage}
              onChange={(e) => {
                setCakeMessage(e.target.value.slice(0, 50));
                if (messageError) setMessageError(false);
              }}
              placeholder="e.g., Happy Birthday John!"
              disabled={isCartOpen}
              className={`w-full p-3 border-2 rounded-xl focus:outline-none resize-none ${
                messageError
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-gray-200 focus:border-pink-500'
              }`}
              rows={2}
            />
            {messageError && (
              <p className="text-sm text-red-500 mt-1">Please enter a cake message or check &quot;No message&quot;</p>
            )}
            <p className="text-sm text-gray-400 mt-1">{cakeMessage.length}/50 characters</p>
          </>
        )}
      </div>

      {/* Reference Image Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Reference Image <span className="text-sm font-normal text-gray-400">(optional)</span></h3>
        <p className="text-sm text-gray-500 mb-3">Upload a photo of a cake you&apos;d like us to recreate</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {referenceImage ? (
          <div className="relative">
            <img
              src={referenceImage}
              alt="Reference cake"
              className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
            />
            <button
              onClick={() => {
                setReferenceImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isCartOpen}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-pink-400 hover:bg-pink-50 transition-colors"
          >
            <span className="text-3xl block mb-2">📸</span>
            <p className="text-gray-600 font-medium">Click to upload reference image</p>
            <p className="text-sm text-gray-400 mt-1">JPG, PNG up to 5MB</p>
          </button>
        )}
      </div>

      {/* Price Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Cake + Size</span>
          <span className="font-medium">NPR {Math.round(basePrice * (sizes.find((s) => s.id === selectedSize)?.multiplier || 1)).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Add-ons</span>
          <span className="font-medium">
            NPR{' '}
            {Object.entries(selectedAddons)
              .reduce((total, [addonId, quantity]) => {
                const addon = addons.find((a) => a.id === addonId);
                return total + (addon?.price || 0) * quantity;
              }, 0)
              .toLocaleString()}
          </span>
        </div>
        {selectedZone && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Delivery ({currentZone?.name})</span>
            <span className={`font-medium ${getDeliveryFee() === 0 ? 'text-green-600' : ''}`}>
              {getDeliveryFee() === 0 ? 'Free' : `NPR ${getDeliveryFee()}`}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center text-lg font-bold border-t pt-3 mt-3">
          <span className="text-gray-800">Total</span>
          <span className="text-pink-600">NPR {calculateTotal().toLocaleString()}</span>
        </div>
      </div>

      {/* Action Button */}
      {isCartOpen ? (
        <button
          onClick={closeCart}
          className="pointer-events-auto w-full py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl text-center hover:bg-gray-300 transition-colors"
        >
          ← Back to Customize
        </button>
      ) : addedToCart ? (
        <div className="w-full py-4 bg-green-500 text-white font-semibold rounded-xl text-center">
          <span className="text-xl mr-2">✓</span>
          {editingItem ? 'Updated!' : 'Added to Cart!'}
        </div>
      ) : editingItem ? (
        <div className="space-y-3">
          <button
            onClick={handleUpdateCart}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Update Cart - NPR {calculateTotal().toLocaleString()}
          </button>
          <button
            onClick={cancelEdit}
            className="w-full py-3 text-gray-600 font-medium hover:text-pink-600 transition-colors"
          >
            Cancel Edit
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Add to Cart - NPR {calculateTotal().toLocaleString()}
        </button>
      )}
    </div>
  );
}
