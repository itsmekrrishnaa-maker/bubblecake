'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cakes as defaultCakes } from '@/data';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  trending: boolean;
  popular: boolean;
}

interface AdminContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  isAdmin: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
}

const PRODUCTS_STORAGE_KEY = 'bubble-cake-products';
const ADMIN_AUTH_KEY = 'bubble-cake-admin-auth';
const ADMIN_PIN = '1234';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function loadProducts(): Product[] {
  if (typeof window === 'undefined') return defaultCakes as Product[];
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return defaultCakes as Product[];
}

function saveProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch {}
}

function loadAdminAuth(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(ADMIN_AUTH_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

function saveAdminAuth(isAdmin: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_AUTH_KEY, String(isAdmin));
  } catch {}
}

function generateProductId(category: string, existingProducts: Product[]): string {
  const categoryProducts = existingProducts.filter(p => p.category === category);
  const nextNum = categoryProducts.length + 1;
  return `${category}-${nextNum}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProducts(loadProducts());
    setIsAdmin(loadAdminAuth());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) saveProducts(products);
  }, [products, isLoaded]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: generateProductId(product.category, products),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  const getProductsByCategory = (category: string) => products.filter(p => p.category === category);

  const login = (pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      setIsAdmin(true);
      saveAdminAuth(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    saveAdminAuth(false);
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
}
