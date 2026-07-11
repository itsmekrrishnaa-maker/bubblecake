'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  name: string;
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
  placeOrder: (data: Omit<OrderDetails, 'id' | 'items' | 'total' | 'status' | 'createdAt'>) => void;
  orderPlaced: boolean;
  orderDetails: OrderDetails | null;
  editingItem: CartItem | null;
  startEditItem: (id: string) => void;
  updateCartItem: (id: string, data: Omit<CartItem, 'id'>) => void;
  cancelEdit: () => void;
  maxQuantity: number;
  orders: OrderDetails[];
  getOrderById: (id: string) => OrderDetails | undefined;
}

const MAX_QUANTITY = 10;
const CART_STORAGE_KEY = 'bubble-cake-cart';
const ORDERS_STORAGE_KEY = 'bubble-cake-orders';
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

function loadOrders(): OrderDetails[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: OrderDetails[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {}
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
    setOrders(loadOrders());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveCart(items);
  }, [items, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveOrders(orders);
  }, [orders, isLoaded]);

  const addonsMatch = (a: { [key: string]: number }, b: { [key: string]: number }) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => a[key] === b[key]);
  };

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setEditingItem(null);
    setItems((prev) => {
      // Check if same cake name already exists (same cake, different flavor/size)
      const sameCakeIndex = prev.findIndex(
        (existing) => existing.name === item.name
      );
      if (sameCakeIndex !== -1) {
        // Update the existing cake with new flavor/size/addons/zone
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

  const placeOrder = (data: Omit<OrderDetails, 'id' | 'items' | 'total' | 'status' | 'createdAt'>) => {
    const newOrder: OrderDetails = {
      id: generateId(),
      items: [...items],
      total: getTotalPrice(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrderDetails(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(false);
      setOrderDetails(null);
      setIsCheckoutOpen(false);
    }, 8000);
  };

  const getOrderById = (id: string) => orders.find((o) => o.id === id);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart,
        isCartOpen, openCart, closeCart,
        isCheckoutOpen, openCheckout, closeCheckout,
        placeOrder, orderPlaced, orderDetails,
        editingItem, startEditItem, updateCartItem, cancelEdit,
        maxQuantity: MAX_QUANTITY,
        orders, getOrderById,
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
