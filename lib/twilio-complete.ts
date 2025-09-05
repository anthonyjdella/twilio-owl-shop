import twilio from "twilio";

// =============================================================================
// TWILIO CONFIGURATION
// =============================================================================

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

// Initialize Twilio client (with demo fallback)
try {
    if (accountSid && authToken) {
        client = twilio(accountSid, authToken);
    }
} catch (error) {
    console.log("Twilio not configured - running in demo mode:", error);
}

// Types for optional SMS parameters
interface SMSOptions {
    riskCheck?: "enable" | "disable";
    messageIntent?:
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
        | "marketing";
}

// Base SMS sending function with optional parameters
async function sendSMS(to: string, body: string, options?: SMSOptions) {
    try {
        if (!client) {
            // Demo mode - log message with options
            console.log("📱 DEMO SMS TO:", to);
            console.log("📱 MESSAGE:", body);
            if (options) {
                console.log("📱 OPTIONS:", options);
            }
            return { success: true, sid: `demo_${Date.now()}`, demo: true };
        }

        const messageParams: {
            body: string;
            from: string | undefined;
            to: string;
            riskCheck?: "enable" | "disable";
            messageIntent?:
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
                | "marketing";
        } = {
            body,
            from: twilioPhoneNumber,
            to,
        };

        // Add optional parameters if provided
        if (options?.riskCheck) {
            messageParams.riskCheck = options.riskCheck;
        }
        if (options?.messageIntent) {
            messageParams.messageIntent = options.messageIntent;
        }

        // Log what we're sending to Twilio
        console.log(
            "📤 Sending to Twilio API:",
            JSON.stringify(messageParams, null, 2)
        );

        const message = await client.messages.create(messageParams);

        console.log("✅ SMS sent successfully:", message.sid);
        console.log("📱 Message Status:", message.status);
        console.log("📱 Scheduled At:", message.dateUpdated || "N/A");
        console.log(
            "📱 Full Twilio Response:",
            JSON.stringify(message, null, 2)
        );

        return {
            success: true,
            sid: message.sid,
            demo: false,
            twilioResponse: {
                accountSid: message.accountSid,
                sid: message.sid,
                dateSent: message.dateSent,
                dateCreated: message.dateCreated,
                dateUpdated: message.dateUpdated,
                direction: message.direction,
                from: message.from,
                to: message.to,
                body: message.body,
                status: message.status,
                messagingServiceSid: message.messagingServiceSid,
                numSegments: message.numSegments,
                numMedia: message.numMedia,
                price: message.price,
                priceUnit: message.priceUnit,
                uri: message.uri,
                subresourceUris: message.subresourceUris,
            },
        };
    } catch (error) {
        console.error("❌ Failed to send SMS:", error);
        console.error(
            "📱 Full SMS Error Details:",
            JSON.stringify(error, null, 2)
        );
        return { success: false, error, demo: false, errorDetails: error };
    }
}

// =============================================================================
// 1. MARKETING MESSAGES - Promotional campaigns and deals
// =============================================================================

export async function sendMarketingMessage(
    phoneNumber: string,
    options?: SMSOptions
) {
    const message = `🚀 BUILD & SHIP FREE | Use code TWILIO5 for 5% off your dev setup at Owl Shop! Perfect timing for your next build. Shop now: owl-shop.dev Reply STOP to opt out.`;

    console.log("📈 Sending marketing message...");
    const smsOptions = options || {
        messageIntent: "marketing",
        riskCheck: "enable",
    };
    return await sendSMS(phoneNumber, message, smsOptions);
}

// Test function for OTP (should be essential and allowed during quiet hours)
export async function sendTestOTP(phoneNumber: string) {
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const message = `Your Owl Shop verification code is: ${otpCode}. This code expires in 10 minutes. Do not share this code with anyone.`;

    console.log("🔐 Sending OTP (essential message)...");
    const smsOptions = {
        messageIntent: "otp" as const,
        riskCheck: "enable" as const,
    };
    return await sendSMS(phoneNumber, message, smsOptions);
}

