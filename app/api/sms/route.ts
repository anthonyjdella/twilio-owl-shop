import { NextRequest, NextResponse } from "next/server";
import {
    sendMarketingMessage,
    sendWelcomeMessage,
    sendCartAbandonmentMessage,
    sendOrderConfirmation,
    sendShippingUpdate,
    sendPostPurchaseSurvey,
    sendTestOTP,
    setConsentOptInStatus,
    setBulkContactZipCodes,
    getTwilioStatus,
} from "@/lib/twilio-complete";

export async function POST(request: NextRequest) {
    try {
        const { action, phoneNumber, options, ...params } =
            await request.json();

        let result;

        switch (action) {
            case "marketing":
                if (!phoneNumber) {
                    return NextResponse.json(
                        { success: false, error: "Phone number is required" },
                        { status: 400 }
                    );
                }
                result = await sendMarketingMessage(phoneNumber, options);
                break;

            case "test-otp":
                if (!phoneNumber) {
                    return NextResponse.json(
                        { success: false, error: "Phone number is required" },
                        { status: 400 }
                    );
                }
                result = await sendTestOTP(phoneNumber);
                break;

            case "welcome":
                if (!phoneNumber) {
                    return NextResponse.json(
                        { success: false, error: "Phone number is required" },
                        { status: 400 }
                    );
                }
                result = await sendWelcomeMessage(
                    phoneNumber,
                    params.customerName || "Demo User"
                );
                break;

            case "cart-abandonment":
                if (!phoneNumber) {
                    return NextResponse.json(
                        { success: false, error: "Phone number is required" },
                        { status: 400 }
                    );
                }
                result = await sendCartAbandonmentMessage(
                    phoneNumber,
                    params.itemCount || 3,
                    params.cartTotal || 247.5
                );
                break;

            case "order-confirmation":
                if (!phoneNumber) {
                    return NextResponse.json(
                        { success: false, error: "Phone number is required" },
                        { status: 400 }
                    );
                }
                result = await sendOrderConfirmation(
                    phoneNumber,
                    params.orderNumber || `OWL${Date.now()}`,
                    params.orderTotal || 247.5
                );
                break;

            case "shipping-update":
                if (!phoneNumber) {
                    return NextResponse.json(
                        { success: false, error: "Phone number is required" },
                        { status: 400 }
                    );
                }
                result = await sendShippingUpdate(
                    phoneNumber,
                    params.orderNumber || `OWL${Date.now()}`,
                    params.status || "shipped",
                    params.trackingNumber || `TW${Date.now()}`
                );
                break;

            case "post-purchase-survey":
                if (!phoneNumber) {
                    return NextResponse.json(
                        { success: false, error: "Phone number is required" },
                        { status: 400 }
                    );
                }
                result = await sendPostPurchaseSurvey(
                    phoneNumber,
                    params.orderNumber || `OWL${Date.now()}`
                );
                break;

            case "consent-management":
                if (!params.contacts || !Array.isArray(params.contacts)) {
                    return NextResponse.json(
                        { success: false, error: "Contacts array is required" },
                        { status: 400 }
                    );
                }
                result = await setConsentOptInStatus(params.contacts);
                break;

            case "contact-zip-codes":
                if (!params.contacts || !Array.isArray(params.contacts)) {
                    return NextResponse.json(
                        { success: false, error: "Contacts array is required" },
                        { status: 400 }
                    );
                }
                result = await setBulkContactZipCodes(params.contacts);
                break;

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid action" },
                    { status: 400 }
                );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("SMS API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const status = getTwilioStatus();
        return NextResponse.json(status);
    } catch (error) {
        console.error("Status API Error:", error);
        return NextResponse.json(
            { configured: false, demo: true, error: "Unable to get status" },
            { status: 500 }
        );
    }
}
