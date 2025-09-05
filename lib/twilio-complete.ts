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

// Base SMS sending function
async function sendSMS(to: string, body: string) {
    try {
        if (!client) {
            // Demo mode - log message instead of sending
            console.log("📱 DEMO SMS TO:", to);
            console.log("📱 MESSAGE:", body);
            return { success: true, sid: `demo_${Date.now()}`, demo: true };
        }

        const message = await client.messages.create({
            body,
            from: twilioPhoneNumber,
            to,
        });

        console.log("✅ SMS sent successfully:", message.sid);
        return { success: true, sid: message.sid, demo: false };
    } catch (error) {
        console.error("❌ Failed to send SMS:", error);
        return { success: false, error, demo: false };
    }
}

// =============================================================================
// 1. MARKETING MESSAGES - Promotional campaigns and deals
// =============================================================================

export async function sendMarketingMessage(phoneNumber: string) {
    const message = `🚀 BUILD & SHIP FREE | Use code TWILIO5 for 5% off your dev setup at Owl Shop! Perfect timing for your next build. Shop now: owl-shop.dev Reply STOP to opt out.`;

    console.log("📈 Sending marketing message...");
    return await sendSMS(phoneNumber, message);
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

export async function triggerMarketingCampaign(phoneNumbers: string[]) {
    console.log(
        "📈 Starting marketing campaign for",
        phoneNumbers.length,
        "recipients..."
    );

    const results = [];
    for (const phoneNumber of phoneNumbers) {
        const result = await sendMarketingMessage(phoneNumber);
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
