"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LockClosedIcon,
    CreditCardIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";
import { CartItem, Address } from "../../types";
import { getCartTotal, calculateTax, calculateShipping } from "../../lib/cart";
import {
    sendOrderConfirmation,
    validatePhoneNumber,
    formatPhoneNumber,
} from "../../lib/twilio";

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states
    const [shippingAddress, setShippingAddress] = useState<Address>({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
    });

    const [billingAddress, setBillingAddress] = useState<Address>({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
    });

    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [contactInfo, setContactInfo] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
    });

    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        nameOnCard: "",
    });

    const [smsConsent, setSmsConsent] = useState(true);

    useEffect(() => {
        const savedCart = localStorage.getItem("twilio-owl-shop-cart");
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            if (cartData.length === 0) {
                router.push("/cart");
                return;
            }
            setCart(cartData);
        } else {
            router.push("/cart");
        }

        // Load user info if logged in
        const savedUser = localStorage.getItem("twilio-owl-shop-user");
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setContactInfo((prev) => ({
                ...prev,
                email: user.email || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
            }));
        }
    }, [router]);

    const subtotal = getCartTotal(cart);
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + tax + shipping;

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const generateOrderNumber = () => {
        return (
            "OWL" +
            Date.now().toString().slice(-6) +
            Math.floor(Math.random() * 100)
                .toString()
                .padStart(2, "0")
        );
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const orderNumber = generateOrderNumber();

        // Send SMS confirmation if consent given and phone provided
        if (
            smsConsent &&
            contactInfo.phone &&
            validatePhoneNumber(contactInfo.phone)
        ) {
            try {
                await sendOrderConfirmation(
                    contactInfo.phone,
                    orderNumber,
                    total
                );
            } catch (error) {
                console.error("Failed to send SMS:", error);
            }
        }

        // Store order in localStorage for demo
        const order = {
            id: orderNumber,
            items: cart,
            shippingAddress,
            billingAddress: sameAsShipping ? shippingAddress : billingAddress,
            contactInfo,
            subtotal,
            tax,
            shipping,
            total,
            status: "processing",
            createdAt: new Date().toISOString(),
            trackingNumber: "TRK" + orderNumber.slice(-6),
        };

        const orders = JSON.parse(
            localStorage.getItem("twilio-owl-shop-orders") || "[]"
        );
        orders.push(order);
        localStorage.setItem("twilio-owl-shop-orders", JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem("twilio-owl-shop-cart");

        setIsProcessing(false);

        // Redirect to success page
        router.push(`/checkout/success?order=${orderNumber}`);
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return (
                    contactInfo.email &&
                    contactInfo.firstName &&
                    contactInfo.lastName &&
                    shippingAddress.street &&
                    shippingAddress.city &&
                    shippingAddress.state &&
                    shippingAddress.zipCode
                );
            case 2:
                return (
                    paymentInfo.cardNumber &&
                    paymentInfo.expiryDate &&
                    paymentInfo.cvv &&
                    paymentInfo.nameOnCard
                );
            case 3:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Checkout
                    </h1>
                    <div className="flex items-center justify-center space-x-2 mt-4">
                        <LockClosedIcon className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-600">
                            Secure checkout
                        </span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-8">
                        {[
                            { step: 1, title: "Shipping" },
                            { step: 2, title: "Payment" },
                            { step: 3, title: "Review" },
                        ].map(({ step, title }) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        currentStep >= step
                                            ? "bg-black text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                                >
                                    {step}
                                </div>
                                <span
                                    className={`ml-2 text-sm ${
                                        currentStep >= step
                                            ? "text-black font-medium"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {/* Step 1: Shipping Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Shipping Information
                                    </h2>

                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Contact Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={
                                                        contactInfo.firstName
                                                    }
                                                    onChange={(e) =>
                                                        setContactInfo({
                                                            ...contactInfo,
                                                            firstName:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={contactInfo.lastName}
                                                    onChange={(e) =>
                                                        setContactInfo({
                                                            ...contactInfo,
                                                            lastName:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={contactInfo.email}
                                                    onChange={(e) =>
                                                        setContactInfo({
                                                            ...contactInfo,
                                                            email: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={contactInfo.phone}
                                                    onChange={(e) =>
                                                        setContactInfo({
                                                            ...contactInfo,
                                                            phone: e.target
                                                                .value,
                                                        })
                                                    }
                                                    placeholder="(555) 123-4567"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Shipping Address
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Street Address *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={
                                                        shippingAddress.street
                                                    }
                                                    onChange={(e) =>
                                                        setShippingAddress({
                                                            ...shippingAddress,
                                                            street: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        City *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={
                                                            shippingAddress.city
                                                        }
                                                        onChange={(e) =>
                                                            setShippingAddress({
                                                                ...shippingAddress,
                                                                city: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        State *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={
                                                            shippingAddress.state
                                                        }
                                                        onChange={(e) =>
                                                            setShippingAddress({
                                                                ...shippingAddress,
                                                                state: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        ZIP Code *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={
                                                            shippingAddress.zipCode
                                                        }
                                                        onChange={(e) =>
                                                            setShippingAddress({
                                                                ...shippingAddress,
                                                                zipCode:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SMS Consent */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <label className="flex items-start">
                                            <input
                                                type="checkbox"
                                                checked={smsConsent}
                                                onChange={(e) =>
                                                    setSmsConsent(
                                                        e.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 text-black border-gray-300 focus:ring-black mt-0.5"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                I consent to receive SMS updates
                                                about my order, including
                                                shipping notifications and
                                                delivery confirmations. Standard
                                                message and data rates may
                                                apply.
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Payment Information
                                    </h2>

                                    {/* Payment Method */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Payment Method
                                        </h3>
                                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                            <div className="flex items-center space-x-2 mb-4">
                                                <CreditCardIcon className="h-5 w-5 text-gray-600" />
                                                <span className="font-medium">
                                                    Credit/Debit Card
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Card Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="1234 5678 9012 3456"
                                                        value={
                                                            paymentInfo.cardNumber
                                                        }
                                                        onChange={(e) =>
                                                            setPaymentInfo({
                                                                ...paymentInfo,
                                                                cardNumber:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Expiry Date *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="MM/YY"
                                                            value={
                                                                paymentInfo.expiryDate
                                                            }
                                                            onChange={(e) =>
                                                                setPaymentInfo({
                                                                    ...paymentInfo,
                                                                    expiryDate:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            CVV *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="123"
                                                            value={
                                                                paymentInfo.cvv
                                                            }
                                                            onChange={(e) =>
                                                                setPaymentInfo({
                                                                    ...paymentInfo,
                                                                    cvv: e
                                                                        .target
                                                                        .value,
                                                                })
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Name on Card *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={
                                                                paymentInfo.nameOnCard
                                                            }
                                                            onChange={(e) =>
                                                                setPaymentInfo({
                                                                    ...paymentInfo,
                                                                    nameOnCard:
                                                                        e.target
                                                                            .value,
                                                                })
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Billing Address */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Billing Address
                                        </h3>
                                        <label className="flex items-center mb-4">
                                            <input
                                                type="checkbox"
                                                checked={sameAsShipping}
                                                onChange={(e) =>
                                                    setSameAsShipping(
                                                        e.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Same as shipping address
                                            </span>
                                        </label>

                                        {!sameAsShipping && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Street Address *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={
                                                            billingAddress.street
                                                        }
                                                        onChange={(e) =>
                                                            setBillingAddress({
                                                                ...billingAddress,
                                                                street: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            City *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={
                                                                billingAddress.city
                                                            }
                                                            onChange={(e) =>
                                                                setBillingAddress(
                                                                    {
                                                                        ...billingAddress,
                                                                        city: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            State *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={
                                                                billingAddress.state
                                                            }
                                                            onChange={(e) =>
                                                                setBillingAddress(
                                                                    {
                                                                        ...billingAddress,
                                                                        state: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            ZIP Code *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={
                                                                billingAddress.zipCode
                                                            }
                                                            onChange={(e) =>
                                                                setBillingAddress(
                                                                    {
                                                                        ...billingAddress,
                                                                        zipCode:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Review Order */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Review Your Order
                                    </h2>

                                    {/* Contact & Shipping Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">
                                                Contact Information
                                            </h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                    {contactInfo.firstName}{" "}
                                                    {contactInfo.lastName}
                                                </p>
                                                <p>{contactInfo.email}</p>
                                                {contactInfo.phone && (
                                                    <p>
                                                        {formatPhoneNumber(
                                                            contactInfo.phone
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">
                                                Shipping Address
                                            </h3>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>{shippingAddress.street}</p>
                                                <p>
                                                    {shippingAddress.city},{" "}
                                                    {shippingAddress.state}{" "}
                                                    {shippingAddress.zipCode}
                                                </p>
                                                <p>{shippingAddress.country}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">
                                            Payment Method
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            <p>
                                                **** **** ****{" "}
                                                {paymentInfo.cardNumber.slice(
                                                    -4
                                                )}
                                            </p>
                                            <p>{paymentInfo.nameOnCard}</p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-4">
                                            Order Items
                                        </h3>
                                        <div className="space-y-4">
                                            {cart.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-4 py-4 border-b border-gray-200"
                                                >
                                                    <div className="relative w-16 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={
                                                                item.product
                                                                    .images[0]
                                                            }
                                                            alt={
                                                                item.product
                                                                    .name
                                                            }
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">
                                                            {item.product.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            {item.size} •{" "}
                                                            {item.color} • Qty:{" "}
                                                            {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-gray-900">
                                                            $
                                                            {(
                                                                item.product
                                                                    .price *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    onClick={handlePreviousStep}
                                    disabled={currentStep === 1}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {currentStep < 3 ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!isStepValid()}
                                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={
                                            isProcessing || !isStepValid()
                                        }
                                        className="px-8 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing
                                            ? "Processing..."
                                            : "Place Order"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({cart.length} items)
                                    </span>
                                    <span className="text-gray-900">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">
                                        ${tax.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>
                                    <span className="text-gray-900">
                                        {shipping === 0
                                            ? "FREE"
                                            : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <TruckIcon className="h-4 w-4" />
                                    <span>
                                        Free shipping on orders over $100
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                                    <span>📱</span>
                                    <span>SMS updates included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
