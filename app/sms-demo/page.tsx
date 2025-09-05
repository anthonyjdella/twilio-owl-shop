"use client";

import { useState, useEffect } from "react";

interface TwilioStatus {
    configured: boolean;
    demo: boolean;
    accountSid?: string;
    phoneNumber?: string;
}

export default function SMSDemo() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [twilioStatus, setTwilioStatus] = useState<TwilioStatus>({
        configured: false,
        demo: true,
    });

    // Fetch Twilio status on component mount
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch("/api/sms");
                if (response.ok) {
                    const status = await response.json();
                    setTwilioStatus(status);
                }
            } catch (error) {
                console.error("Failed to fetch Twilio status:", error);
            }
        };

        fetchStatus();
    }, []);

    const addResult = (message: string) => {
        setResults((prev) => [
            ...prev,
            `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
    };

    const clearResults = () => {
        setResults([]);
    };

    // Simple validation - just check if phone number exists and has reasonable length
    const isValidPhone = () => {
        return phoneNumber.length >= 10;
    };

    // Handle masked input - track length changes and build actual phone number
    const handleMaskedInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const currentLength = phoneNumber.length;
        const newLength = input.length;

        if (newLength > currentLength) {
            // User is adding characters - extract only the new character
            const lastChar = input[input.length - 1];
            if (/[\d+]/.test(lastChar)) {
                setPhoneNumber(phoneNumber + lastChar);
            }
        } else if (newLength < currentLength) {
            // User is deleting - remove last character from actual phone number
            setPhoneNumber(phoneNumber.slice(0, -1));
        }
    };

    // Always show masked version in input (like password field)
    const getMaskedDisplay = () => {
        if (phoneNumber.length === 0) return "";
        return "*".repeat(phoneNumber.length);
    }; // Helper function to call SMS API
    const callSMSAPI = async (
        action: string,
        params: Record<string, unknown> = {}
    ) => {
        try {
            const response = await fetch("/api/sms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    phoneNumber,
                    ...params,
                }),
            });

            return await response.json();
        } catch (error) {
            console.error("SMS API call failed:", error);
            return { success: false, error: "API call failed" };
        }
    };

    // Helper function to call SMS sequences API
    const callSequenceAPI = async (
        action: string,
        params: Record<string, unknown> = {}
    ) => {
        try {
            const response = await fetch("/api/sms/sequences", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    phoneNumber,
                    ...params,
                }),
            });

            return await response.json();
        } catch (error) {
            console.error("SMS Sequence API call failed:", error);
            return { success: false, error: "Sequence API call failed" };
        }
    };

    // Individual SMS tests
    const testMarketingMessage = async () => {
        setIsRunning(true);
        addResult("🚀 Sending marketing message...");
        const result = await callSMSAPI("marketing");
        addResult(
            result.success
                ? "✅ Marketing SMS sent"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testWelcomeMessage = async () => {
        setIsRunning(true);
        addResult("👋 Sending welcome message...");
        const result = await callSMSAPI("welcome", {
            customerName: "Demo User",
        });
        addResult(
            result.success
                ? "✅ Welcome SMS sent"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testCartAbandonment = async () => {
        setIsRunning(true);
        addResult("🛒 Sending cart abandonment message...");
        const result = await callSMSAPI("cart-abandonment", {
            itemCount: 3,
            cartTotal: 247.5,
        });
        addResult(
            result.success
                ? "✅ Cart abandonment SMS sent"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testOrderConfirmation = async () => {
        setIsRunning(true);
        addResult("📦 Sending order confirmation...");
        const orderNumber = "OWL" + Date.now();
        const result = await callSMSAPI("order-confirmation", {
            orderNumber,
            orderTotal: 247.5,
        });
        addResult(
            result.success
                ? "✅ Order confirmation SMS sent"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testShippingUpdate = async () => {
        setIsRunning(true);
        addResult("🚚 Sending shipping update...");
        const orderNumber = "OWL" + Date.now();
        const result = await callSMSAPI("shipping-update", {
            orderNumber,
            status: "shipped",
            trackingNumber: "TW1234567890",
        });
        addResult(
            result.success
                ? "✅ Shipping update SMS sent"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testPostPurchaseSurvey = async () => {
        setIsRunning(true);
        addResult("📊 Sending post-purchase survey...");
        const orderNumber = "OWL" + Date.now();
        const result = await callSMSAPI("post-purchase-survey", {
            orderNumber,
        });
        addResult(
            result.success ? "✅ Survey SMS sent" : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    // Sequence tests
    const testWelcomeSequence = async () => {
        setIsRunning(true);
        addResult("🚀 Starting welcome sequence...");
        const result = await callSequenceAPI("welcome-sequence", {
            customerName: "Demo User",
        });
        addResult(
            result.success
                ? "✅ Welcome sequence initiated"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testCartAbandonmentSequence = async () => {
        setIsRunning(true);
        addResult("🛒 Starting cart abandonment sequence...");
        const result = await callSequenceAPI("cart-abandonment-sequence", {
            itemCount: 3,
            cartTotal: 247.5,
        });
        addResult(
            result.success
                ? "✅ Cart abandonment sequence initiated"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testOrderSequence = async () => {
        setIsRunning(true);
        addResult("📦 Starting complete order sequence...");
        const orderNumber = "OWL" + Date.now();
        const result = await callSequenceAPI("order-sequence", {
            orderNumber,
            orderTotal: 247.5,
        });
        addResult(
            result.success
                ? "✅ Order sequence initiated (watch for multiple SMS)"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    const testFullDemo = async () => {
        setIsRunning(true);
        addResult("🎭 Starting COMPLETE user journey demo...");
        const result = await callSequenceAPI("full-demo");
        addResult(
            result.success
                ? "✅ Complete demo sequence initiated (check your phone!)"
                : `❌ Failed: ${result.error}`
        );
        setIsRunning(false);
    };

    return (
        <div className="min-h-screen bg-[#DDE0E6] py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="buffalo-title text-4xl text-[#000D25] mb-4">
                        TWILIO SMS INTEGRATION DEMO
                    </h1>
                    <p className="twilio-text text-lg text-[#4D5777]">
                        Test the complete Owl Shop SMS customer journey powered
                        by Twilio
                    </p>
                </div>

                {/* Twilio Status */}
                <div
                    className={`rounded-lg p-4 mb-8 ${
                        twilioStatus.configured
                            ? "bg-green-50 border border-green-200"
                            : "bg-yellow-50 border border-yellow-200"
                    }`}
                >
                    <h3 className="buffalo-title text-lg mb-2 text-[#000D25]">
                        TWILIO STATUS
                    </h3>
                    <div className="twilio-mono text-sm space-y-1">
                        <p>
                            Mode:{" "}
                            {twilioStatus.demo
                                ? "🎭 DEMO MODE"
                                : "📱 LIVE MODE"}
                        </p>
                        <p>
                            Account SID:{" "}
                            {twilioStatus.accountSid || "Not configured"}
                        </p>
                        <p>
                            Twilio Number:{" "}
                            {twilioStatus.phoneNumber || "Not configured"}
                        </p>
                    </div>
                    {twilioStatus.demo && (
                        <p className="twilio-text text-sm text-[#4D5777] mt-2">
                            💡 Running in demo mode. Messages will be logged to
                            console instead of sent via SMS.
                        </p>
                    )}
                </div>

                {/* Message Types Explanation */}
                <div className="mt-8 mb-8 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="buffalo-title text-xl text-[#000D25] mb-4">
                        SMS MESSAGE JOURNEY
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-white text-xl">📈</span>
                            </div>
                            <h4 className="twilio-text font-semibold text-sm text-[#000D25]">
                                Marketing
                            </h4>
                            <p className="twilio-text text-xs text-[#4D5777]">
                                Promotional deals & campaigns
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-white text-xl">🛒</span>
                            </div>
                            <h4 className="twilio-text font-semibold text-sm text-[#000D25]">
                                Cart Recovery
                            </h4>
                            <p className="twilio-text text-xs text-[#4D5777]">
                                Reminders after 1 day
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-white text-xl">📦</span>
                            </div>
                            <h4 className="twilio-text font-semibold text-sm text-[#000D25]">
                                Order Confirm
                            </h4>
                            <p className="twilio-text text-xs text-[#4D5777]">
                                Purchase confirmation
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-white text-xl">🚚</span>
                            </div>
                            <h4 className="twilio-text font-semibold text-sm text-[#000D25]">
                                Shipping
                            </h4>
                            <p className="twilio-text text-xs text-[#4D5777]">
                                Real-time tracking updates
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-[#FF1233] rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-white text-xl">📊</span>
                            </div>
                            <h4 className="twilio-text font-semibold text-sm text-[#000D25]">
                                Survey
                            </h4>
                            <p className="twilio-text text-xs text-[#4D5777]">
                                Post-purchase feedback
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Phone Input & Individual Tests */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                PHONE NUMBER
                            </h2>
                            <input
                                type="tel"
                                value={getMaskedDisplay()}
                                onChange={handleMaskedInput}
                                placeholder="+1234567890"
                                className="twilio-text w-full px-4 py-3 border border-[#4D5777] rounded-lg focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            />
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                INDIVIDUAL SMS TESTS
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={testMarketingMessage}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📈 Marketing Message
                                </button>
                                <button
                                    onClick={testWelcomeMessage}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    👋 Welcome Message
                                </button>
                                <button
                                    onClick={testCartAbandonment}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    🛒 Cart Abandonment
                                </button>
                                <button
                                    onClick={testOrderConfirmation}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📦 Order Confirmation
                                </button>
                                <button
                                    onClick={testShippingUpdate}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    🚚 Shipping Update
                                </button>
                                <button
                                    onClick={testPostPurchaseSurvey}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📊 Post-Purchase Survey
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Sequence Tests */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                SMS SEQUENCES
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={testWelcomeSequence}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-secondary w-full py-3 disabled:opacity-50"
                                >
                                    🚀 Welcome Sequence
                                </button>
                                <p className="twilio-text text-sm text-[#4D5777]">
                                    Welcome message only
                                </p>

                                <button
                                    onClick={testCartAbandonmentSequence}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-secondary w-full py-3 disabled:opacity-50"
                                >
                                    🛒 Cart Abandonment Sequence
                                </button>
                                <p className="twilio-text text-sm text-[#4D5777]">
                                    Single cart abandonment reminder
                                </p>

                                <button
                                    onClick={testOrderSequence}
                                    disabled={!isValidPhone() || isRunning}
                                    className="btn-twilio-secondary w-full py-3 disabled:opacity-50"
                                >
                                    📦 Complete Order Sequence
                                </button>
                                <p className="twilio-text text-sm text-[#4D5777]">
                                    Confirmation → Payment → Shipped → Delivered
                                    → Survey
                                </p>

                                <button
                                    onClick={testFullDemo}
                                    disabled={!isValidPhone() || isRunning}
                                    className="bg-gradient-to-r from-[#FF1233] to-[#DB132A] text-white w-full py-4 rounded-lg font-bold disabled:opacity-50"
                                >
                                    🎭 FULL USER JOURNEY
                                </button>
                                <p className="twilio-text text-sm text-[#4D5777]">
                                    Complete customer journey from signup to
                                    post-purchase
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Results Log */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="buffalo-title text-xl text-[#000D25]">
                                    SMS RESULTS LOG
                                </h2>
                                <button
                                    onClick={clearResults}
                                    className="text-[#FF1233] hover:text-[#DB132A] text-sm"
                                >
                                    Clear Log
                                </button>
                            </div>
                            <div className="bg-[#191F36] rounded-lg p-4 h-96 overflow-y-auto">
                                <div className="space-y-2">
                                    {results.length === 0 ? (
                                        <p className="twilio-mono text-[#DDE0E6] text-sm">
                                            No messages sent yet. Enter a phone
                                            number and test SMS functionality.
                                        </p>
                                    ) : (
                                        results.map((result, index) => (
                                            <div
                                                key={index}
                                                className="twilio-mono text-[#DDE0E6] text-sm"
                                            >
                                                {result}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="mt-8 bg-[#081F47] rounded-lg p-6 text-white">
                    <h3 className="buffalo-title text-xl mb-4">
                        SETUP INSTRUCTIONS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="twilio-text font-semibold mb-2">
                                For Live SMS (Production):
                            </h4>
                            <ol className="twilio-text text-sm space-y-1 text-[#DDE0E6]">
                                <li>
                                    1. Create account at{" "}
                                    <a
                                        href="https://twilio.com"
                                        className="text-[#FF1233] underline"
                                    >
                                        twilio.com
                                    </a>
                                </li>
                                <li>
                                    2. Get Account SID & Auth Token from Console
                                </li>
                                <li>3. Purchase a Twilio phone number</li>
                                <li>4. Add credentials to .env.local file</li>
                                <li>5. Test with real phone numbers</li>
                            </ol>
                        </div>
                        <div>
                            <h4 className="twilio-text font-semibold mb-2">
                                Demo Mode Features:
                            </h4>
                            <ul className="twilio-text text-sm space-y-1 text-[#DDE0E6]">
                                <li>• All SMS messages logged to console</li>
                                <li>• Complete user journey simulation</li>
                                <li>• Timing sequences for realistic demo</li>
                                <li>• No actual SMS charges incurred</li>
                                <li>• Perfect for presentations & testing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
