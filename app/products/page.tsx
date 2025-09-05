"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "../../data/products";
import { Product, Filter } from "../../types";
import ProductCard from "../../components/ui/ProductCard";
import ProductFilters from "../../components/ui/ProductFilters";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [filteredProducts, setFilteredProducts] =
        useState<Product[]>(products);
    const [filters, setFilters] = useState<Filter>({});
    const [sortBy, setSortBy] = useState("featured");

    useEffect(() => {
        // Initialize filters from URL params
        const initialFilters: Filter = {};
        const category = searchParams.get("category");
        const featured = searchParams.get("featured");

        if (category) initialFilters.category = category;
        if (featured === "true") {
            setFilteredProducts(products.filter((p) => p.featured));
            return;
        }

        setFilters(initialFilters);
    }, [searchParams]);

    useEffect(() => {
        let filtered = [...products];

        // Apply filters
        if (filters.category) {
            filtered = filtered.filter(
                (product) => product.category === filters.category
            );
        }

        if (filters.subcategory) {
            filtered = filtered.filter(
                (product) => product.subcategory === filters.subcategory
            );
        }

        if (filters.brand) {
            filtered = filtered.filter(
                (product) => product.brand === filters.brand
            );
        }

        if (filters.priceRange) {
            const [min, max] = filters.priceRange;
            filtered = filtered.filter(
                (product) => product.price >= min && product.price <= max
            );
        }

        if (filters.sizes && filters.sizes.length > 0) {
            filtered = filtered.filter((product) =>
                filters.sizes!.some((size) => product.sizes.includes(size))
            );
        }

        if (filters.colors && filters.colors.length > 0) {
            filtered = filtered.filter((product) =>
                filters.colors!.some((color) => product.colors.includes(color))
            );
        }

        if (filters.inStock) {
            filtered = filtered.filter((product) => product.inStock);
        }

        // Apply sorting
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "featured":
            default:
                filtered.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return 0;
                });
                break;
        }

        setFilteredProducts(filtered);
    }, [filters, sortBy]);

    const handleFiltersChange = (newFilters: Filter) => {
        setFilters(newFilters);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {filters.category
                            ? `${filters.category}`
                            : "All Products"}
                    </h1>
                    <p className="text-gray-600">
                        Discover our premium collection of carefully curated
                        fashion pieces
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <ProductFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        productCount={filteredProducts.length}
                    />

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Sort and View Options */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <span className="text-sm text-gray-600">
                                    Showing {filteredProducts.length}{" "}
                                    {filteredProducts.length === 1
                                        ? "product"
                                        : "products"}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <label
                                    htmlFor="sort"
                                    className="text-sm text-gray-600"
                                >
                                    Sort by:
                                </label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-black focus:border-transparent"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                    <option value="name">Name: A to Z</option>
                                    <option value="rating">
                                        Highest Rated
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">
                                    🔍
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search
                                    criteria
                                </p>
                                <button
                                    onClick={() => setFilters({})}
                                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
