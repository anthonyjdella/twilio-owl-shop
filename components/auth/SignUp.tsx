"use client";

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface SignUpFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    homeAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

interface SignUpProps {
    onSuccess?: () => void;
    onSwitchToSignIn?: () => void;
}

export default function SignUp({ onSuccess, onSwitchToSignIn }: SignUpProps) {
    const { signUp } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<SignUpFormData>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        homeAddress: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "United States",
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                homeAddress: {
                    ...prev.homeAddress,
                    [addressField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = (): boolean => {
        if (
            !formData.email ||
            !formData.password ||
            !formData.firstName ||
            !formData.lastName
        ) {
            setError("Please fill in all required fields");
            return false;
        }

        if (
            !formData.homeAddress.street ||
            !formData.homeAddress.city ||
            !formData.homeAddress.state ||
            !formData.homeAddress.zipCode
        ) {
            setError("Please complete your home address including zip code");
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        const zipCodePattern = /^\d{5}(-\d{4})?$/;
        if (!zipCodePattern.test(formData.homeAddress.zipCode)) {
            setError("Please enter a valid zip code (12345 or 12345-6789)");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const { email, firstName, lastName, phoneNumber, homeAddress } =
                formData;
            const result = await signUp({
                email,
                firstName,
                lastName,
                phoneNumber,
                homeAddress,
            });

            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || "Failed to create account");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="buffalo-title text-2xl text-[#000D25] mb-6 text-center">
                Create Your Account
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            First Name *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#4D5777] mb-1">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#4D5777] mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+1234567890"
                        className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                    />
                </div>

                {/* Home Address */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-[#000D25] mb-3">
                        Home Address *
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Street Address *
                        </label>
                        <input
                            type="text"
                            name="address.street"
                            value={formData.homeAddress.street}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                City *
                            </label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.homeAddress.city}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                State *
                            </label>
                            <input
                                type="text"
                                name="address.state"
                                value={formData.homeAddress.state}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                Zip Code *
                            </label>
                            <input
                                type="text"
                                name="address.zipCode"
                                value={formData.homeAddress.zipCode}
                                onChange={handleChange}
                                placeholder="12345"
                                className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                Country *
                            </label>
                            <select
                                name="address.country"
                                value={formData.homeAddress.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                required
                            >
                                <option value="United States">
                                    United States
                                </option>
                                <option value="Canada">Canada</option>
                                <option value="United Kingdom">
                                    United Kingdom
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF1233] text-white py-3 px-4 rounded-md hover:bg-[#DB132A] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            {onSwitchToSignIn && (
                <p className="text-center mt-4 text-sm text-[#4D5777]">
                    Already have an account?{" "}
                    <button
                        onClick={onSwitchToSignIn}
                        className="text-[#FF1233] hover:underline font-medium"
                    >
                        Sign In
                    </button>
                </p>
            )}
        </div>
    );
}
