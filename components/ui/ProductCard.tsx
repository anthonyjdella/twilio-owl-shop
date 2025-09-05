"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon, StarIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Product } from "../../types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
        // In a real app, you'd save this to localStorage or send to server
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className="h-4 w-4 fill-current text-yellow-400"
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <StarIcon
                    key="half"
                    className="h-4 w-4 fill-current text-yellow-400 opacity-50"
                />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <StarIcon
                    key={`empty-${i}`}
                    className="h-4 w-4 text-gray-300"
                />
            );
        }

        return stars;
    };

    return (
        <Link href={`/products/${product.id}`} className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-gray-100">
                    <Image
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={toggleWishlist}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                    >
                        {isWishlisted ? (
                            <HeartIconSolid className="h-5 w-5 text-red-500" />
                        ) : (
                            <HeartIcon className="h-5 w-5 text-gray-600" />
                        )}
                    </button>

                    {/* Sale Badge */}
                    {product.originalPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                            SALE
                        </div>
                    )}

                    {/* Featured Badge */}
                    {product.featured && (
                        <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium rounded">
                            FEATURED
                        </div>
                    )}

                    {/* Image Dots */}
                    {product.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {product.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentImageIndex(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                        index === currentImageIndex
                                            ? "bg-white"
                                            : "bg-white/50"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Brand */}
                    <p className="text-sm text-gray-500 mb-1">
                        {product.brand}
                    </p>

                    {/* Name */}
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-black">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-2">
                        <div className="flex">
                            {renderStars(product.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                            ({product.reviewCount})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold text-gray-900">
                            ${product.price}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>

                    {/* Colors */}
                    {product.colors.length > 0 && (
                        <div className="mt-2 flex space-x-1">
                            {product.colors.slice(0, 4).map((color) => (
                                <div
                                    key={color}
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{
                                        backgroundColor:
                                            color.toLowerCase() === "white"
                                                ? "#ffffff"
                                                : color.toLowerCase() ===
                                                  "black"
                                                ? "#000000"
                                                : color.toLowerCase() === "navy"
                                                ? "#1e3a8a"
                                                : color.toLowerCase() ===
                                                  "charcoal"
                                                ? "#374151"
                                                : color.toLowerCase() ===
                                                  "cream"
                                                ? "#f9fafb"
                                                : color.toLowerCase() ===
                                                  "camel"
                                                ? "#d2b48c"
                                                : color.toLowerCase() ===
                                                  "brown"
                                                ? "#92400e"
                                                : color.toLowerCase() ===
                                                  "cognac"
                                                ? "#a0522d"
                                                : color.toLowerCase() ===
                                                  "blush"
                                                ? "#fde2e7"
                                                : color.toLowerCase() ===
                                                  "ivory"
                                                ? "#fffbf0"
                                                : color.toLowerCase() ===
                                                  "burgundy"
                                                ? "#7c2d12"
                                                : color.toLowerCase() ===
                                                  "forest green"
                                                ? "#164e63"
                                                : color.toLowerCase() === "grey"
                                                ? "#6b7280"
                                                : color.toLowerCase() ===
                                                  "khaki"
                                                ? "#a3a3a3"
                                                : "#9ca3af",
                                    }}
                                    title={color}
                                />
                            ))}
                            {product.colors.length > 4 && (
                                <span className="text-xs text-gray-500 ml-1">
                                    +{product.colors.length - 4}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Stock Status */}
                    {!product.inStock && (
                        <p className="text-sm text-red-500 mt-2">
                            Out of Stock
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
