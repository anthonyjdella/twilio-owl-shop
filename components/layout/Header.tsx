"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShoppingBagIcon,
    UserIcon,
    MagnifyingGlassIcon,
    HeartIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { getCartItemCount } from "../../lib/cart";
import { CartItem } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../auth/AuthModal";

export default function Header() {
    const { user, signOut } = useAuth();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">(
        "signin"
    );
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("twilio-owl-shop-cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const cartItemCount = getCartItemCount(cart);

    return (
        <header className="bg-white shadow-sm border-b border-[#DDE0E6]">
            {/* Top banner */}
            <div className="bg-[#000D25] text-white text-center py-2 text-sm twilio-mono">
                BUILD & SHIP FREE | Use code TWILIO5 for 5% off your dev setup
            </div>

            {/* Main header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#FF1233] rounded-full flex items-center justify-center mr-2.5">
                                <span className="text-lg">🦉</span>
                            </div>
                            <span className="buffalo-title text-xl text-[#000D25]">
                                OWL SHOP
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-black font-medium ml-2.5"
                        >
                            
                        </Link>
                        <Link
                            href="/products?category=Tops"
                            className="text-gray-700 hover:text-black font-medium"
                        >
                            Tops
                        </Link>
                        <Link
                            href="/products?category=Bottoms"
                            className="text-gray-700 hover:text-black font-medium"
                        >
                            Bottoms
                        </Link>
                        <Link
                            href="/products?category=Dresses"
                            className="text-gray-700 hover:text-black font-medium"
                        >
                            Dresses
                        </Link>
                        <div className="relative group">
                            <button className="twilio-text text-[#FF1233] hover:text-[#DB132A] font-medium transition-colors border border-[#FF1233] px-3 py-1 rounded-lg flex items-center space-x-1">
                                <span>SMS DEMO</span>
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>
                            
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-1">
                                    <Link
                                        href="/sms-demo"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        📱 Classic Demo
                                    </Link>
                                    <Link
                                        href="/dynamic-sms-demo"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                        🚀 Dynamic Demo
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <div className="w-full relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                            <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    {/* Desktop Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/wishlist"
                            className="text-gray-700 hover:text-black"
                        >
                            <HeartIcon className="h-6 w-6" />
                        </Link>

                        {/* User Account */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className="flex items-center space-x-1 text-gray-700 hover:text-black"
                                >
                                    <UserIcon className="h-6 w-6" />
                                    <span className="text-sm font-medium">
                                        {user.firstName}
                                    </span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() =>
                                                setShowUserMenu(false)
                                            }
                                        >
                                            My Orders
                                        </Link>
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setShowUserMenu(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => {
                                        setAuthModalMode("signin");
                                        setIsAuthModalOpen(true);
                                    }}
                                    className="text-gray-700 hover:text-black text-sm font-medium"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        setAuthModalMode("signup");
                                        setIsAuthModalOpen(true);
                                    }}
                                    className="bg-[#FF1233] text-white px-3 py-1 rounded-md hover:bg-[#DB132A] text-sm font-medium"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}

                        <Link
                            href="/cart"
                            className="text-gray-700 hover:text-black relative"
                        >
                            <ShoppingBagIcon className="h-6 w-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-black"
                        >
                            {isMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="space-y-4">
                            {/* Mobile search */}
                            <div className="px-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                    <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Mobile navigation */}
                            <nav className="space-y-1">
                                <Link
                                    href="/"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    All Products
                                </Link>
                                <Link
                                    href="/products?category=Jackets"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Jackets
                                </Link>
                                <Link
                                    href="/products?category=Tops"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Tops
                                </Link>
                                <Link
                                    href="/products?category=Bottoms"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Bottoms
                                </Link>
                                <Link
                                    href="/products?category=Dresses"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Dresses
                                </Link>
                                <Link
                                    href="/products?category=Accessories"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                                >
                                    Accessories
                                </Link>
                                <Link
                                    href="/sms-demo"
                                    className="block px-4 py-2 text-[#FF1233] hover:bg-gray-50 font-medium"
                                >
                                    SMS Demo
                                </Link>
                            </nav>

                            {/* Mobile icons */}
                            <div className="flex justify-around py-4 border-t border-gray-200">
                                <Link
                                    href="/wishlist"
                                    className="flex flex-col items-center space-y-1"
                                >
                                    <HeartIcon className="h-6 w-6 text-gray-700" />
                                    <span className="text-xs text-gray-700">
                                        Wishlist
                                    </span>
                                </Link>

                                {/* Mobile User Account */}
                                {user ? (
                                    <Link
                                        href="/profile"
                                        className="flex flex-col items-center space-y-1"
                                    >
                                        <UserIcon className="h-6 w-6 text-gray-700" />
                                        <span className="text-xs text-gray-700">
                                            {user.firstName}
                                        </span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setAuthModalMode("signin");
                                            setIsAuthModalOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex flex-col items-center space-y-1"
                                    >
                                        <UserIcon className="h-6 w-6 text-gray-700" />
                                        <span className="text-xs text-gray-700">
                                            Sign In
                                        </span>
                                    </button>
                                )}

                                <Link
                                    href="/cart"
                                    className="flex flex-col items-center space-y-1 relative"
                                >
                                    <ShoppingBagIcon className="h-6 w-6 text-gray-700" />
                                    <span className="text-xs text-gray-700">
                                        Cart
                                    </span>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Authentication Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authModalMode}
            />
        </header>
    );
}