export async function sendWelcomeMessage(
    phoneNumber: string,
    firstName: string = "Builder"
) {
    const message = `Welcome to Owl Shop, ${firstName}! 🦉✨ You're now part of the builder community. Get ready for exclusive dev deals, early access to new collections, and style tips for developers. Reply STOP to opt out.`;

    console.log("👋 Sending welcome message...");
    return await sendSMS(phoneNumber, message);
}

// =============================================================================
// 2. CART ABANDONMENT - Remind users about items left in cart (after 1 day)
// =============================================================================

export async function sendCartAbandonmentMessage(
    phoneNumber: string,
    cartItems: number,
    totalValue: number
) {
    const itemText = cartItems === 1 ? "item" : "items";
    const message = `🛒 Don't forget your ${cartItems} ${itemText} at Owl Shop! Your developer essentials (worth $${totalValue.toFixed(
        2
    )}) are waiting in your cart. Complete your build before other devs snag them! owl-shop.dev/cart Reply STOP to opt out.`;

    console.log("🛒 Sending cart abandonment reminder...");
    return await sendSMS(phoneNumber, message);
}

// =============================================================================
// 3. CHECKOUT CONFIRMATION - Order confirmation after purchase
// =============================================================================

export async function sendOrderConfirmation(
    phoneNumber: string,
    orderNumber: string,
    total: number,
    estimatedDelivery: string = "3-5 business days"
) {
    const message = `🎉 Order confirmed! Your Owl Shop build #${orderNumber} for $${total.toFixed(
        2
    )} is being prepared by our team. Expected delivery: ${estimatedDelivery}. Track your order: owl-shop.dev/orders/${orderNumber} Reply STOP to opt out.`;

    console.log("📦 Sending order confirmation...");
    return await sendSMS(phoneNumber, message);
}

export async function sendPaymentConfirmation(
    phoneNumber: string,
    orderNumber: string,
    paymentMethod: string
) {
    const message = `💳 Payment processed successfully! Your order #${orderNumber} has been charged to your ${paymentMethod}. Our builder team is now assembling your developer essentials. Thanks for choosing Owl Shop! Reply STOP to opt out.`;

    console.log("💳 Sending payment confirmation...");
    return await sendSMS(phoneNumber, message);
}

// =============================================================================
// 4. PACKAGE TRACKING - Shipping and delivery updates
// =============================================================================

export async function sendShippingUpdate(
    phoneNumber: string,
    orderNumber: string,
    status: "shipped" | "out_for_delivery" | "delivered",
    trackingNumber?: string
) {
    const statusMessages = {
        shipped: `📦 Your developer gear has shipped! Order #${orderNumber} is en route${
            trackingNumber ? ` (Tracking: ${trackingNumber})` : ""
        }. Track your package: owl-shop.dev/track/${orderNumber}`,
        out_for_delivery: `🚚 Out for delivery! Your Owl Shop order #${orderNumber} is on the truck and will arrive today. Time to prep your workspace for some fresh dev style! 🔥`,
        delivered: `✅ Delivered! Your Owl Shop order #${orderNumber} has arrived. Time to code in style! Don't forget to share your developer fit on social 📸 #BuiltWithOwlShop`,
    };

    const message = statusMessages[status] + ` Reply STOP to opt out.`;

    console.log(`🚚 Sending ${status} update...`);
    return await sendSMS(phoneNumber, message);
}

// =============================================================================
// 5. POST-PURCHASE SURVEY - Customer feedback collection
// =============================================================================

export async function sendPostPurchaseSurvey(
    phoneNumber: string,
    orderNumber: string
) {
    const message = `📊 How was your Owl Shop experience? Help us improve by rating your order #${orderNumber}! Quick 2-minute survey with a 15% discount TWILIO15: owl-shop.dev/survey/${orderNumber} Your feedback shapes our developer community! Reply STOP to opt out.`;

    console.log("📊 Sending post-purchase survey...");
    return await sendSMS(phoneNumber, message);
}

// =============================================================================
// 6. COMPLIANCE & UTILITY FUNCTIONS
// =============================================================================

