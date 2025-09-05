import { NextRequest, NextResponse } from "next/server";
import {
    triggerWelcomeSequence,
    triggerCartAbandonmentSequence,
    triggerOrderSequence,
    runFullDemoSequence,
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
            case "welcome-sequence":
                result = await triggerWelcomeSequence(
                    phoneNumber,
                    params.customerName || "Demo User"
                );
                break;

            case "cart-abandonment-sequence":
                result = await triggerCartAbandonmentSequence(
                    phoneNumber,
                    params.itemCount || 3,
                    params.cartTotal || 247.5
                );
                break;

            case "order-sequence":
                result = await triggerOrderSequence(
                    phoneNumber,
                    params.orderNumber || `OWL${Date.now()}`,
                    params.orderTotal || 247.5
                );
                break;

            case "full-demo":
                result = await runFullDemoSequence(phoneNumber);
                break;

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid sequence action" },
                    { status: 400 }
                );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("SMS Sequence API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
