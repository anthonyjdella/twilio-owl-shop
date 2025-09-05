"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircleIcon,
    TruckIcon,
    ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { sendShippingUpdate } from "../../../lib/twilio";
import { Order } from "../../../types";

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order");
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (orderNumber) {
            const orders = JSON.parse(
                localStorage.getItem("twilio-owl-shop-orders") || "[]"
            );
            const foundOrder = orders.find((o: Order) => o.id === orderNumber);
            if (foundOrder) {
                setOrder(foundOrder);

                // Simulate automatic shipping updates after order is placed
                setTimeout(async () => {
                    if (foundOrder.contactInfo.phone) {
                        try {
                            await sendShippingUpdate(
                                foundOrder.contactInfo.phone,
                                foundOrder.id,
                                "shipped",
                                foundOrder.trackingNumber
                            );
                        } catch (error) {
                            console.error(
                                "Failed to send shipping update:",
                                error
                            );
                        }
                    }
                }, 5000); // Send after 5 seconds for demo
            }
        }
    }, [orderNumber]);

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❓</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Order Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">
                        We couldn&apos;t find the order you&apos;re looking for.
                    </p>
                    <Link
                        href="/"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Order Confirmed!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Thank you for your purchase. Your order has been
                        successfully placed.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                    {/* Order Details Header */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Order #{order.id}
                                </h2>
                                <p className="text-gray-600">
                                    Placed on{" "}
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Processing
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        {/* Shipping Information */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Shipping Information
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

                        {/* Contact Information */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Contact Information
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>{order.contactInfo.email}</p>
                                {order.contactInfo.phone && (
                                    <p>{order.contactInfo.phone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">
                                ${order.subtotal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-gray-900">
                                ${order.tax.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-gray-900">
                                {order.shipping === 0
                                    ? "FREE"
                                    : `$${order.shipping.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-4">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        What happens next?
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-semibold text-sm">
                                    1
                                </span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Order Processing
                                </h4>
                                <p className="text-sm text-gray-600">
                                    We&apos;re preparing your items for
                                    shipment. This usually takes 1-2 business
                                    days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <TruckIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    Shipping & Tracking
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Once shipped, you&apos;ll receive a tracking
                                    number via email and SMS. Expected delivery:
                                    3-5 business days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    SMS Updates
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {order.contactInfo.phone
                                        ? "You'll receive SMS notifications about your order status and delivery updates."
                                        : "Add your phone number to receive SMS updates about your order."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/orders/${order.id}`}
                        className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-300 text-center font-semibold"
                    >
                        Track Your Order
                    </Link>
                    <Link
                        href="/products"
                        className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition duration-300 text-center font-semibold"
                    >
                        Continue Shopping
                    </Link>
                </div>

                {/* SMS Demo Info */}
                {order.contactInfo.phone && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-blue-800">
                            <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                            <span className="font-medium">SMS Demo Active</span>
                        </div>
                        <p className="text-blue-700 text-sm mt-1">
                            In this demo, you&apos;ll receive simulated SMS
                            messages for order confirmations, shipping updates,
                            and delivery notifications. Check the browser
                            console to see the SMS messages.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">⏳</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Loading...
                        </h1>
                    </div>
                </div>
            }
        >
            <CheckoutSuccessContent />
        </Suspense>
    );
}
