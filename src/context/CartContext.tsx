"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string; // unique string generated from customization hashing
  baseProductId: number;
  baseProductName: string;
  baseProductPrice: number;
  filmLayoutId: number;
  filmLayoutName: string;
  filmLayoutPrice: number;
  resellerMargin: number;
  customText: string;
  customImageUrl: string;
  customImageResolution: string;
  frameColorTint: string;
  frameSizeLayout: string; // Mini, Square, Wide
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartGst: () => number;
  getCartTotal: () => number;
  getResellerEarnings: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("snapframe_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("snapframe_cart", JSON.stringify(newCart));
  };

  const addToCart = (newItem: Omit<CartItem, "id" | "quantity">, quantity = 1) => {
    // Generate unique ID based on customization details to isolate unique configurations
    const customHash = `${newItem.baseProductId}-${newItem.filmLayoutId}-${newItem.frameSizeLayout}-${newItem.frameColorTint}-${newItem.customText}-${newItem.customImageUrl}-${newItem.resellerMargin}`;
    
    const existingIndex = cart.findIndex((item) => item.id === customHash);
    
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { ...newItem, id: customHash, quantity }]);
    }
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Pricing model math helper
  // P_customer = (P_base + P_customization + M_reseller) * 1.18
  // where:
  // P_base = frame price + film layout price
  // P_customization = customization fee (e.g. ₹50 standard print processing if image is custom, otherwise 0)
  // M_reseller = reseller margin allocation
  const calculateItemCost = (item: CartItem) => {
    const pBase = item.baseProductPrice + item.filmLayoutPrice;
    const pCustomization = item.customImageUrl ? 50.0 : 0.0;
    const mReseller = item.resellerMargin;
    return (pBase + pCustomization + mReseller);
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + calculateItemCost(item) * item.quantity, 0);
  };

  const getCartGst = () => {
    return getCartSubtotal() * 0.18;
  };

  const getCartTotal = () => {
    return getCartSubtotal() * 1.18;
  };

  const getResellerEarnings = () => {
    return cart.reduce((sum, item) => sum + item.resellerMargin * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getCartGst,
        getCartTotal,
        getResellerEarnings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
