"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    HeartIcon,
    StarIcon,
    ShoppingBagIcon,
    TruckIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { products } from "../../../data/products";
import { Product, CartItem } from "../../../types";
import { addToCart } from "../../../lib/cart";

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const foundProduct = products.find((p) => p.id === productId);
        if (foundProduct) {
            setProduct(foundProduct);
            setSelectedSize(foundProduct.sizes[0] || "");
            setSelectedColor(foundProduct.colors[0] || "");
        }
    }, [productId]);

    useEffect(() => {
        const savedCart = localStorage.getItem("twilio-owl-shop-cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Product Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">
                        The product you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link
                        href="/products"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert("Please select size and color");
            return;
        }

        const updatedCart = addToCart(
            cart,
            product,
            selectedSize,
            selectedColor,
            quantity
        );
        setCart(updatedCart);
        localStorage.setItem("twilio-owl-shop-cart", JSON.stringify(updatedCart));
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    className="h-5 w-5 fill-current text-yellow-400"
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <StarIcon
                    key="half"
                    className="h-5 w-5 fill-current text-yellow-400 opacity-50"
                />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <StarIcon
                    key={`empty-${i}`}
                    className="h-5 w-5 text-gray-300"
                />
            );
        }

        return stars;
    };

    const getColorStyle = (color: string) => {
        const colorMap: { [key: string]: string } = {
            white: "#ffffff",
            black: "#000000",
            navy: "#1e3a8a",
            charcoal: "#374151",
            cream: "#f9fafb",
            camel: "#d2b48c",
            brown: "#92400e",
            cognac: "#a0522d",
            blush: "#fde2e7",
            ivory: "#fffbf0",
            burgundy: "#7c2d12",
            "forest green": "#164e63",
            grey: "#6b7280",
            khaki: "#a3a3a3",
        };
        return colorMap[color.toLowerCase()] || "#9ca3af";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <div className="flex items-center space-x-2 text-sm">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link
                            href="/products"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Products
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link
                            href={`/products?category=${product.category}`}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {product.category}
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </div>
                </nav>

                {/* Back Button */}
                <Link
                    href="/products"
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Products
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {product.originalPrice && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded">
                                    SALE
                                </div>
                            )}
                            {product.featured && (
                                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-sm font-medium rounded">
                                    FEATURED
                                </div>
                            )}
                        </div>

                        {/* Image Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex space-x-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setCurrentImageIndex(index)
                                        }
                                        className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 ${
                                            index === currentImageIndex
                                                ? "border-black"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        {/* Brand and Name */}
                        <div>
                            <p className="text-lg text-gray-600 mb-2">
                                {product.brand}
                            </p>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {product.name}
                            </h1>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                            <div className="flex">
                                {renderStars(product.rating)}
                            </div>
                            <span className="text-gray-600">
                                ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                            {product.originalPrice && (
                                <span className="text-xl text-gray-500 line-through">
                                    ${product.originalPrice}
                                </span>
                            )}
                            {product.originalPrice && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                                    Save $
                                    {product.originalPrice - product.price}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Description
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Size
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-lg font-medium ${
                                            selectedSize === size
                                                ? "border-black bg-black text-white"
                                                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Color:{" "}
                                <span className="font-normal">
                                    {selectedColor}
                                </span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 ${
                                            selectedColor === color
                                                ? "border-black"
                                                : "border-gray-300"
                                        }`}
                                        style={{
                                            backgroundColor:
                                                getColorStyle(color),
                                        }}
                                        title={color}
                                    >
                                        {color.toLowerCase() === "white" && (
                                            <div className="w-full h-full rounded-full border border-gray-200" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Quantity
                            </h3>
                            <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                <button
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x border-gray-300">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition duration-300 ${
                                    product.inStock
                                        ? addedToCart
                                            ? "bg-green-600 text-white"
                                            : "bg-black text-white hover:bg-gray-800"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                <ShoppingBagIcon className="h-5 w-5" />
                                <span>
                                    {!product.inStock
                                        ? "Out of Stock"
                                        : addedToCart
                                        ? "Added to Cart!"
                                        : "Add to Cart"}
                                </span>
                            </button>

                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="w-full flex items-center justify-center space-x-2 py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:border-gray-400 transition duration-300"
                            >
                                {isWishlisted ? (
                                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                                ) : (
                                    <HeartIcon className="h-5 w-5" />
                                )}
                                <span>
                                    {isWishlisted
                                        ? "Remove from Wishlist"
                                        : "Add to Wishlist"}
                                </span>
                            </button>
                        </div>

                        {/* Shipping Info */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <TruckIcon className="h-5 w-5" />
                                <span>Free shipping on orders over $100</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600 mt-2">
                                <span className="text-lg">↩️</span>
                                <span>30-day return policy</span>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Product Details
                            </h3>
                            <dl className="space-y-2">
                                <div className="flex">
                                    <dt className="text-sm font-medium text-gray-600 w-24">
                                        Category:
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {product.category}
                                    </dd>
                                </div>
                                <div className="flex">
                                    <dt className="text-sm font-medium text-gray-600 w-24">
                                        Brand:
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        {product.brand}
                                    </dd>
                                </div>
                                <div className="flex">
                                    <dt className="text-sm font-medium text-gray-600 w-24">
                                        Materials:
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        Premium quality materials
                                    </dd>
                                </div>
                                <div className="flex">
                                    <dt className="text-sm font-medium text-gray-600 w-24">
                                        Care:
                                    </dt>
                                    <dd className="text-sm text-gray-900">
                                        Professional dry clean recommended
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
