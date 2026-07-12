'use client';

import { useState, useRef } from 'react';
import { useCart, ADVANCE_PERCENTAGE } from '@/context/CartContext';
import { deliveryZones } from '@/data/locations';
import { addons as addonData } from '@/data';
import { sendOrderToOwner, sendOrderConfirmation } from '@/lib/whatsapp';

const scrollToField = (ref: React.RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const CUTOFF_HOUR = 18;

function isSameDayDeliveryAvailable(): boolean {
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  return currentHour < CUTOFF_HOUR;
}

function isCustomDateToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return dateStr === todayStr;
}

function isDeliveryDateToday(deliveryOption: string, customDate: string): boolean {
  return deliveryOption === 'today' || (deliveryOption === 'custom' && isCustomDateToday(customDate));
}

function getDaysUntilDelivery(deliveryOption: string, customDate: string): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let deliveryDate: Date;

  if (deliveryOption === 'today') {
    deliveryDate = today;
  } else if (deliveryOption === 'tomorrow') {
    deliveryDate = new Date(today);
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  } else if (deliveryOption === 'custom' && customDate) {
    const [year, month, day] = customDate.split('-').map(Number);
    deliveryDate = new Date(year, month - 1, day);
  } else {
    return '';
  }

  const diffTime = deliveryDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Delivering today!';
  if (diffDays === 1) return 'Delivering tomorrow!';
  return `Delivering in ${diffDays} days`;
}

