"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        marketing: true,
        notifications: true,
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Demo login - in real app, this would authenticate with a server
        setIsLoggedIn(true);
        localStorage.setItem(
            "twilio-owl-shop-user",
            JSON.stringify({
                email: loginForm.email,
                firstName: "Demo",
                lastName: "User",
            })
        );
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Demo registration - in real app, this would create an account
        setIsLoggedIn(true);
        localStorage.setItem(
            "twilio-owl-shop-user",
            JSON.stringify({
                email: registerForm.email,
                firstName: registerForm.firstName,
                lastName: registerForm.lastName,
                phone: registerForm.phone,
            })
        );
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem("twilio-owl-shop-user");
    };

    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center mb-8">
                            <div className="text-4xl mb-4">👤</div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                My Account
                            </h1>
                            <p className="text-gray-600">
                                Welcome back,{" "}
                                {registerForm.firstName || "Demo User"}!
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Account Info */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Account Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <p className="text-gray-900">
                                            {registerForm.firstName || "Demo"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <p className="text-gray-900">
                                            {registerForm.lastName || "User"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <p className="text-gray-900">
                                            {registerForm.email ||
                                                loginForm.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <p className="text-gray-900">
                                            {registerForm.phone ||
                                                "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    href="/orders"
                                    className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition duration-200 text-center"
                                >
                                    <div className="text-2xl mb-2">📦</div>
                                    <h3 className="font-medium text-gray-900">
                                        Order History
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        View your past orders
                                    </p>
                                </Link>
                                <Link
                                    href="/wishlist"
                                    className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition duration-200 text-center"
                                >
                                    <div className="text-2xl mb-2">❤️</div>
                                    <h3 className="font-medium text-gray-900">
                                        Wishlist
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Saved items
                                    </p>
                                </Link>
                            </div>

                            {/* Communication Preferences */}
                            <div className="border-t border-gray-200 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Communication Preferences
                                </h2>
                                <div className="space-y-3">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={registerForm.marketing}
                                            onChange={(e) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    marketing: e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Receive marketing messages and
                                            exclusive offers via SMS
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={registerForm.notifications}
                                            onChange={(e) =>
                                                setRegisterForm({
                                                    ...registerForm,
                                                    notifications:
                                                        e.target.checked,
                                                })
                                            }
                                            className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">
                                            Receive order updates and shipping
                                            notifications
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-200 pt-6">
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-4xl mb-4">🦉</div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome to Owl Shop
                        </h1>
                        <p className="text-gray-600">
                            Sign in to your account or create a new one
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-2 text-center font-medium ${
                                activeTab === "login"
                                    ? "border-b-2 border-black text-black"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 py-2 text-center font-medium ${
                                activeTab === "register"
                                    ? "border-b-2 border-black text-black"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Login Form */}
                    {activeTab === "login" && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="login-email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    required
                                    value={loginForm.email}
                                    onChange={(e) =>
                                        setLoginForm({
                                            ...loginForm,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="login-password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                        value={loginForm.password}
                                        onChange={(e) =>
                                            setLoginForm({
                                                ...loginForm,
                                                password: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-black hover:text-gray-700"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 font-medium"
                            >
                                Sign In
                            </button>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === "register" && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="first-name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        First Name
                                    </label>
                                    <input
                                        id="first-name"
                                        type="text"
                                        required
                                        value={registerForm.firstName}
                                        onChange={(e) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="First name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="last-name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Last Name
                                    </label>
                                    <input
                                        id="last-name"
                                        type="text"
                                        required
                                        value={registerForm.lastName}
                                        onChange={(e) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                lastName: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                        placeholder="Last name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="register-email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="register-email"
                                    type="email"
                                    required
                                    value={registerForm.email}
                                    onChange={(e) =>
                                        setRegisterForm({
                                            ...registerForm,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Phone Number (Optional)
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={registerForm.phone}
                                    onChange={(e) =>
                                        setRegisterForm({
                                            ...registerForm,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="(555) 123-4567"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    We&apos;ll use this to send you order
                                    updates and exclusive offers
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="register-password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="register-password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        required
                                        value={registerForm.password}
                                        onChange={(e) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                password: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        value={registerForm.confirmPassword}
                                        onChange={(e) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent pr-10"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={registerForm.marketing}
                                        onChange={(e) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                marketing: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 text-black border-gray-300 focus:ring-black mt-0.5"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        I want to receive marketing messages and
                                        exclusive offers via SMS
                                    </span>
                                </label>
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={registerForm.notifications}
                                        onChange={(e) =>
                                            setRegisterForm({
                                                ...registerForm,
                                                notifications: e.target.checked,
                                            })
                                        }
                                        className="h-4 w-4 text-black border-gray-300 focus:ring-black mt-0.5"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        I want to receive order updates and
                                        shipping notifications
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 font-medium"
                            >
                                Create Account
                            </button>
                        </form>
                    )}

                    {/* Guest Checkout */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-600 mb-3">
                            Don&apos;t want to create an account?
                        </p>
                        <Link
                            href="/cart"
                            className="text-black hover:text-gray-700 font-medium text-sm underline"
                        >
                            Continue as guest
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
