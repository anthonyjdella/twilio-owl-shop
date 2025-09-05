"use client";

import { useState, useEffect } from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Filter } from "../../types";
import {
    categories,
    subcategories,
    brands,
    sizes,
    colors,
} from "../../data/products";

interface ProductFiltersProps {
    filters: Filter;
    onFiltersChange: (filters: Filter) => void;
    productCount: number;
}

export default function ProductFilters({
    filters,
    onFiltersChange,
    productCount,
}: ProductFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<Filter>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleFilterChange = (
        key: keyof Filter,
        value: string | string[] | [number, number] | boolean | undefined
    ) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleArrayFilterChange = (
        key: keyof Filter,
        value: string,
        checked: boolean
    ) => {
        const currentArray = (localFilters[key] as string[]) || [];
        let newArray;

        if (checked) {
            newArray = [...currentArray, value];
        } else {
            newArray = currentArray.filter((item) => item !== value);
        }

        handleFilterChange(key, newArray.length > 0 ? newArray : undefined);
    };

    const clearFilters = () => {
        const emptyFilters: Filter = {};
        setLocalFilters(emptyFilters);
        onFiltersChange(emptyFilters);
    };

    const hasActiveFilters = Object.keys(localFilters).some((key) => {
        const value = localFilters[key as keyof Filter];
        return (
            value !== undefined &&
            (Array.isArray(value) ? value.length > 0 : value)
        );
    });

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                    <FunnelIcon className="h-5 w-5" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                            Active
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Filter Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen">
                        <div
                            className="flex-1 bg-black bg-opacity-50"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="w-80 bg-white shadow-xl">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">
                                        Filters
                                    </h2>
                                    <button onClick={() => setIsOpen(false)}>
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                                <FilterContent
                                    localFilters={localFilters}
                                    handleFilterChange={handleFilterChange}
                                    handleArrayFilterChange={
                                        handleArrayFilterChange
                                    }
                                    clearFilters={clearFilters}
                                    hasActiveFilters={hasActiveFilters}
                                    productCount={productCount}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <FilterContent
                        localFilters={localFilters}
                        handleFilterChange={handleFilterChange}
                        handleArrayFilterChange={handleArrayFilterChange}
                        clearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                        productCount={productCount}
                    />
                </div>
            </div>
        </>
    );
}

interface FilterContentProps {
    localFilters: Filter;
    handleFilterChange: (
        key: keyof Filter,
        value: string | string[] | [number, number] | boolean | undefined
    ) => void;
    handleArrayFilterChange: (
        key: keyof Filter,
        value: string,
        checked: boolean
    ) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    productCount: number;
}

function FilterContent({
    localFilters,
    handleFilterChange,
    handleArrayFilterChange,
    productCount,
}: FilterContentProps) {
    return (
        <div className="space-y-6">
            {/* Results Count */}
            <div className="text-sm text-gray-600">
                {productCount} {productCount === 1 ? "product" : "products"}{" "}
                found
            </div>

            {/* Category */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                    {categories
                        .filter((cat) => cat !== "All")
                        .map((category) => (
                            <label key={category} className="flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={localFilters.category === category}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "category",
                                            e.target.checked
                                                ? category
                                                : undefined
                                        )
                                    }
                                    className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    {category}
                                </span>
                            </label>
                        ))}
                </div>
            </div>

            {/* Subcategory */}
            {localFilters.category &&
                subcategories[
                    localFilters.category as keyof typeof subcategories
                ] && (
                    <div>
                        <h3 className="font-medium text-gray-900 mb-3">
                            Subcategory
                        </h3>
                        <div className="space-y-2">
                            {subcategories[
                                localFilters.category as keyof typeof subcategories
                            ].map((subcategory) => (
                                <label
                                    key={subcategory}
                                    className="flex items-center"
                                >
                                    <input
                                        type="radio"
                                        name="subcategory"
                                        checked={
                                            localFilters.subcategory ===
                                            subcategory
                                        }
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "subcategory",
                                                e.target.checked
                                                    ? subcategory
                                                    : undefined
                                            )
                                        }
                                        className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        {subcategory}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

            {/* Price Range */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                    {[
                        { label: "Under $50", range: [0, 49] },
                        { label: "$50 - $100", range: [50, 100] },
                        { label: "$100 - $200", range: [100, 200] },
                        { label: "$200 - $300", range: [200, 300] },
                        { label: "Over $300", range: [300, 999999] },
                    ].map(({ label, range }) => (
                        <label key={label} className="flex items-center">
                            <input
                                type="radio"
                                name="priceRange"
                                checked={
                                    localFilters.priceRange?.[0] === range[0] &&
                                    localFilters.priceRange?.[1] === range[1]
                                }
                                onChange={(e) =>
                                    handleFilterChange(
                                        "priceRange",
                                        e.target.checked
                                            ? (range as [number, number])
                                            : undefined
                                    )
                                }
                                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brand */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label key={brand} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={(localFilters.brand
                                    ? [localFilters.brand]
                                    : []
                                ).includes(brand)}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "brand",
                                        e.target.checked ? brand : undefined
                                    )
                                }
                                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Size */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <label key={size} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={(localFilters.sizes || []).includes(
                                    size
                                )}
                                onChange={(e) =>
                                    handleArrayFilterChange(
                                        "sizes",
                                        size,
                                        e.target.checked
                                    )
                                }
                                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {size}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Color */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Color</h3>
                <div className="space-y-2">
                    {colors.map((color) => (
                        <label key={color} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={(localFilters.colors || []).includes(
                                    color
                                )}
                                onChange={(e) =>
                                    handleArrayFilterChange(
                                        "colors",
                                        color,
                                        e.target.checked
                                    )
                                }
                                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                            />
                            <div
                                className="ml-2 w-4 h-4 rounded-full border border-gray-300"
                                style={{
                                    backgroundColor:
                                        color.toLowerCase() === "white"
                                            ? "#ffffff"
                                            : color.toLowerCase() === "black"
                                            ? "#000000"
                                            : color.toLowerCase() === "navy"
                                            ? "#1e3a8a"
                                            : color.toLowerCase() === "charcoal"
                                            ? "#374151"
                                            : color.toLowerCase() === "cream"
                                            ? "#f9fafb"
                                            : color.toLowerCase() === "camel"
                                            ? "#d2b48c"
                                            : color.toLowerCase() === "brown"
                                            ? "#92400e"
                                            : color.toLowerCase() === "cognac"
                                            ? "#a0522d"
                                            : color.toLowerCase() === "blush"
                                            ? "#fde2e7"
                                            : color.toLowerCase() === "ivory"
                                            ? "#fffbf0"
                                            : color.toLowerCase() === "burgundy"
                                            ? "#7c2d12"
                                            : color.toLowerCase() ===
                                              "forest green"
                                            ? "#164e63"
                                            : color.toLowerCase() === "grey"
                                            ? "#6b7280"
                                            : color.toLowerCase() === "khaki"
                                            ? "#a3a3a3"
                                            : "#9ca3af",
                                }}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                {color}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Stock Status */}
            <div>
                <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={localFilters.inStock === true}
                        onChange={(e) =>
                            handleFilterChange(
                                "inStock",
                                e.target.checked ? true : undefined
                            )
                        }
                        className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                        In Stock Only
                    </span>
                </label>
            </div>
        </div>
    );
}
