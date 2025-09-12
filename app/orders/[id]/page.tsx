"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    TruckIcon,
    CheckCircleIcon,
    ClockIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Order } from "../../../types";
// Removed direct Twilio import to avoid client-side Node.js module issues

interface TrackingUpdate {
    status: string;
    message: string;
    timestamp: Date;
    location?: string;
}

export default function OrderTrackingPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<Order | null>(null);
    const [trackingUpdates, setTrackingUpdates] = useState<TrackingUpdate[]>(
        []
    );
    const [currentStatus, setCurrentStatus] = useState("processing");

    useEffect(() => {
        const initializeTracking = (order: Order) => {
            const baseUpdates: TrackingUpdate[] = [
                {
                    status: "processing",
                    message: "Order received and being processed",
                    timestamp: new Date(order.createdAt),
                    location: "Owl Shop Fulfillment Center",
                },
            ];

            setTrackingUpdates(baseUpdates);
            setCurrentStatus("processing");

            // Simulate tracking progress
            setTimeout(() => {
                simulateShippingProgress(order);
            }, 3000);
        };

        if (orderId) {
            const orders = JSON.parse(
                localStorage.getItem("twilio-owl-shop-orders") || "[]"
            );
            const foundOrder = orders.find((o: Order) => o.id === orderId);
            if (foundOrder) {
                setOrder(foundOrder);
                initializeTracking(foundOrder);
            }
        }
    }, [orderId]);

    const simulateShippingProgress = async (order: Order) => {
        const updates: TrackingUpdate[] = [
            {
                status: "picked",
                message: "Items picked and packed",
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24), // +1 day
                location: "Owl Shop Fulfillment Center",
            },
            {
                status: "shipped",
                message: "Package shipped",
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 48), // +2 days
                location: "Origin Facility",
            },
            {
                status: "in-transit",
                message: "In transit to destination",
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 72), // +3 days
                location: "Distribution Center",
            },
            {
                status: "out-for-delivery",
                message: "Out for delivery",
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 96), // +4 days
                location: "Local Delivery Facility",
            },
            {
                status: "delivered",
                message: "Package delivered",
                timestamp: new Date(Date.now() + 1000 * 60 * 60 * 100), // +4.17 days
                location:
                    order.shippingAddress.city +
                    ", " +
                    order.shippingAddress.state,
            },
        ];

        for (let i = 0; i < updates.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay between updates

            setTrackingUpdates((prev) => [...prev, updates[i]]);
            setCurrentStatus(updates[i].status);

            // Send SMS notifications for key updates
            if (order.contactInfo.phone) {
                try {
                    if (updates[i].status === "shipped") {
                        await fetch('/api/sms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'shipping-update',
                                phoneNumber: order.contactInfo.phone,
                                orderNumber: order.id,
                                status: "shipped",
                                trackingNumber: order.trackingNumber
                            })
                        });
                    } else if (updates[i].status === "out-for-delivery") {
                        await fetch('/api/sms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'shipping-update',
                                phoneNumber: order.contactInfo.phone,
                                orderNumber: order.id,
                                status: "out for delivery"
                            })
                        });
                    } else if (updates[i].status === "delivered") {
                        await fetch('/api/sms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'shipping-update',
                                phoneNumber: order.contactInfo.phone,
                                orderNumber: order.id,
                                status: "delivered"
                            })
                        });

                        // Send survey request after delivery
                        setTimeout(async () => {
                            await fetch('/api/sms', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    action: 'post-purchase-survey',
                                    phoneNumber: order.contactInfo.phone!,
                                    orderNumber: order.id
                                })
                            });
                        }, 3000);
                    }
                } catch (error) {
                    console.error("Failed to send SMS update:", error);
                }
            }
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
            case "out-for-delivery":
            case "in-transit":
            case "shipped":
                return <TruckIcon className="h-6 w-6 text-blue-500" />;
            default:
                return <ClockIcon className="h-6 w-6 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered":
                return "text-green-600 bg-green-50 border-green-200";
            case "out-for-delivery":
            case "in-transit":
            case "shipped":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "processing":
            case "picked":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const formatStatus = (status: string) => {
        return status
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Order Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">
                        We couldn&apos;t find the order you&apos;re looking for.
                    </p>
                    <Link
                        href="/account"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/account"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Account
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Order #{order.id}
                            </h1>
                            <p className="text-gray-600">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                    currentStatus
                                )}`}
                            >
                                {formatStatus(currentStatus)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tracking Timeline */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Tracking Information
                            </h2>

                            {order.trackingNumber && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Tracking Number
                                            </p>
                                            <p className="text-lg font-mono text-gray-700">
                                                {order.trackingNumber}
                                            </p>
                                        </div>
                                        <TruckIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="space-y-6">
                                {trackingUpdates.map((update, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="flex-shrink-0 mt-1">
                                            {getStatusIcon(update.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {update.message}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {update.timestamp.toLocaleDateString()}{" "}
                                                    at{" "}
                                                    {update.timestamp.toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                            {update.location && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {update.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {currentStatus !== "delivered" && (
                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center space-x-2 text-blue-800">
                                        <TruckIcon className="h-5 w-5" />
                                        <span className="font-medium">
                                            Live Tracking Demo
                                        </span>
                                    </div>
                                    <p className="text-blue-700 text-sm mt-1">
                                        This is a demo showing real-time
                                        tracking updates. Watch as your order
                                        progresses through different stages!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Order Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Order Summary
                            </h3>

                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="relative w-12 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {item.size} • {item.color} •
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">
                                        Subtotal
                                    </span>
                                    <span className="text-gray-900">
                                        ${order.subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">
                                        ${order.tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>
                                    <span className="text-gray-900">
                                        {order.shipping === 0
                                            ? "FREE"
                                            : `$${order.shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold border-t border-gray-200 pt-3">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Shipping Address
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">
                                    {order.contactInfo.firstName}{" "}
                                    {order.contactInfo.lastName}
                                </p>
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state}{" "}
                                    {order.shippingAddress.zipCode}
                                </p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>

                        {/* SMS Updates */}
                        {order.contactInfo.phone && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2 text-green-800">
                                    <span className="text-lg">📱</span>
                                    <span className="font-medium">
                                        SMS Updates Active
                                    </span>
                                </div>
                                <p className="text-green-700 text-sm mt-1">
                                    You&apos;ll receive SMS notifications at{" "}
                                    {order.contactInfo.phone} for shipping
                                    updates.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
