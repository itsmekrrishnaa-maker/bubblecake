'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  flavor: string;
  size: string;
  message: string;
  addons: { [key: string]: number };
  referenceImage?: string;
  deliveryZone: string;
  deliveryArea: string;
}

interface OrderDetails {
  id: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  name: string;
  recipientName?: string;
  phone: string;
  address: string;
  paymentMethod: 'cod' | 'qr';
  advancePaid: number;
  paymentScreenshot?: string;
  remarks?: string;
  referenceImage?: string;
  deliveryDate: string;
  deliveryZone: string;
  deliveryArea: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  placeOrder: (data: Omit<OrderDetails, 'id' | 'items' | 'total' | 'status' | 'createdAt'>) => Promise<void>;
  orderPlaced: boolean;
  orderDetails: OrderDetails | null;
  editingItem: CartItem | null;
  startEditItem: (id: string) => void;
  updateCartItem: (id: string, data: Omit<CartItem, 'id'>) => void;
  cancelEdit: () => void;
  maxQuantity: number;
  orders: OrderDetails[];
  getOrderById: (id: string) => Promise<OrderDetails | undefined>;
  fetchOrders: (phone?: string) => Promise<void>;
}

const MAX_QUANTITY = 10;
const CART_STORAGE_KEY = 'bubble-cake-cart';
const ADVANCE_PERCENTAGE = 0.5;
const CartContext = createContext<CartContextType | undefined>(undefined);

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

// Map Supabase row to OrderDetails
function mapDbOrder(row: Record<string, unknown>): OrderDetails {
  return {
    id: row.id as string,
    items: row.items as CartItem[],
    total: row.total as number,
    deliveryFee: (row.delivery_fee as number) || 0,
    name: row.name as string,
    recipientName: row.recipient_name as string | undefined,
    phone: row.phone as string,
    address: row.address as string,
    paymentMethod: row.payment_method as 'cod' | 'qr',
    advancePaid: (row.advance_paid as number) || 0,
    paymentScreenshot: row.payment_screenshot as string | undefined,
    remarks: row.remarks as string | undefined,
    referenceImage: row.reference_image as string | undefined,
    deliveryDate: row.delivery_date as string,
    deliveryZone: row.delivery_zone as string,
    deliveryArea: row.delivery_area as string,
    status: row.status as OrderDetails['status'],
    createdAt: row.created_at as string,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  useEffect(() => {
    setItems(loadCart());
    fetchOrders();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveCart(items);
  }, [items, isLoaded]);

  const fetchOrders = async (phone?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const url = phone ? `/api/orders?phone=${encodeURIComponent(phone)}` : '/api/orders';
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.map(mapDbOrder));
      }
    } catch {
      // Fallback to empty array on error
    }
  };

  const addonsMatch = (a: { [key: string]: number }, b: { [key: string]: number }) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => a[key] === b[key]);
  };

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setEditingItem(null);
    setItems((prev) => {
      const sameCakeIndex = prev.findIndex(
        (existing) => existing.name === item.name
      );
      if (sameCakeIndex !== -1) {
        const updated = [...prev];
        updated[sameCakeIndex] = {
          ...updated[sameCakeIndex],
          ...item,
          id: updated[sameCakeIndex].id,
          quantity: updated[sameCakeIndex].quantity,
        };
        return updated;
      }
      return [...prev, { ...item, id: generateId() }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) { removeItem(id); return; }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) } : item)));
  };

  const updateCartItem = (id: string, data: Omit<CartItem, 'id'>) => {
    setEditingItem(null);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
  };

  const startEditItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) { setEditingItem(item); setIsCartOpen(false); }
  };

  const cancelEdit = () => setEditingItem(null);

  const getTotalItems = () => items.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => items.reduce((total, item) => total + item.price * item.quantity, 0);

  const clearCart = () => { setItems([]); setEditingItem(null); };
  const openCart = () => { setIsCartOpen(true); setIsCheckoutOpen(false); };
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => { setIsCheckoutOpen(true); setIsCartOpen(false); };
  const closeCheckout = () => { setIsCheckoutOpen(false); setIsCartOpen(true); };

  const placeOrder = async (data: Omit<OrderDetails, 'id' | 'items' | 'total' | 'status' | 'createdAt'>) => {
    const newOrder: OrderDetails = {
      id: generateId(),
      items: [...items],
      total: getTotalPrice() + (data.deliveryFee || 0),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        const savedOrder = await res.json();
        // Use the saved order from DB (with server-generated fields)
        setOrders((prev) => [mapDbOrder(savedOrder), ...prev]);
        setOrderDetails(mapDbOrder(savedOrder));
      } else {
        // Fallback: save locally if API fails
        setOrders((prev) => [newOrder, ...prev]);
        setOrderDetails(newOrder);
      }
    } catch {
      // Fallback: save locally if API fails
      setOrders((prev) => [newOrder, ...prev]);
      setOrderDetails(newOrder);
    }

    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setOrderDetails(null);
      setIsCheckoutOpen(false);
    }, 30000);
  };

  const getOrderById = async (id: string): Promise<OrderDetails | undefined> => {
    // First check local state
    const local = orders.find((o) => o.id === id);
    if (local) return local;

    // Fetch from API
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        return mapDbOrder(data);
      }
    } catch {}
    return undefined;
  };

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart,
        isCartOpen, openCart, closeCart,
        isCheckoutOpen, openCheckout, closeCheckout,
        placeOrder, orderPlaced, orderDetails,
        editingItem, startEditItem, updateCartItem, cancelEdit,
        maxQuantity: MAX_QUANTITY,
        orders, getOrderById, fetchOrders,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export { ADVANCE_PERCENTAGE };
export type { OrderDetails, CartItem };
