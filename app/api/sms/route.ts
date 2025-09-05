import { NextRequest, NextResponse } from "next/server";
import {
    sendMarketingMessage,
    sendWelcomeMessage,
    sendCartAbandonmentMessage,
    sendOrderConfirmation,
    sendShippingUpdate,
    sendPostPurchaseSurvey,
    getTwilioStatus,
} from "@/lib/twilio-complete";

export async function POST(request: NextRequest) {
    try {
        const { action, phoneNumber, ...params } = await request.json();

        if (!phoneNumber) {
            return NextResponse.json(
                { success: false, error: "Phone number is required" },
                { status: 400 }
            );
        }

        let result;

        switch (action) {
            case "marketing":
                result = await sendMarketingMessage(phoneNumber);
                break;

            case "welcome":
                result = await sendWelcomeMessage(
                    phoneNumber,
                    params.customerName || "Demo User"
                );
                break;

            case "cart-abandonment":
                result = await sendCartAbandonmentMessage(
                    phoneNumber,
                    params.itemCount || 3,
                    params.cartTotal || 247.5
                );
                break;

            case "order-confirmation":
                result = await sendOrderConfirmation(
                    phoneNumber,
                    params.orderNumber || `OWL${Date.now()}`,
                    params.orderTotal || 247.5
                );
                break;

            case "shipping-update":
                result = await sendShippingUpdate(
                    phoneNumber,
                    params.orderNumber || `OWL${Date.now()}`,
                    params.status || "shipped",
                    params.trackingNumber || `TW${Date.now()}`
                );
                break;

            case "post-purchase-survey":
                result = await sendPostPurchaseSurvey(
                    phoneNumber,
                    params.orderNumber || `OWL${Date.now()}`
                );
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