export async function sendOptOutConfirmation(phoneNumber: string) {
    const message = `✋ You've been unsubscribed from Owl Shop marketing SMS. You'll no longer receive promotional messages but may still get order-related updates. Thanks for being part of our builder community!`;

    console.log("✋ Sending opt-out confirmation...");
    return await sendSMS(phoneNumber, message);
}

// =============================================================================
// 7. AUTOMATION SEQUENCES - Functions to trigger SMS sequences in correct order
// =============================================================================

export async function triggerWelcomeSequence(
    phoneNumber: string,
    firstName: string
) {
    console.log("🚀 Starting welcome sequence for:", firstName);

    // Step 1: Welcome message only
    await sendWelcomeMessage(phoneNumber, firstName);

    return { success: true, message: "Welcome sequence initiated" };
}

export async function triggerCartAbandonmentSequence(
    phoneNumber: string,
    cartItems: number,
    totalValue: number
) {
    console.log("🛒 Starting cart abandonment sequence...");

    // Single cart abandonment reminder
    await sendCartAbandonmentMessage(phoneNumber, cartItems, totalValue);

    return { success: true, message: "Cart abandonment sequence initiated" };
}

export async function triggerOrderSequence(
    phoneNumber: string,
    orderNumber: string,
    total: number
) {
    console.log("📦 Starting complete order sequence...");

    // Step 1: Immediate order confirmation
    await sendOrderConfirmation(phoneNumber, orderNumber, total);

    // Step 2: Payment confirmation (2 seconds later)
    setTimeout(async () => {
        await sendPaymentConfirmation(phoneNumber, orderNumber, "credit card");
    }, 2000);

    // Step 3: Shipped notification (10 seconds)
    setTimeout(async () => {
        await sendShippingUpdate(
            phoneNumber,
            orderNumber,
            "shipped",
            "TW1234567890"
        );
    }, 10000);

    // Step 4: Out for delivery (20 seconds)
    setTimeout(async () => {
        await sendShippingUpdate(phoneNumber, orderNumber, "out_for_delivery");
    }, 20000);

    // Step 5: Delivered (30 seconds)
    setTimeout(async () => {
        await sendShippingUpdate(phoneNumber, orderNumber, "delivered");
    }, 30000);

    // Step 6: Post-purchase survey (40 seconds)
    setTimeout(async () => {
        await sendPostPurchaseSurvey(phoneNumber, orderNumber);
    }, 40000);

    return { success: true, message: "Complete order sequence initiated" };
}

export async function triggerMarketingCampaign(
    phoneNumbers: string[],
    options?: SMSOptions
) {
    console.log(
        "📈 Starting marketing campaign for",
        phoneNumbers.length,
        "recipients..."
    );

    const results = [];
    for (const phoneNumber of phoneNumbers) {
        const result = await sendMarketingMessage(phoneNumber, options);
        results.push({ phoneNumber, success: result.success });

        // Add 1 second delay between messages to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
        success: true,
        results,
        message: `Marketing campaign sent to ${phoneNumbers.length} recipients`,
    };
}

// =============================================================================
// 8. DEMO FUNCTIONS - For testing the complete user journey
// =============================================================================

