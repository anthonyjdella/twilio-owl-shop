"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    TrashIcon,
    MinusIcon,
    PlusIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { CartItem } from "../../types";
import {
    getCartTotal,
    updateCartItemQuantity,
    removeFromCart,
    calculateTax,
    calculateShipping,
} from "../../lib/cart";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);

    useEffect(() => {
        const savedCart = localStorage.getItem("twilio-owl-shop-cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const updateCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem("twilio-owl-shop-cart", JSON.stringify(newCart));
    };

    const handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedCart = updateCartItemQuantity(cart, index, newQuantity);
        updateCart(updatedCart);
    };

    const handleRemoveItem = (index: number) => {
        const updatedCart = removeFromCart(cart, index);
        updateCart(updatedCart);
    };

    const handlePromoCode = () => {
        const validPromoCodes = {
            SAVE25: 0.25,
            WELCOME10: 0.1,
            FIRST15: 0.15,
        };

        const discount =
            validPromoCodes[
                promoCode.toUpperCase() as keyof typeof validPromoCodes
            ];
        if (discount) {
            setPromoApplied(true);
            setPromoDiscount(discount);
        } else {
            alert("Invalid promo code");
        }
    };

    const subtotal = getCartTotal(cart);
    const discount = promoApplied ? subtotal * promoDiscount : 0;
    const discountedSubtotal = subtotal - discount;
    const tax = calculateTax(discountedSubtotal);
    const shipping = calculateShipping(discountedSubtotal);
    const total = discountedSubtotal + tax + shipping;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-6xl mb-6">🛍️</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Your Cart is Empty
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Looks like you haven&apos;t added any items to your
                            cart yet.
                        </p>
                        <Link
                            href="/products"
                            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-300 inline-flex items-center"
                        >
                            Start Shopping
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Shopping Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item, index) => (
                            <div
                                key={`${item.product.id}-${item.size}-${item.color}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Product Image */}
                                    <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.product.id}`}
                                            className="block"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-black">
                                                {item.product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {item.product.brand}
                                        </p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                            <span>Size: {item.size}</span>
                                            <span>Color: {item.color}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg font-semibold text-gray-900">
                                                    ${item.product.price}
                                                </span>
                                                {item.product.originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        $
                                                        {
                                                            item.product
                                                                .originalPrice
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2">
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                index,
                                                                item.quantity -
                                                                    1
                                                            )
                                                        }
                                                        className="p-2 text-gray-600 hover:text-gray-900"
                                                    >
                                                        <MinusIcon className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-3 py-2 border-x border-gray-300 text-center min-w-[3rem]">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                index,
                                                                item.quantity +
                                                                    1
                                                            )
                                                        }
                                                        className="p-2 text-gray-600 hover:text-gray-900"
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(index)
                                                    }
                                                    className="p-2 text-red-600 hover:text-red-800"
                                                    title="Remove item"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="mt-3 text-right">
                                            <span className="text-lg font-semibold text-gray-900">
                                                $
                                                {(
                                                    item.product.price *
                                                    item.quantity
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <div className="pt-4">
                            <Link
                                href="/products"
                                className="text-black hover:text-gray-700 font-medium inline-flex items-center"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Order Summary
                            </h2>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <label
                                    htmlFor="promo-code"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Promo Code
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        id="promo-code"
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) =>
                                            setPromoCode(e.target.value)
                                        }
                                        disabled={promoApplied}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-100"
                                    />
                                    <button
                                        onClick={handlePromoCode}
                                        disabled={promoApplied || !promoCode}
                                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoApplied && (
                                    <p className="text-sm text-green-600 mt-1">
                                        ✓ Promo code applied:{" "}
                                        {(promoDiscount * 100).toFixed(0)}% off
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Try: SAVE25, WELCOME10, or FIRST15
                                </p>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal
                                    </span>
                                    <span className="text-gray-900">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>

                                {promoApplied && (
                                    <div className="flex justify-between text-green-600">
                                        <span>
                                            Discount (
                                            {(promoDiscount * 100).toFixed(0)}%
                                            off)
                                        </span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">
                                        ${tax.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>
                                    <span className="text-gray-900">
                                        {shipping === 0
                                            ? "FREE"
                                            : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                {shipping === 0 && (
                                    <p className="text-xs text-green-600">
                                        🎉 You qualify for free shipping!
                                    </p>
                                )}

                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                className="w-full mt-6 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-300 font-semibold text-center block"
                            >
                                Proceed to Checkout
                            </Link>

                            {/* Security Badge */}
                            <div className="mt-4 text-center">
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                    <span>🔒</span>
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
