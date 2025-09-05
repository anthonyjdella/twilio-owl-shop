"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
    id: string;
    email: string;
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
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signUp: (
        userData: Omit<User, "id" | "createdAt">
    ) => Promise<{ success: boolean; error?: string }>;
    signIn: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error?: string }>;
    signOut: () => void;
    updateProfile: (
        userData: Partial<User>
    ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("owlshop_current_user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error loading user from localStorage:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save user to localStorage whenever user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("owlshop_current_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("owlshop_current_user");
        }
    }, [user]);

    const signUp = async (
        userData: Omit<User, "id" | "createdAt">
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            // Get existing users
            const existingUsers = JSON.parse(
                localStorage.getItem("owlshop_users") || "[]"
            );

            // Check if email already exists
            if (existingUsers.find((u: User) => u.email === userData.email)) {
                return { success: false, error: "Email already exists" };
            }

            // Create new user
            const newUser: User = {
                ...userData,
                id: `user_${Date.now()}`,
                createdAt: new Date().toISOString(),
            };

            // Save to users list
            const updatedUsers = [...existingUsers, newUser];
            localStorage.setItem("owlshop_users", JSON.stringify(updatedUsers));

            // Set as current user (auto sign-in)
            setUser(newUser);

            return { success: true };
        } catch (error) {
            return { success: false, error: "Failed to create account" };
        }
    };

    const signIn = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            // Get existing users
            const existingUsers = JSON.parse(
                localStorage.getItem("owlshop_users") || "[]"
            );

            // Find user (for demo, we'll just check email exists)
            const foundUser = existingUsers.find(
                (u: User) => u.email === email
            );

            if (!foundUser) {
                return { success: false, error: "Invalid email or password" };
            }

            // Set as current user
            setUser(foundUser);

            return { success: true };
        } catch (error) {
            return { success: false, error: "Failed to sign in" };
        }
    };

    const signOut = () => {
        setUser(null);
    };

    const updateProfile = async (
        userData: Partial<User>
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            if (!user) {
                return { success: false, error: "No user logged in" };
            }

            // Update current user
            const updatedUser = { ...user, ...userData };

            // Update in users list
            const existingUsers = JSON.parse(
                localStorage.getItem("owlshop_users") || "[]"
            );
            const updatedUsers = existingUsers.map((u: User) =>
                u.id === user.id ? updatedUser : u
            );
            localStorage.setItem("owlshop_users", JSON.stringify(updatedUsers));

            // Update current user
            setUser(updatedUser);

            return { success: true };
        } catch (error) {
            return { success: false, error: "Failed to update profile" };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signUp,
                signIn,
                signOut,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
