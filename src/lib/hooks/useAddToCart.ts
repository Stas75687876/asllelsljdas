import React from 'react';
import { useCartStore, CartItem } from '@/lib/store/cart';

export type AddToCartOptions = {
  showNotification?: boolean;
  quantity?: number;
};

export function useAddToCart() {
  const [isAdding, setIsAdding] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });
  
  const addItem = useCartStore((state) => state.addItem);
  
  const addToCart = async (product: Omit<CartItem, 'quantity'>, options: AddToCartOptions = {}) => {
    const { showNotification = true, quantity = 1 } = options;
    
    setIsAdding(true);
    
    try {
      // Komprimiere Produktdaten vor dem Hinzufügen, um localStorage-Fehler zu vermeiden
      const compressedProduct: Omit<CartItem, 'quantity'> = {
        id: product.id,
        name: product.name?.substring(0, 100) || '', // Beschränke Namenlänge
        description: product.description?.substring(0, 200) || '', // Beschränke Beschreibungslänge
        price: product.price,
        // Komprimiere/entferne große Bilder
        image: product.image && product.image.length > 500 ? undefined : product.image
      };
      
      // Produkt zum Warenkorb hinzufügen
      try {
        addItem({ ...compressedProduct, quantity });
      } catch (storageError) {
        console.error('Fehler beim Speichern im localStorage:', storageError);
        
        // Bei localStorage-Fehler trotzdem Erfolg vortäuschen
        // Der Nutzer sieht die UI-Änderung, auch wenn Persistierung fehlschlägt
        if (showNotification) {
          setNotification({
            visible: true,
            message: `${product.name} wurde zum Warenkorb hinzugefügt (Hinweis: Persistierung nicht möglich)`,
            type: 'success',
          });
          
          setTimeout(() => {
            setNotification((prev) => ({ ...prev, visible: false }));
          }, 3000);
        }
        
        return true;
      }
      
      // Benachrichtigung anzeigen, wenn gewünscht
      if (showNotification) {
        setNotification({
          visible: true,
          message: `${product.name} wurde zum Warenkorb hinzugefügt`,
          type: 'success',
        });
        
        // Benachrichtigung nach 3 Sekunden ausblenden
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, visible: false }));
        }, 3000);
      }
      
      return true;
    } catch (error) {
      // Fehlerbehandlung
      console.error('Fehler beim Hinzufügen zum Warenkorb:', error);
      
      if (showNotification) {
        setNotification({
          visible: true,
          message: 'Fehler beim Hinzufügen zum Warenkorb',
          type: 'error',
        });
        
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, visible: false }));
        }, 3000);
      }
      
      return false;
    } finally {
      setIsAdding(false);
    }
  };
  
  return {
    addToCart,
    isAdding,
    notification,
    hideNotification: () => setNotification((prev) => ({ ...prev, visible: false })),
  };
} 