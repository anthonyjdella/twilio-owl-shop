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

    // SMS Options state
    const [riskCheck, setRiskCheck] = useState<"enable" | "disable">("enable");
    const [messageIntent, setMessageIntent] = useState<
        | "otp"
        | "notifications"
        | "fraud"
        | "security"
        | "customercare"
        | "delivery"
        | "education"
        | "events"
        | "polling"
        | "announcements"
        | "marketing"
    >("marketing");
    const [useRiskCheck, setUseRiskCheck] = useState(false);
    const [useMessageIntent, setUseMessageIntent] = useState(false);

    // Consent Management state
    const [consentPhoneNumbers, setConsentPhoneNumbers] = useState("");
    const [consentStatus, setConsentStatus] = useState<"opt-in" | "opt-out">(
        "opt-in"
    );
    const [consentSource, setConsentSource] = useState<
        "website" | "offline" | "opt-in-message" | "opt-out-message" | "others"
    >("website");
    const [consentDate, setConsentDate] = useState("");

    // Contact Management state - separate fields
    const [contactPhoneNumber, setContactPhoneNumber] = useState("");
    const [contactZipCode, setContactZipCode] = useState("");
    const [contactCountryCode, setContactCountryCode] = useState("US");
    const [bulkContactData, setBulkContactData] = useState<
        Array<{ phoneNumber: string; zipCode: string; countryCode: string }>
    >([]);

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

    // Helper function to call SMS API
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

        const options: {
            riskCheck?: "enable" | "disable";
            messageIntent?: string;
        } = {};
        if (useRiskCheck) options.riskCheck = riskCheck;
        if (useMessageIntent) options.messageIntent = messageIntent;

        const result = await callSMSAPI(
            "marketing",
            Object.keys(options).length > 0 ? { options } : {}
        );

        const optionsStr =
            Object.keys(options).length > 0
                ? ` (${Object.entries(options)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")})`
                : "";

        addResult(
            result.success
                ? `✅ Marketing SMS sent${optionsStr}`
                : `❌ Failed: ${result.error}`
        );

        // Log detailed Twilio response
        addResult(`📋 Full Twilio Response:`);
        addResult(`   SID: ${result.sid || "N/A"}`);
        addResult(`   Demo Mode: ${result.demo ? "Yes" : "No"}`);
        addResult(`   Status: ${result.success ? "Success" : "Failed"}`);

        // Show enhanced Twilio response details if available
        if (result.twilioResponse) {
            addResult(`   📱 Enhanced Twilio Details:`);
            addResult(
                `      Account SID: ${
                    result.twilioResponse.accountSid || "N/A"
                }`
            );
            addResult(
                `      Message Status: ${result.twilioResponse.status || "N/A"}`
            );
            addResult(
                `      Date Created: ${
                    result.twilioResponse.dateCreated || "N/A"
                }`
            );
            addResult(`      From: ${result.twilioResponse.from || "N/A"}`);
            addResult(`      To: ${result.twilioResponse.to || "N/A"}`);
            addResult(
                `      Direction: ${result.twilioResponse.direction || "N/A"}`
            );
            addResult(
                `      Price: ${result.twilioResponse.price || "N/A"} ${
                    result.twilioResponse.priceUnit || ""
                }`
            );
            addResult(
                `      Segments: ${result.twilioResponse.numSegments || "N/A"}`
            );
        }

        if (result.error) {
            addResult(`   Error: ${JSON.stringify(result.error, null, 2)}`);
        }
        if (result.errorDetails) {
            addResult(
                `   Error Details: ${JSON.stringify(
                    result.errorDetails,
                    null,
                    2
                )}`
            );
        }
        if (Object.keys(options).length > 0) {
            addResult(`   Options Used: ${JSON.stringify(options, null, 2)}`);
        }
        addResult(`   Raw Response: ${JSON.stringify(result, null, 2)}`);
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

    // Consent Management API test
    const testConsentManagement = async () => {
        setIsRunning(true);
        addResult("📋 Managing consent preferences...");

        const phoneNumbers = consentPhoneNumbers
            .split("\n")
            .filter((num) => num.trim());
        if (phoneNumbers.length === 0) {
            addResult("❌ No phone numbers provided");
            setIsRunning(false);
            return;
        }

        // Format phone numbers and prepare data
        const contacts = phoneNumbers.map((phoneNumber) => {
            let formattedPhone = phoneNumber.trim();
            // Add + if missing for E.164 format
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = `+${formattedPhone}`;
            }

            // Format the date properly
            let dateOfConsent = consentDate;
            if (dateOfConsent) {
                // Convert datetime-local to proper ISO format
                if (
                    dateOfConsent.includes("T") &&
                    !dateOfConsent.includes("Z") &&
                    !dateOfConsent.includes("+")
                ) {
                    dateOfConsent += "Z";
                }
            }

            return {
                phoneNumber: formattedPhone,
                status: consentStatus,
                source: consentSource,
                dateOfConsent: dateOfConsent || new Date().toISOString(),
            };
        });

        addResult(
            `📋 Formatted phone numbers: ${contacts
                .map((c) => c.phoneNumber)
                .join(", ")}`
        );
        addResult(`📅 Date of consent: ${contacts[0].dateOfConsent}`);

        const result = await callSMSAPI("consent-management", { contacts });
        addResult(
            result.success
                ? `✅ Consent ${consentStatus} set for ${contacts.length} contacts`
                : `❌ Failed: ${result.error}`
        );

        // Enhanced logging for debugging
        addResult(`📋 Detailed Consent Management Response:`);
        if (result.results && Array.isArray(result.results)) {
            result.results.forEach(
                (
                    item: {
                        phoneNumber: string;
                        success: boolean;
                        errorCode?: number;
                        errorMessages?: string[];
                        status: string;
                        source: string;
                    },
                    index: number
                ) => {
                    addResult(`   Contact ${index + 1}:`);
                    addResult(`     Phone: ${item.phoneNumber}`);
                    addResult(`     Success: ${item.success}`);
                    addResult(`     Error Code: ${item.errorCode || "None"}`);
                    addResult(
                        `     Error Messages: ${JSON.stringify(
                            item.errorMessages || []
                        )}`
                    );
                    addResult(`     Status: ${item.status}`);
                    addResult(`     Source: ${item.source}`);
                }
            );
        }
        addResult(`📋 Raw Response: ${JSON.stringify(result, null, 2)}`);
        setIsRunning(false);
    };

    // Contact Management API test
    const testContactManagement = async () => {
        setIsRunning(true);
        addResult("📍 Updating contact zip codes...");

        if (bulkContactData.length === 0) {
            addResult("❌ No contact data provided");
            setIsRunning(false);
            return;
        }

        // Format phone numbers for E.164 format
        const contacts = bulkContactData.map((contact) => {
            let formattedPhone = contact.phoneNumber;
            // Add + if missing for E.164 format
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = `+${formattedPhone}`;
            }

            return {
                phoneNumber: formattedPhone,
                zipCode: contact.zipCode,
                countryIsoCode: contact.countryCode,
            };
        });

        addResult(
            `📍 Formatted contacts: ${contacts
                .map(
                    (c) =>
                        `${c.phoneNumber} -> ${c.zipCode}, ${c.countryIsoCode}`
                )
                .join("; ")}`
        );

        const result = await callSMSAPI("contact-zip-codes", { contacts });
        addResult(
            result.success
                ? `✅ Zip codes updated for ${contacts.length} contacts`
                : `❌ Failed: ${result.error}`
        );

        // Enhanced logging for debugging
        addResult(`📋 Detailed Contact Management Response:`);
        if (result.results && Array.isArray(result.results)) {
            result.results.forEach(
                (
                    item: {
                        phoneNumber: string;
                        success: boolean;
                        errorCode?: number;
                        errorMessages?: string[];
                        zipCode: string;
                        countryIsoCode: string;
                    },
                    index: number
                ) => {
                    addResult(`   Contact ${index + 1}:`);
                    addResult(`     Phone: ${item.phoneNumber}`);
                    addResult(`     Zip Code: ${item.zipCode}`);
                    addResult(`     Country: ${item.countryIsoCode}`);
                    addResult(`     Success: ${item.success}`);
                    addResult(`     Error Code: ${item.errorCode || "None"}`);
                    addResult(
                        `     Error Messages: ${JSON.stringify(
                            item.errorMessages || []
                        )}`
                    );
                }
            );
        }
        addResult(`📋 Raw Response: ${JSON.stringify(result, null, 2)}`);
        setIsRunning(false);
    };

    // Add contact to bulk list
    const addContactToBulk = () => {
        if (contactPhoneNumber && contactZipCode) {
            // Show what format we'll use
            let formattedPhone = contactPhoneNumber;
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = `+${formattedPhone}`;
            }

            setBulkContactData((prev) => [
                ...prev,
                {
                    phoneNumber: contactPhoneNumber, // Store original input
                    zipCode: contactZipCode,
                    countryCode: contactCountryCode,
                },
            ]);
            setContactPhoneNumber("");
            setContactZipCode("");
            addResult(
                `📍 Added contact: ${contactPhoneNumber} (will send as ${formattedPhone}) -> ${contactZipCode}, ${contactCountryCode}`
            );
        }
    };

    // Clear bulk contact list
    const clearBulkContacts = () => {
        setBulkContactData([]);
        addResult("🗑️ Cleared bulk contact list");
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
                            Phone Number:{" "}
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
                <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
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

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Left Column - Phone Input & SMS Options */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                PHONE NUMBER
                            </h2>
                            <input
                                type="password"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+1234567890"
                                className="twilio-text w-full px-4 py-3 border border-[#4D5777] rounded-lg focus:ring-2 focus:ring-[#FF1233] focus:border-transparent"
                            />
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                SMS OPTIONS
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="useRiskCheck"
                                        checked={useRiskCheck}
                                        onChange={(e) =>
                                            setUseRiskCheck(e.target.checked)
                                        }
                                        className="h-4 w-4 text-[#FF1233] focus:ring-[#FF1233] border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="useRiskCheck"
                                        className="ml-2 twilio-text text-sm text-[#000D25]"
                                    >
                                        Enable Risk Check
                                    </label>
                                </div>

                                {useRiskCheck && (
                                    <div className="pl-6 border-l-2 border-[#FF1233]">
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Risk Check:
                                        </label>
                                        <select
                                            value={riskCheck}
                                            onChange={(e) =>
                                                setRiskCheck(
                                                    e.target.value as
                                                        | "enable"
                                                        | "disable"
                                                )
                                            }
                                            className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                        >
                                            <option value="enable">
                                                Enable
                                            </option>
                                            <option value="disable">
                                                Disable
                                            </option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="useMessageIntent"
                                        checked={useMessageIntent}
                                        onChange={(e) =>
                                            setUseMessageIntent(
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-[#FF1233] focus:ring-[#FF1233] border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="useMessageIntent"
                                        className="ml-2 twilio-text text-sm text-[#000D25]"
                                    >
                                        Enable Message Intent
                                    </label>
                                </div>

                                {useMessageIntent && (
                                    <div className="pl-6 border-l-2 border-[#FF1233]">
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Message Intent:
                                        </label>
                                        <select
                                            value={messageIntent}
                                            onChange={(e) =>
                                                setMessageIntent(
                                                    e.target.value as
                                                        | "otp"
                                                        | "notifications"
                                                        | "fraud"
                                                        | "security"
                                                        | "customercare"
                                                        | "delivery"
                                                        | "education"
                                                        | "events"
                                                        | "polling"
                                                        | "announcements"
                                                        | "marketing"
                                                )
                                            }
                                            className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                        >
                                            <option value="otp">OTP</option>
                                            <option value="notifications">
                                                Notifications
                                            </option>
                                            <option value="fraud">Fraud</option>
                                            <option value="security">
                                                Security
                                            </option>
                                            <option value="customercare">
                                                Customer Care
                                            </option>
                                            <option value="delivery">
                                                Delivery
                                            </option>
                                            <option value="education">
                                                Education
                                            </option>
                                            <option value="events">
                                                Events
                                            </option>
                                            <option value="polling">
                                                Polling
                                            </option>
                                            <option value="announcements">
                                                Announcements
                                            </option>
                                            <option value="marketing">
                                                Marketing
                                            </option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                INDIVIDUAL SMS TESTS
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={testMarketingMessage}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📈 Marketing Message
                                </button>
                                <button
                                    onClick={testWelcomeMessage}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    👋 Welcome Message
                                </button>
                                <button
                                    onClick={testCartAbandonment}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    🛒 Cart Abandonment
                                </button>
                                <button
                                    onClick={testOrderConfirmation}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📦 Order Confirmation
                                </button>
                                <button
                                    onClick={testShippingUpdate}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    🚚 Shipping Update
                                </button>
                                <button
                                    onClick={testPostPurchaseSurvey}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📊 Post-Purchase Survey
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Second Column - Sequences */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                SMS SEQUENCES
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={testWelcomeSequence}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-secondary w-full py-3 disabled:opacity-50"
                                >
                                    🚀 Welcome Sequence
                                </button>
                                <p className="twilio-text text-sm text-[#4D5777]">
                                    Welcome + Opt-in confirmation
                                </p>

                                <button
                                    onClick={testCartAbandonmentSequence}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-secondary w-full py-3 disabled:opacity-50"
                                >
                                    🛒 Cart Abandonment Sequence
                                </button>
                                <p className="twilio-text text-sm text-[#4D5777]">
                                    Immediate reminder + discount after delay
                                </p>

                                <button
                                    onClick={testOrderSequence}
                                    disabled={!phoneNumber || isRunning}
                                    className="btn-twilio-secondary w-full py-3 disabled:opacity-50"
                                >
                                    📦 Complete Order Sequence
                                </button>
                                <p className="twilio-text text-sm text-[#4D5777]">
                                    Confirmation → Processing → Shipped →
                                    Delivered → Survey
                                </p>

                                <button
                                    onClick={testFullDemo}
                                    disabled={!phoneNumber || isRunning}
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

                    {/* Third Column - Compliance Toolkit */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                CONSENT MANAGEMENT
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                        Phone Numbers (one per line):
                                    </label>
                                    <textarea
                                        value={consentPhoneNumbers}
                                        onChange={(e) =>
                                            setConsentPhoneNumbers(
                                                e.target.value
                                            )
                                        }
                                        placeholder={`+1234567890\n+1987654321\n+1555000123`}
                                        rows={4}
                                        className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Consent Status:
                                        </label>
                                        <select
                                            value={consentStatus}
                                            onChange={(e) =>
                                                setConsentStatus(
                                                    e.target.value as
                                                        | "opt-in"
                                                        | "opt-out"
                                                )
                                            }
                                            className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                        >
                                            <option value="opt-in">
                                                Opt-in
                                            </option>
                                            <option value="opt-out">
                                                Opt-out
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Source:
                                        </label>
                                        <select
                                            value={consentSource}
                                            onChange={(e) =>
                                                setConsentSource(
                                                    e.target.value as
                                                        | "website"
                                                        | "offline"
                                                        | "opt-in-message"
                                                        | "opt-out-message"
                                                        | "others"
                                                )
                                            }
                                            className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                        >
                                            <option value="website">
                                                Website
                                            </option>
                                            <option value="offline">
                                                Offline
                                            </option>
                                            <option value="opt-in-message">
                                                Opt-in Message
                                            </option>
                                            <option value="opt-out-message">
                                                Opt-out Message
                                            </option>
                                            <option value="others">
                                                Others
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                        Date of Consent (optional):
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={consentDate}
                                        onChange={(e) =>
                                            setConsentDate(e.target.value)
                                        }
                                        className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                    />
                                </div>

                                <button
                                    onClick={testConsentManagement}
                                    disabled={
                                        !consentPhoneNumbers.trim() || isRunning
                                    }
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📋 Set Consent Status
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl text-[#000D25] mb-4">
                                CONTACT MANAGEMENT
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Phone Number:
                                        </label>
                                        <input
                                            type="password"
                                            value={contactPhoneNumber}
                                            onChange={(e) =>
                                                setContactPhoneNumber(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="+1234567890"
                                            className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                        />
                                    </div>

                                    <div>
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Zip Code:
                                        </label>
                                        <input
                                            type="text"
                                            value={contactZipCode}
                                            onChange={(e) =>
                                                setContactZipCode(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="12345"
                                            className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                        />
                                    </div>

                                    <div>
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Country:
                                        </label>
                                        <input
                                            type="text"
                                            value={contactCountryCode}
                                            onChange={(e) =>
                                                setContactCountryCode(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="US"
                                            className="twilio-text w-full px-3 py-2 border border-[#4D5777] rounded focus:ring-2 focus:ring-[#FF1233]"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={addContactToBulk}
                                        disabled={
                                            !contactPhoneNumber ||
                                            !contactZipCode ||
                                            isRunning
                                        }
                                        className="btn-twilio-secondary flex-1 py-2 disabled:opacity-50"
                                    >
                                        ➕ Add to List
                                    </button>
                                    <button
                                        onClick={clearBulkContacts}
                                        disabled={
                                            bulkContactData.length === 0 ||
                                            isRunning
                                        }
                                        className="btn-twilio-secondary flex-1 py-2 disabled:opacity-50"
                                    >
                                        🗑️ Clear List
                                    </button>
                                </div>

                                {bulkContactData.length > 0 && (
                                    <div>
                                        <label className="twilio-text text-sm font-medium text-[#000D25] block mb-1">
                                            Contact List (
                                            {bulkContactData.length} contacts):
                                        </label>
                                        <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                                            {bulkContactData.map(
                                                (contact, index) => (
                                                    <div
                                                        key={index}
                                                        className="twilio-text text-sm text-[#4D5777]"
                                                    >
                                                        •••••••••• →{" "}
                                                        {contact.zipCode},{" "}
                                                        {contact.countryCode}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={testContactManagement}
                                    disabled={
                                        bulkContactData.length === 0 ||
                                        isRunning
                                    }
                                    className="btn-twilio-primary w-full py-3 disabled:opacity-50"
                                >
                                    📍 Update Contact Zip Codes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Fourth Column - Results Log */}
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
