import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "shop-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const localCart: CartItem[] = stored ? JSON.parse(stored) : [];
    setItems(localCart);
  };

  const persistCart = (newItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
  };

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const newItems = existing
        ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...item, quantity: 1 }];
      persistCart(newItems);
      toast({ title: "Added to cart", description: `${item.name} added` });
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id);
      persistCart(newItems);
      toast({ title: "Removed from cart" });
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems((prev) => {
      const newItems = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
      persistCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
