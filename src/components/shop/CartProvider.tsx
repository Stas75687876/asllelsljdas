'use client';

import React from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Lade den Warenkorb aus dem localStorage beim ersten Rendern
  React.useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Fehler beim Laden des Warenkorbs:', err);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Speichere den Warenkorb im localStorage wenn er sich ändert
  React.useEffect(() => {
    if (loaded) {
      try {
        // Versuche den Cart zu serialisieren und zu speichern
        const cartJson = JSON.stringify(cart);
        
        // Überprüfe die Größe der Daten - im Falle eines Fehlers
        if (cartJson.length > 1000000) { // 1MB Limit als Vorsichtsmaßnahme
          console.warn('Warenkorb ist zu groß für localStorage, beschränke die Daten');
          // Speichere eine vereinfachte Version ohne große Datenmengen
          const simplifiedCart = cart.map(item => ({
            id: item.id,
            name: item.name.substring(0, 50), // Beschränke die Textlänge
            price: item.price,
            quantity: item.quantity,
            // Keine Beschreibung oder Bilder speichern, die zu groß sein könnten
          }));
          localStorage.setItem('cart', JSON.stringify(simplifiedCart));
        } else {
          localStorage.setItem('cart', cartJson);
        }
      } catch (error) {
        console.error('Fehler beim Speichern des Warenkorbs:', error);
        
        // Versuche im Fehlerfall mit kleineren Daten
        try {
          // Speichere eine Minimalversion
          const minimalCart = cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
          }));
          localStorage.setItem('cart', JSON.stringify(minimalCart));
        } catch (fallbackError) {
          console.error('Auch Fallback-Speicherung fehlgeschlagen:', fallbackError);
          // Mache nichts - lasse den Warenkorb im Speicher, aber nicht persistiert
        }
      }
    }
  }, [cart, loaded]);

  // Berechne die Gesamtanzahl der Artikel im Warenkorb
  const totalItems = cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);

  // Berechne den Gesamtpreis aller Artikel im Warenkorb
  const totalPrice = cart.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity, 
    0
  );

  // Füge ein Produkt zum Warenkorb hinzu (oder erhöhe die Menge, wenn es bereits existiert)
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart: CartItem[]) => {
      const existingItemIndex = prevCart.findIndex(
        (item: CartItem) => item.id === product.id
      );

      if (existingItemIndex !== -1) {
        // Produkt existiert bereits, erhöhe die Menge
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        // Neues Produkt, füge es mit Menge 1 hinzu
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Öffne den Warenkorb beim Hinzufügen
    setIsCartOpen(true);
  };

  // Entferne ein Produkt aus dem Warenkorb
  const removeFromCart = (id: string) => {
    setCart((prevCart: CartItem[]) => prevCart.filter((item: CartItem) => item.id !== id));
  };

  // Aktualisiere die Menge eines Produkts im Warenkorb
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Lösche den gesamten Warenkorb
  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 