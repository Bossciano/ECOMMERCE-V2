import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  stock_quantity: number;
  rating: number | null;
  is_active: boolean;
  product_images: Array<{
    image_url: string;
    is_primary: boolean;
  }> | null;
}

interface ProductGridProps {
  products?: Product[];
}

// Mock products data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Luxury Perfume - Rose Essence",
    price: 89.99,
    category: "Perfume",
    description: "Premium rose-scented perfume",
    stock_quantity: 50,
    rating: 4.8,
    is_active: true,
    product_images: [
      { image_url: "https://via.placeholder.com/300x400?text=Perfume+1", is_primary: true }
    ]
  },
  {
    id: "2",
    name: "Elegant Fragrance - Vanilla Dream",
    price: 79.99,
    category: "Perfume",
    description: "Soft vanilla scent",
    stock_quantity: 40,
    rating: 4.6,
    is_active: true,
    product_images: [
      { image_url: "https://via.placeholder.com/300x400?text=Perfume+2", is_primary: true }
    ]
  },
  {
    id: "3",
    name: "Exotic Blend - Amber & Oud",
    price: 99.99,
    category: "Perfume",
    description: "Rich and sophisticated blend",
    stock_quantity: 30,
    rating: 4.9,
    is_active: true,
    product_images: [
      { image_url: "https://via.placeholder.com/300x400?text=Perfume+3", is_primary: true }
    ]
  },
  {
    id: "4",
    name: "Fresh Citrus - Lemon Zest",
    price: 69.99,
    category: "Perfume",
    description: "Refreshing citrus fragrance",
    stock_quantity: 60,
    rating: 4.5,
    is_active: true,
    product_images: [
      { image_url: "https://via.placeholder.com/300x400?text=Perfume+4", is_primary: true }
    ]
  },
  {
    id: "5",
    name: "Floral Touch - Jasmine & Lily",
    price: 84.99,
    category: "Perfume",
    description: "Delicate floral notes",
    stock_quantity: 35,
    rating: 4.7,
    is_active: true,
    product_images: [
      { image_url: "https://via.placeholder.com/300x400?text=Perfume+5", is_primary: true }
    ]
  },
  {
    id: "6",
    name: "Ocean Breeze - Sea Salt",
    price: 74.99,
    category: "Perfume",
    description: "Clean ocean scent",
    stock_quantity: 45,
    rating: 4.4,
    is_active: true,
    product_images: [
      { image_url: "https://via.placeholder.com/300x400?text=Perfume+6", is_primary: true }
    ]
  },
];

const ProductGrid = ({ products: propsProducts }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>(propsProducts || []);
  const [loading, setLoading] = useState(!propsProducts);

  useEffect(() => {
    // Only fetch if products weren't provided via props
    if (!propsProducts) {
      loadProducts();
    }
  }, [propsProducts]);

  const loadProducts = () => {
    try {
      setLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error in loadProducts:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center bg-[#faf8f4]">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-[#faf8f4]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3b2f2f] mb-4">
            Featured Products
          </h2>
          <div className="mx-auto mb-4 h-[2px] w-20 bg-[#c2a46d]/70 rounded-full" />
          <p className="text-[#6b5c4d] max-w-2xl mx-auto">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const primaryImage = product.product_images?.find(img => img.is_primary);
              const imageUrl = primaryImage?.image_url || product.product_images?.[0]?.image_url || '/placeholder.svg';
              
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={imageUrl}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#6b5c4d] text-lg">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
