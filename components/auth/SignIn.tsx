"use client";

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface SignInProps {
    onSuccess?: () => void;
    onSwitchToSignUp?: () => void;
}

export default function SignIn({ onSuccess, onSwitchToSignUp }: SignInProps) {
    const { signIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn(formData.email, formData.password);

            if (result.success) {
                onSuccess?.();
            } else {
                setError(result.error || "Failed to sign in");
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
                Sign In to Your Account
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#4D5777] mb-1">
                        Email Address
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
                        Password
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

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF1233] text-white py-3 px-4 rounded-md hover:bg-[#DB132A] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            {onSwitchToSignUp && (
                <p className="text-center mt-4 text-sm text-[#4D5777]">
                    Don&apos;t have an account?{" "}
                    <button
                        onClick={onSwitchToSignUp}
                        className="text-[#FF1233] hover:underline font-medium"
                    >
                        Create Account
                    </button>
                </p>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700 font-medium mb-2">
                    Demo Instructions:
                </p>
                <p className="text-xs text-blue-600">
                    Since this is a demo without a database, just enter any
                    email address that you&apos;ve previously used to create an
                    account. The password field is for display only.
                </p>
            </div>
        </div>
    );
}
