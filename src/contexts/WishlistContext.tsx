import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const WISHLIST_STORAGE_KEY = "user-wishlist";

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    try {
      setLoading(true);
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const wishlistItems: WishlistItem[] = stored ? JSON.parse(stored) : [];
      setItems(wishlistItems);
    } catch (error: any) {
      console.error("Error loading wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const persistWishlist = (items: WishlistItem[]) => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  };

  const addToWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      toast({
        title: "Already in wishlist",
        description: "This item is already in your wishlist",
      });
      return;
    }

    try {
      const newItems = [...items, item];
      setItems(newItems);
      persistWishlist(newItems);
      toast({
        title: "Added to wishlist",
        description: `${item.name} has been added to your wishlist`,
      });
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = (id: string) => {
    try {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      persistWishlist(newItems);
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error: any) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