export default function CheckoutModal() {
  const { items, getTotalPrice, isCheckoutOpen, closeCheckout, placeOrder, orderPlaced, orderDetails } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'qr'>('cod');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<'today' | 'tomorrow' | 'custom'>(() => {
    return isSameDayDeliveryAvailable() ? 'today' : 'tomorrow';
  });
  const [customDate, setCustomDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [qrAmountPaid, setQrAmountPaid] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string; screenshot?: string; date?: string; qrAmount?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const qrAmountRef = useRef<HTMLDivElement>(null);

  const sameDayAvailable = isSameDayDeliveryAvailable();
  const isDeliveryToday = isDeliveryDateToday(deliveryOption, customDate);

  const getDeliveryDate = (): string => {
    const now = new Date();
    if (deliveryOption === 'today') {
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    if (deliveryOption === 'tomorrow') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    }
    return customDate;
  };

  const getMinDate = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  const getMaxDate = (): string => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(2, '0')}-${String(max.getDate()).padStart(2, '0')}`;
  };

  const formatDeliveryDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!isCheckoutOpen) return null;

  if (orderPlaced && orderDetails) {
    const advanceAmount = orderDetails.paymentMethod === 'qr' ? (Number(qrAmountPaid) || 0) : 0;
    const remainingAmount = orderDetails.total - advanceAmount;
    const orderZone = deliveryZones.find((z) => z.id === orderDetails.deliveryZone);

    if (typeof window !== 'undefined' && !sessionStorage.getItem(`whatsapp-sent-${orderDetails.id}`)) {
      sessionStorage.setItem(`whatsapp-sent-${orderDetails.id}`, 'true');
      setTimeout(() => sendOrderToOwner(orderDetails), 1000);
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center max-h-[90vh] overflow-y-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-4">Thank you, {orderDetails.name}! Your order has been confirmed.</p>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Phone:</span> {orderDetails.phone}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address:</span> {orderDetails.address}
            </p>
            {orderZone && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Delivery Zone:</span> {orderZone.icon} {orderZone.name} - {orderDetails.deliveryArea}
              </p>
            )}
            <p className="text-sm text-gray-600">
              <span className="font-medium">Delivery:</span> {formatDeliveryDate(orderDetails.deliveryDate)}
              {deliveryTime && <span className="ml-2">at {deliveryTime}</span>}
            </p>
            <div className="border-t pt-2 mt-2">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="text-sm text-gray-600 mb-2">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs">Flavor: {item.flavor} | Size: {item.size} | Qty: {item.quantity}</p>
                  {Object.entries(item.addons).map(([addonId, qty]) => {
                    const addon = addonData.find(a => a.id === addonId);
                    if (!addon || qty === 0) return null;
                    return <p key={addonId} className="text-xs">{addon.emoji} {addon.name} x{qty}</p>;
                  })}
                  {item.message && <p className="text-xs text-pink-500">Message: &quot;{item.message}&quot;</p>}
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2 space-y-1">
              {orderDetails.deliveryFee !== undefined && orderDetails.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">NPR {orderDetails.deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">NPR {orderDetails.total.toLocaleString()}</span>
              </div>
              {orderDetails.paymentMethod === 'qr' && (
                <>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Amount Paid</span>
                    <span className="font-medium">NPR {advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Due on Delivery</span>
                    <span className="font-medium">NPR {remainingAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
            {orderDetails.remarks && (
              <div className="border-t pt-2 mt-2">
                <p className="text-sm text-gray-600"><span className="font-medium">Remarks:</span> {orderDetails.remarks}</p>
              </div>
            )}
            {orderDetails.paymentScreenshot && (
              <div className="border-t pt-2 mt-2">
                <p className="text-sm text-gray-600 font-medium mb-1">Payment Screenshot:</p>
                <img src={orderDetails.paymentScreenshot} alt="Payment proof" className="w-full h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-4">We&apos;ll contact you shortly to confirm your order.</p>

          <div className="space-y-3">
            <button
              onClick={() => sendOrderConfirmation(orderDetails)}
              className="w-full py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send Order on WhatsApp
            </button>
            <div className="flex gap-3">
              <a
                href={`/orders/${orderDetails.id}`}
                className="flex-1 py-2 px-4 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors text-sm"
              >
                View Order Details
              </a>
              <a
                href="/orders"
                className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                All Orders
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasMessage = items.some((item) => item.message);
  const total = getTotalPrice();
  const firstItemZone = items[0]?.deliveryZone;
  const firstItemArea = items[0]?.deliveryArea;
  const zoneInfo = deliveryZones.find((z) => z.id === firstItemZone);
  const totalDeliveryFee = zoneInfo?.deliveryFee || 0;
  const totalWithDelivery = total + totalDeliveryFee;
  const qrPaidAmount = Number(qrAmountPaid) || 0;
  const dueAmount = totalWithDelivery - qrPaidAmount;

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Screenshot must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentScreenshot(reader.result as string);
      if (errors.screenshot) setErrors((prev) => ({ ...prev, screenshot: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const validate = (): React.RefObject<HTMLDivElement> | null => {
    const newErrors: typeof errors = {};
    if (!customerName.trim()) newErrors.name = 'Please enter your name';
    if (!phone.trim()) newErrors.phone = 'Please enter your phone number';
    else if (!/^\d{10}$/.test(phone.trim())) newErrors.phone = 'Phone number must be exactly 10 digits';
    else if (!/^(98|97|96)\d{8}$/.test(phone.trim())) newErrors.phone = 'Must be valid Nepali number (98, 97, or 96 prefix)';
    if (!deliveryAddress.trim()) newErrors.address = 'Please enter your delivery address';
    else if (deliveryAddress.trim().length > 50) newErrors.address = 'Address must be 50 characters or less';
    if (paymentMethod === 'qr' && !paymentScreenshot) newErrors.screenshot = 'Please upload payment screenshot';
    if (paymentMethod === 'qr' && qrPaidAmount <= 0) newErrors.qrAmount = 'Please enter the amount you paid';
    if (paymentMethod === 'qr' && qrPaidAmount > totalWithDelivery) newErrors.qrAmount = 'Amount cannot exceed total';
    if (deliveryOption === 'custom' && !customDate) newErrors.date = 'Please select a delivery date';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) return null;

    if (newErrors.name) return nameRef;
    if (newErrors.phone) return phoneRef;
    if (newErrors.date) return dateRef;
    if (newErrors.address) return addressRef;
    if (newErrors.qrAmount) return qrAmountRef;
    if (newErrors.screenshot) return screenshotRef;
    return null;
  };

  const handlePlaceOrder = () => {
    const firstErrorRef = validate();
    if (firstErrorRef) {
      scrollToField(firstErrorRef);
      return;
    }
    placeOrder({
      name: customerName.trim(),
      phone: phone.trim(),
      address: deliveryAddress.trim(),
      paymentMethod,
      advancePaid: paymentMethod === 'qr' ? qrPaidAmount : 0,
      paymentScreenshot: paymentScreenshot || undefined,
      remarks: remarks.trim() || undefined,
      referenceImage: items.find((i) => i.referenceImage)?.referenceImage,
      deliveryDate: getDeliveryDate(),
      deliveryZone: firstItemZone || '',
      deliveryArea: firstItemArea || '',
      deliveryFee: totalDeliveryFee,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={closeCheckout} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto checkout-modal-enter">
        <div className="sticky top-0 bg-white border-b p-5 flex items-center justify-between z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
          <button onClick={closeCheckout} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
            {zoneInfo && (
              <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-xl mb-3">
                <span className="text-lg">{zoneInfo.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{zoneInfo.name}</p>
                  <p className="text-xs text-gray-500">{firstItemArea}</p>
                </div>
              </div>
            )}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="font-medium">NPR {item.price.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 capitalize">Flavor: {item.flavor} | Size: {item.size} | Qty: {item.quantity}</p>
                  {Object.entries(item.addons).map(([addonId, qty]) => {
                    const addon = addonData.find(a => a.id === addonId);
                    if (!addon || qty === 0) return null;
                    return <p key={addonId} className="text-xs text-gray-500">{addon.emoji} {addon.name} x{qty} - NPR {(addon.price * qty).toLocaleString()}</p>;
                  })}
                  {item.referenceImage && <p className="text-xs text-blue-500">📎 Reference image attached</p>}
                </div>
              ))}
            </div>
            {zoneInfo && (
              <div className="flex justify-between text-sm mt-3">
                <span className="text-gray-600">🚚 Delivery ({zoneInfo.name})</span>
                <span className={`font-medium ${totalDeliveryFee === 0 ? 'text-green-600' : ''}`}>
                  {totalDeliveryFee === 0 ? 'Free' : `NPR ${totalDeliveryFee}`}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center mt-3 pt-3 border-t font-bold text-lg">
              <span>Total</span>
              <span className="text-pink-600">NPR {totalWithDelivery.toLocaleString()}</span>
            </div>
          </div>

          {/* Cake Messages */}
          {hasMessage && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Message on Cake</h3>
              <div className="space-y-2">
                {items.filter((item) => item.message).map((item) => (
                  <div key={item.id} className="p-3 bg-pink-50 rounded-xl">
                    <p className="text-sm text-gray-600">{item.name}:</p>
                    <p className="font-medium text-gray-800">&quot;{item.message}&quot;</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Details</h3>
            <div ref={nameRef} className="scroll-mt-4">
              <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); if (errors.name) setErrors((prev) => ({ ...prev, name: undefined })); }}
                placeholder="e.g., Ram Shrestha"
                className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-200 focus:border-pink-500'}`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div ref={phoneRef} className="scroll-mt-4">
              <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                id="customer-phone"
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined })); }}
                placeholder="e.g., 9841234567"
                maxLength={10}
                className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-pink-500'}`}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              {!errors.phone && phone.length > 0 && phone.length < 10 && (
                <p className="text-sm text-red-500 mt-1">Enter valid mobile number</p>
              )}
              {!errors.phone && phone.length === 10 && !/^(98|97|96)\d{8}$/.test(phone) && (
                <p className="text-sm text-red-500 mt-1">Enter valid mobile number</p>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div ref={addressRef} className="scroll-mt-4">
            <label htmlFor="delivery-address" className="block text-lg font-semibold text-gray-800 mb-3">
              Delivery Address <span className="text-red-400">*</span>
            </label>
            <textarea
              id="delivery-address"
              value={deliveryAddress}
              onChange={(e) => { setDeliveryAddress(e.target.value.slice(0, 50)); if (errors.address) setErrors((prev) => ({ ...prev, address: undefined })); }}
              placeholder="Street, area, landmark, city..."
              maxLength={50}
              className={`w-full p-3 border-2 rounded-xl focus:outline-none resize-none ${errors.address ? 'border-red-400' : 'border-gray-200 focus:border-pink-500'}`}
              rows={3}
            />
            {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            <p className="text-xs text-gray-400 mt-1">{deliveryAddress.length}/50 characters</p>
          </div>

          {/* Delivery Date */}
          <div ref={dateRef} className="scroll-mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Delivery Date <span className="text-red-400">*</span></h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <button
                onClick={() => sameDayAvailable && setDeliveryOption('today')}
                disabled={!sameDayAvailable}
                className={`p-3 rounded-xl border-2 transition-all text-center ${!sameDayAvailable ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' : deliveryOption === 'today' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <span className="text-2xl block mb-1">📍</span>
                <p className="font-semibold text-gray-800 text-sm">Today</p>
              </button>
              <button
                onClick={() => setDeliveryOption('tomorrow')}
                className={`p-3 rounded-xl border-2 transition-all text-center ${deliveryOption === 'tomorrow' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <span className="text-2xl block mb-1">📅</span>
                <p className="font-semibold text-gray-800 text-sm">Tomorrow</p>
              </button>
              <button
                onClick={() => setDeliveryOption('custom')}
                className={`p-3 rounded-xl border-2 transition-all text-center ${deliveryOption === 'custom' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <span className="text-2xl block mb-1">📆</span>
                <p className="font-semibold text-gray-800 text-sm">Pick Date</p>
              </button>
            </div>

            {deliveryOption === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => { setCustomDate(e.target.value); if (errors.date) setErrors((prev) => ({ ...prev, date: undefined })); }}
                min={getMinDate()}
                max={getMaxDate()}
                className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.date ? 'border-red-400' : 'border-gray-200 focus:border-pink-500'}`}
              />
            )}
            {deliveryOption !== 'custom' && (
              <p className="text-sm text-gray-500 mt-1">
                Delivery on: <span className="font-medium text-pink-600">{formatDeliveryDate(getDeliveryDate())}</span>
              </p>
            )}

            {(deliveryOption === 'today' || deliveryOption === 'tomorrow' || (deliveryOption === 'custom' && customDate)) && (
              <div className="mt-2 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                <p className="text-sm font-semibold text-pink-600">{getDaysUntilDelivery(deliveryOption, customDate)}</p>
              </div>
            )}
          </div>

          {/* Delivery Time (Optional) */}
          <div>
            <label htmlFor="delivery-time" className="block text-lg font-semibold text-gray-800 mb-3">
              Preferred Delivery Time <span className="text-sm font-normal text-gray-400">(optional)</span>
            </label>
            <select
              id="delivery-time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
            >
              <option value="">No preference</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
              <option value="evening">Evening (4 PM - 8 PM)</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="block text-lg font-semibold text-gray-800 mb-3">
              Remarks <span className="text-sm font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value.slice(0, 200))}
              placeholder="Any special instructions? Delivery time preference? Color theme? ..."
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none resize-none"
              rows={2}
            />
            <p className="text-sm text-gray-400 mt-1">{remarks.length}/200 characters</p>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${paymentMethod === 'cod' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <span className="text-3xl block mb-2">💵</span>
                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-sm text-gray-500">Pay full amount when you receive</p>
              </button>
              <button
                onClick={() => setPaymentMethod('qr')}
                className={`p-4 rounded-xl border-2 transition-all text-center ${paymentMethod === 'qr' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <span className="text-3xl block mb-2">📱</span>
                <p className="font-semibold text-gray-800">QR Payment</p>
                <p className="text-sm text-gray-500">Partial or full payment via QR</p>
              </button>
            </div>

            {paymentMethod === 'qr' && (
              <div className="mt-4 p-6 bg-gray-50 rounded-xl space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Scan this QR code to pay</p>
                  <div className="w-48 h-48 mx-auto bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-gray-200">
                    <img src="/images/payment-qr.svg" alt="Payment QR Code" className="w-40 h-40" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Order</span>
                    <span className="font-medium">NPR {totalWithDelivery.toLocaleString()}</span>
                  </div>
                </div>

                <div ref={qrAmountRef} className="scroll-mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount You Paid <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={qrAmountPaid}
                    onChange={(e) => { setQrAmountPaid(e.target.value); if (errors.qrAmount) setErrors((prev) => ({ ...prev, qrAmount: undefined })); }}
                    placeholder="Enter amount"
                    min={1}
                    max={totalWithDelivery}
                    className={`w-full p-3 border-2 rounded-xl focus:outline-none ${errors.qrAmount ? 'border-red-400' : 'border-gray-200 focus:border-pink-500'}`}
                  />
                  {errors.qrAmount && <p className="text-sm text-red-500 mt-1">{errors.qrAmount}</p>}
                </div>

                {qrPaidAmount > 0 && (
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Amount Paid</span>
                      <span>NPR {qrPaidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Due on Delivery</span>
                      <span className="font-medium">NPR {Math.max(0, dueAmount).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">eSewa / Khalti / IME Pay / Bank Transfer</p>

                <div ref={screenshotRef} className="scroll-mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payment Screenshot <span className="text-red-400">*</span>
                  </label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                  {paymentScreenshot ? (
                    <div className="relative">
                      <img src={paymentScreenshot} alt="Payment screenshot" className="w-full h-40 object-cover rounded-xl border-2 border-gray-200" />
                      <button
                        onClick={() => { setPaymentScreenshot(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-lg"
                      >
                        ×
                      </button>
                      <p className="text-xs text-green-600 mt-1">✓ Screenshot uploaded</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-pink-400 hover:bg-pink-50 transition-colors"
                    >
                      <span className="text-2xl block mb-1">📷</span>
                      <p className="text-gray-600 font-medium text-sm">Click to upload payment screenshot</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                    </button>
                  )}
                  {errors.screenshot && <p className="text-sm text-red-500 mt-1">{errors.screenshot}</p>}
                </div>

                <p className="text-xs text-gray-500 text-center bg-yellow-50 p-2 rounded-lg">
                  Please upload screenshot immediately after payment. Our team will verify and confirm your order.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-5 space-y-3 rounded-b-2xl">
          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            Place Order
          </button>
          <button
            onClick={closeCheckout}
            className="w-full py-3 text-gray-600 font-medium hover:text-pink-600 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
