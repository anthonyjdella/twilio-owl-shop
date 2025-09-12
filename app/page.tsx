"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
// Removed direct Twilio import to avoid client-side Node.js module issues

export default function Home() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [smsConsent, setSmsConsent] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const featuredProducts = products.slice(0, 4);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Store newsletter signup
        const signups = JSON.parse(
            localStorage.getItem("twilio-owl-shop-newsletter") || "[]"
        );
        signups.push({
            email,
            phone: smsConsent ? phone : null,
            smsConsent,
            subscribedAt: new Date().toISOString(),
        });
        localStorage.setItem("twilio-owl-shop-newsletter", JSON.stringify(signups));

        // Send welcome SMS if consented
        if (smsConsent && phone) {
            try {
                const response = await fetch('/api/sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'marketing',
                        phoneNumber: phone,
                        message: `Welcome to Owl Shop! 🦉✨ Thank you for joining our VIP list. Get ready for exclusive deals, early access to new arrivals, and style tips. Reply STOP to opt out.`
                    }),
                });
                
                if (!response.ok) {
                    throw new Error('SMS API call failed');
                }
            } catch {
                console.log("SMS service unavailable in demo mode");
            }
        }

        setIsSubscribed(true);
        setEmail("");
        setPhone("");
        setSmsConsent(false);
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[70vh] bg-gradient-to-r from-[#000D25] to-[#081F47] flex items-center justify-center text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-[#FF1233] rounded-full flex items-center justify-center mr-4">
                            <span className="text-2xl">🦉</span>
                        </div>
                        <h1 className="buffalo-title text-5xl md:text-7xl text-white tracking-tight">
                            OWL SHOP
                        </h1>
                    </div>
                    <p className="twilio-text text-xl md:text-2xl mb-8 text-[#DDE0E6] max-w-2xl mx-auto">
                        Premium fashion for
                        builders who code by day and style by
                        night.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="btn-twilio-primary px-8 py-4 rounded-lg font-semibold text-lg"
                        >
                            BUILD COLLECTION
                        </Link>
                        <Link
                            href="/products?featured=true"
                            className="border-2 border-[#FF1233] text-[#FF1233] hover:bg-[#FF1233] hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                        >
                            VIEW FEATURED
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-[#DDE0E6]">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="buffalo-title text-3xl text-center mb-12 text-[#000D25]">
                        BUILD BY CATEGORY
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link
                            href="/products?category=tops"
                            className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000D25]/80 to-transparent z-10"></div>
                            <Image
                                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop"
                                alt="Developer Tops"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-6 left-6 z-20 text-white">
                                <h3 className="buffalo-title text-xl mb-2">
                                    CODE TOPS
                                </h3>
                                <p className="twilio-text text-[#DDE0E6]">
                                    Builder shirts & developer hoodies
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/products?category=bottoms"
                            className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000D25]/80 to-transparent z-10"></div>
                            <Image
                                src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop"
                                alt="Developer Bottoms"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-6 left-6 z-20 text-white">
                                <h3 className="buffalo-title text-xl mb-2">
                                    BUILD BOTTOMS
                                </h3>
                                <p className="twilio-text text-[#DDE0E6]">
                                    Coder jeans & builder chinos
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/products?category=dresses"
                            className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000D25]/80 to-transparent z-10"></div>
                            <Image
                                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop"
                                alt="Tech Dresses"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-6 left-6 z-20 text-white">
                                <h3 className="buffalo-title text-xl mb-2">
                                    TECH DRESSES
                                </h3>
                                <p className="twilio-text text-[#DDE0E6]">
                                    Elegant styles for tech events
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="buffalo-title text-3xl text-[#000D25] mb-4">
                            FEATURED BUILDS
                        </h2>
                        <p className="twilio-text text-lg text-[#4D5777] max-w-2xl mx-auto">
                            Discover our hand-picked selection of premium pieces
                            that define the modern developer&apos;s style.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/products"
                            className="btn-twilio-secondary inline-flex items-center px-8 py-3 rounded-lg font-semibold"
                        >
                            BUILD ALL PRODUCTS
                            <svg
                                className="w-5 h-5 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Stay in the Loop
                    </h2>
                    <p className="text-xl text-slate-300 mb-8">
                        Get exclusive access to new arrivals, special offers,
                        and style inspiration.
                    </p>

                    {!isSubscribed ? (
                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="max-w-md mx-auto"
                        >
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />

                                <div className="text-left">
                                    <label className="flex items-start space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={smsConsent}
                                            onChange={(e) =>
                                                setSmsConsent(e.target.checked)
                                            }
                                            className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                        />
                                        <span className="text-sm text-slate-300">
                                            Send me SMS notifications for
                                            exclusive deals and updates
                                        </span>
                                    </label>
                                </div>

                                {smsConsent && (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="Phone number (for SMS)"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Subscribe
                            </button>

                            {smsConsent && (
                                <p className="text-xs text-slate-400 mt-3">
                                    By subscribing, you agree to receive SMS
                                    messages. Message and data rates may apply.
                                    Reply STOP to opt out at any time.
                                </p>
                            )}
                        </form>
                    ) : (
                        <div className="max-w-md mx-auto">
                            <div className="bg-green-600 text-white p-6 rounded-lg">
                                <svg
                                    className="w-12 h-12 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold mb-2">
                                    Thank You!
                                </h3>
                                <p className="text-green-100">
                                    You&apos;ve successfully subscribed to our
                                    newsletter.
                                    {smsConsent &&
                                        " Welcome SMS sent to your phone!"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-[#DDE0E6]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <h3 className="buffalo-title text-xl mb-2 text-[#000D25]">
                                BUILD & SHIP
                            </h3>
                            <p className="twilio-text text-[#4D5777]">
                                Complimentary shipping on all builder orders
                                over $100. Fast and reliable delivery to your
                                dev setup.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="buffalo-title text-xl mb-2 text-[#000D25]">
                                QUALITY BUILD
                            </h3>
                            <p className="twilio-text text-[#4D5777]">
                                Premium materials and developer-grade
                                craftsmanship. 30-day return policy for your
                                coding comfort.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="buffalo-title text-xl mb-2 text-[#000D25]">
                                TWILIO SMS
                            </h3>
                            <p className="twilio-text text-[#4D5777]">
                                Stay connected with real-time order updates and
                                exclusive builder offers via Twilio-powered SMS.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
