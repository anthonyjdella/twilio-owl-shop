"use client";

import { useAuth } from "../../contexts/AuthContext";
import Profile from "../../components/auth/Profile";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen bg-[#DDE0E6] py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#DDE0E6] py-12">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <h1 className="buffalo-title text-2xl text-[#000D25] mb-4">
                            Sign In Required
                        </h1>
                        <p className="text-[#4D5777] mb-6">
                            Please sign in to view your profile.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="bg-[#FF1233] text-white px-6 py-3 rounded-md hover:bg-[#DB132A] font-medium"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#DDE0E6] py-12">
            <div className="max-w-4xl mx-auto px-4">
                <Profile />
            </div>
        </div>
    );
}