export async function runFullDemoSequence(phoneNumber: string) {
    console.log("🎭 Running complete Owl Shop SMS demo sequence...");

    try {
        // Step 1: Welcome sequence (new user signs up) - now just welcome message
        await triggerWelcomeSequence(phoneNumber, "Demo User");
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Step 2: Marketing message (promotional campaign)
        await sendMarketingMessage(phoneNumber);
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Step 3: Cart abandonment sequence (user adds items but doesn't checkout) - now just single reminder
        await triggerCartAbandonmentSequence(phoneNumber, 3, 247.5);
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Step 4: Complete order sequence (user finally purchases) - reduced message count
        await triggerOrderSequence(phoneNumber, "OWL" + Date.now(), 247.5);

        console.log(
            "✅ Complete demo sequence initiated! Check your phone for the streamlined journey."
        );
        return {
            success: true,
            message: "Complete demo sequence initiated successfully",
        };
    } catch (error) {
        console.error("❌ Demo sequence failed:", error);
        return { success: false, error, message: "Demo sequence failed" };
    }
}

// =============================================================================
// 9. UTILITY FUNCTIONS
// =============================================================================

export function getTwilioStatus() {
    return {
        configured: !!client,
        demo: !client,
        accountSid: accountSid ? `${accountSid.substring(0, 8)}...` : "Not set",
        phoneNumber: twilioPhoneNumber || "Not set",
    };
}

// Schedule cart abandonment check (would be called by a cron job in production)
export function scheduleCartAbandonmentCheck() {
    // In a real app, this would check for carts abandoned for 1+ days
    console.log(
        "📅 Cart abandonment check scheduled (would run daily in production)"
    );
}

// =============================================================================
// 10. COMPLIANCE TOOLKIT FUNCTIONS
// =============================================================================

// Consent Management API - Set opt-in status for bulk contacts
export async function setConsentOptInStatus(
    contacts: Array<{
        phoneNumber: string;
        status: "opt-in" | "opt-out";
        source?:
            | "website"
            | "offline"
            | "opt-in-message"
            | "opt-out-message"
            | "others";
        senderId?: string;
        dateOfConsent?: string;
    }>
) {
    try {
        if (!client || !accountSid) {
            console.log("📋 DEMO CONSENT MANAGEMENT:");
            console.log(`Setting consent for ${contacts.length} contacts:`);
            contacts.forEach((contact) =>
                console.log(
                    `  ${contact.phoneNumber}: ${contact.status} (${
                        contact.source || "website"
                    })`
                )
            );
            return {
                success: true,
                demo: true,
                message: `Demo: Consent set for ${contacts.length} contacts`,
                results: contacts.map((contact) => ({
                    phoneNumber: contact.phoneNumber,
                    success: true,
                    status: contact.status,
                    source: contact.source || "website",
                })),
            };
        }

        // Prepare items for Twilio Consent Management API
        const items = contacts.map((contact) => {
            // Use fixed correlation ID as requested
            const correlationId = "17103b6854254db587c11168d265dfcd";
            // Ensure phone number is in E.164 format
            let formattedPhone = contact.phoneNumber;
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = `+${formattedPhone}`;
            }

            // Ensure date is in proper ISO format with seconds
            let dateOfConsent = contact.dateOfConsent;
            if (dateOfConsent) {
                // If it's from datetime-local input, add seconds and timezone
                if (
                    dateOfConsent.includes("T") &&
                    !dateOfConsent.includes("Z") &&
                    !dateOfConsent.includes("+")
                ) {
                    // Add seconds if missing (datetime-local gives YYYY-MM-DDTHH:MM)
                    if (
                        dateOfConsent.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
                    ) {
                        dateOfConsent += ":00"; // Add seconds
                    }
                    dateOfConsent += "Z"; // Add UTC timezone
                }
                // Ensure the date is a valid ISO string
                const testDate = new Date(dateOfConsent);
                if (isNaN(testDate.getTime())) {
                    console.warn(
                        `Invalid date format: ${dateOfConsent}, using current timestamp`
                    );
                    dateOfConsent = new Date().toISOString();
                } else {
                    // Reconstruct to ensure proper format
                    dateOfConsent = testDate.toISOString();
                }
            } else {
                dateOfConsent = new Date().toISOString();
            }

            return {
                contact_id: formattedPhone,
                correlation_id: correlationId,
                sender_id: contact.senderId || twilioPhoneNumber,
                status: contact.status,
                source: contact.source || "website",
                date_of_consent: dateOfConsent,
            };
        });

        console.log(
            `📋 Creating bulk consents for ${contacts.length} contacts...`
        );
        console.log(
            "📋 Items being sent to Twilio:",
            JSON.stringify(items, null, 2)
        );

        // Call Twilio Consent Management API
        const bulkConsent = await client.accounts.v1.bulkConsents.create({
            items: items,
        });

        console.log(
            "📋 Raw Twilio Response:",
            JSON.stringify(bulkConsent, null, 2)
        );

        // Process results
        const results = bulkConsent.items.map(
            (
                item: {
                    correlation_id: string;
                    error_code: number;
                    error_messages: string[];
                },
                index: number
            ) => {
                const contact = contacts[index];
                return {
                    phoneNumber: contact.phoneNumber,
                    success: item.error_code === 0,
                    status: contact.status,
                    source: contact.source || "website",
                    correlationId: item.correlation_id,
                    errorCode: item.error_code,
                    errorMessages: item.error_messages || [],
                };
            }
        );

        const successCount = results.filter(
            (r: { success: boolean }) => r.success
        ).length;
        console.log(
            `✅ Consent management completed: ${successCount}/${contacts.length} successful`
        );

        return {
            success: true,
            demo: false,
            results,
            message: `Consent processed for ${successCount}/${contacts.length} contacts`,
        };
    } catch (error) {
        console.error("❌ Failed to manage consent:", error);
        return {
            success: false,
            error: String(error),
            message: "Consent management failed",
            results: [],
        };
    }
}

