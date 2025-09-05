"use client";

import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
    const { user, updateProfile, signOut } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        homeAddress: {
            street: user?.homeAddress.street || "",
            city: user?.homeAddress.city || "",
            state: user?.homeAddress.state || "",
            zipCode: user?.homeAddress.zipCode || "",
            country: user?.homeAddress.country || "United States",
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

    const handleSave = async () => {
        setError("");
        setSuccess("");

        // Validate zip code
        const zipCodePattern = /^\d{5}(-\d{4})?$/;
        if (!zipCodePattern.test(formData.homeAddress.zipCode)) {
            setError("Please enter a valid zip code (12345 or 12345-6789)");
            return;
        }

        setIsLoading(true);

        try {
            const result = await updateProfile(formData);

            if (result.success) {
                setSuccess("Profile updated successfully!");
                setIsEditing(false);
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(result.error || "Failed to update profile");
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phoneNumber: user?.phoneNumber || "",
            homeAddress: {
                street: user?.homeAddress.street || "",
                city: user?.homeAddress.city || "",
                state: user?.homeAddress.state || "",
                zipCode: user?.homeAddress.zipCode || "",
                country: user?.homeAddress.country || "United States",
            },
        });
        setIsEditing(false);
        setError("");
    };

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <p className="text-center text-[#4D5777]">
                    Please sign in to view your profile.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="buffalo-title text-2xl text-[#000D25]">
                    My Profile
                </h2>
                <div className="space-x-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-[#FF1233] text-white px-4 py-2 rounded-md hover:bg-[#DB132A] font-medium"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-[#FF1233] text-white px-4 py-2 rounded-md hover:bg-[#DB132A] disabled:opacity-50 font-medium"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <div className="space-y-6">
                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-medium text-[#000D25] mb-4">
                        Personal Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                First Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                />
                            ) : (
                                <p className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                Last Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                />
                            ) : (
                                <p className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Email Address
                        </label>
                        <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-600">
                            {user.email} (cannot be changed)
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Phone Number
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1234567890"
                                className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-md">
                                {user.phoneNumber || "Not provided"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Home Address */}
                <div>
                    <h3 className="text-lg font-medium text-[#000D25] mb-4">
                        Home Address
                    </h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Street Address
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="address.street"
                                value={formData.homeAddress.street}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            />
                        ) : (
                            <p className="px-3 py-2 bg-gray-50 rounded-md">
                                {user.homeAddress.street}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                City
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.homeAddress.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                />
                            ) : (
                                <p className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.homeAddress.city}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                State
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.homeAddress.state}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                />
                            ) : (
                                <p className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.homeAddress.state}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                Zip Code
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    value={formData.homeAddress.zipCode}
                                    onChange={handleChange}
                                    placeholder="12345"
                                    className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                                />
                            ) : (
                                <p className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.homeAddress.zipCode}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#4D5777] mb-1">
                                Country
                            </label>
                            {isEditing ? (
                                <select
                                    name="address.country"
                                    value={formData.homeAddress.country}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#4D5777] rounded-md focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
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
                            ) : (
                                <p className="px-3 py-2 bg-gray-50 rounded-md">
                                    {user.homeAddress.country}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Info */}
                <div>
                    <h3 className="text-lg font-medium text-[#000D25] mb-4">
                        Account Information
                    </h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#4D5777] mb-1">
                            Member Since
                        </label>
                        <p className="px-3 py-2 bg-gray-50 rounded-md">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Sign Out */}
                <div className="border-t pt-6">
                    <button
                        onClick={signOut}
                        className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
