"use client";

import React, { useState, useEffect } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "signin" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    initialMode = "signin",
}) => {
    const [mode, setMode] = useState<"signin" | "signup">(initialMode);

    // Update mode when initialMode changes
    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    if (!isOpen) return null;

    const handleSuccess = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === "signin" ? "Sign In" : "Create Account"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div>
                        {mode === "signin" ? (
                            <SignIn
                                onSuccess={handleSuccess}
                                onSwitchToSignUp={() => setMode("signup")}
                            />
                        ) : (
                            <SignUp
                                onSuccess={handleSuccess}
                                onSwitchToSignIn={() => setMode("signin")}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