// Contacts API - Set zip code for bulk contacts using Twilio Contact API
export async function setBulkContactZipCodes(
    contacts: Array<{
        phoneNumber: string;
        zipCode: string;
        countryIsoCode?: string;
    }>
) {
    try {
        if (!client || !accountSid) {
            console.log("📍 DEMO CONTACTS API:");
            console.log(`Setting zip codes for ${contacts.length} contacts:`);
            contacts.forEach((contact) =>
                console.log(
                    `  ${contact.phoneNumber}: ${contact.zipCode} (${
                        contact.countryIsoCode || "US"
                    })`
                )
            );
            return {
                success: true,
                demo: true,
                message: `Demo: Zip codes set for ${contacts.length} contacts`,
                results: contacts.map((contact) => ({
                    phoneNumber: contact.phoneNumber,
                    zipCode: contact.zipCode,
                    countryIsoCode: contact.countryIsoCode || "US",
                    success: true,
                })),
            };
        }

        // Prepare items for Twilio Contact API
        const items = contacts.map((contact) => {
            const correlationId = "17103b6854254db587c11168d265dfcd";
            // Ensure phone number is in E.164 format
            let formattedPhone = contact.phoneNumber;
            if (!formattedPhone.startsWith("+")) {
                formattedPhone = `+${formattedPhone}`;
            }

            return {
                contact_id: formattedPhone,
                correlation_id: correlationId,
                country_iso_code: contact.countryIsoCode || "US",
                zip_code: contact.zipCode,
            };
        });

        console.log(
            `📍 Creating bulk contacts for ${contacts.length} contacts...`
        );
        console.log(
            "📍 Items being sent to Twilio:",
            JSON.stringify(items, null, 2)
        );

        // Call Twilio Contact API
        const bulkContact = await client.accounts.v1.bulkContacts.create({
            items: items,
        });

        console.log(
            "📍 Raw Twilio Response:",
            JSON.stringify(bulkContact, null, 2)
        );

        // Process results
        const results = bulkContact.items.map(
            (
                item: {
                    correlation_id: string;
                    error_code: number;
                    error_messages: string[];
                },
                index: number
            ) => {
                const contact = contacts[index];
                return {
                    phoneNumber: contact.phoneNumber,
                    zipCode: contact.zipCode,
                    countryIsoCode: contact.countryIsoCode || "US",
                    success: item.error_code === 0,
                    correlationId: item.correlation_id,
                    errorCode: item.error_code,
                    errorMessages: item.error_messages || [],
                };
            }
        );

        const successCount = results.filter(
            (r: { success: boolean }) => r.success
        ).length;
        console.log(
            `✅ Contact updates completed: ${successCount}/${contacts.length} successful`
        );

        return {
            success: true,
            demo: false,
            results,
            message: `Contact zip codes set for ${successCount}/${contacts.length} contacts`,
        };
    } catch (error) {
        console.error("❌ Failed to update contact zip codes:", error);
        return {
            success: false,
            error: String(error),
            message: "Contact zip code update failed",
            results: [],
        };
    }
}
