import ProductGrid from "@/components/ProductGrid";
import FilterBar from "@/components/FilterBar";
import { useState } from "react";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne via-white to-soft-beige">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 pt-8">Our Products</h1>
        
        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          selectedColors={selectedColors}
          onColorToggle={handleColorToggle}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {/* Products grid */}
        <div className="mt-8">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
