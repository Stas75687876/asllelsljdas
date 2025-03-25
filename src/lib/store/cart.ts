import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

// Zustand Store ohne expliziten Typparameter für create
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
          
          if (existingItemIndex !== -1) {
            // Das Produkt ist bereits im Warenkorb, erhöhen wir die Menge
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity || 1;
            return { items: newItems };
          } else {
            // Neues Produkt zum Warenkorb hinzufügen
            return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
          }
        });
      },
      
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity, 
          0
        );
      },
    }),
    {
      name: 'cart-storage', // Name für die Speicherung im localStorage
      
      // Benutzerdefinierte Storage-Funktion, um Fehler zu behandeln
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error(`Fehler beim Laden aus localStorage (${name}):`, error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            // Versuche den vollständigen Wert zu speichern
            const stringValue = JSON.stringify(value);
            
            // Überprüfe die Größe vor dem Speichern
            if (stringValue.length > 500000) { // 500KB Limit
              console.warn('Warenkorb ist zu groß für localStorage, speichere vereinfachte Version');
              
              // Erstelle eine vereinfachte Version der Daten
              const simplifiedValue = {
                ...value,
                state: {
                  ...value.state,
                  items: value.state.items.map((item: CartItem) => ({
                    id: item.id,
                    name: item.name?.substring(0, 30) || '',  // Kürze Namen
                    price: item.price,
                    quantity: item.quantity,
                    // Keine description oder image speichern
                  }))
                }
              };
              
              localStorage.setItem(name, JSON.stringify(simplifiedValue));
            } else {
              localStorage.setItem(name, stringValue);
            }
          } catch (error) {
            console.error(`Fehler beim Speichern im localStorage (${name}):`, error);
            
            // Im Fehlerfall, versuche nur IDs und Mengen zu speichern
            try {
              const minimalValue = {
                ...value,
                state: {
                  ...value.state,
                  items: value.state.items.map((item: CartItem) => ({
                    id: item.id,
                    quantity: item.quantity
                  }))
                }
              };
              localStorage.setItem(name, JSON.stringify(minimalValue));
            } catch (fallbackError) {
              console.error('Auch Fallback-Speicherung fehlgeschlagen:', fallbackError);
            }
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error(`Fehler beim Entfernen aus localStorage (${name}):`, error);
          }
        }
      }
    }
  )
); 