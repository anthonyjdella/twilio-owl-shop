import { SMSMessage } from "../types";

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export const sendSMS = async (message: SMSMessage): Promise<boolean> => {
    try {
        // In a real app, you would use Twilio client here
        // For demo purposes, we'll just log the message
        console.log("SMS Message:", {
            to: message.phoneNumber,
            from: TWILIO_PHONE_NUMBER,
            body: message.message,
            type: message.type,
        });

        // Simulate sending delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return true;
    } catch (error) {
        console.error("Failed to send SMS:", error);
        return false;
    }
};

export const sendMarketingMessage = async (
    phoneNumber: string,
    customerName?: string
): Promise<boolean> => {
    const message: SMSMessage = {
        type: "marketing",
        phoneNumber,
        message: `Hi ${
            customerName || "there"
        }! 🦉 Exclusive 25% OFF at Owl Shop! Use code SAVE25 for premium clothing. Limited time only. Shop now: owl-shop.com`,
    };

    return sendSMS(message);
};

export const sendCartAbandonmentMessage = async (
    phoneNumber: string,
    itemCount: number
): Promise<boolean> => {
    const message: SMSMessage = {
        type: "cart-abandonment",
        phoneNumber,
        message: `Don't forget! You have ${itemCount} item${
            itemCount > 1 ? "s" : ""
        } waiting in your Owl Shop cart. Complete your purchase now and enjoy free shipping on orders over $100! 🛍️`,
    };

    return sendSMS(message);
};

export const sendOrderConfirmation = async (
    phoneNumber: string,
    orderNumber: string,
    total: number
): Promise<boolean> => {
    const message: SMSMessage = {
        type: "order-confirmation",
        phoneNumber,
        message: `Order confirmed! 🎉 Order #${orderNumber} for $${total.toFixed(
            2
        )} is being processed. You'll receive tracking info soon. Thank you for shopping with Owl Shop!`,
    };

    return sendSMS(message);
};

export const sendShippingUpdate = async (
    phoneNumber: string,
    orderNumber: string,
    status: string,
    trackingNumber?: string
): Promise<boolean> => {
    let messageText = `📦 Shipping Update: Order #${orderNumber} is now ${status}.`;

    if (trackingNumber) {
        messageText += ` Track your package: ${trackingNumber}`;
    }

    messageText += " - Owl Shop";

    const message: SMSMessage = {
        type: "shipping-update",
        phoneNumber,
        message: messageText,
    };

    return sendSMS(message);
};

export const sendDeliveryConfirmation = async (
    phoneNumber: string,
    orderNumber: string
): Promise<boolean> => {
    const message: SMSMessage = {
        type: "delivery",
        phoneNumber,
        message: `🎉 Delivered! Your Owl Shop order #${orderNumber} has been delivered. We hope you love your new items! Rate your experience: owl-shop.com/survey`,
    };

    return sendSMS(message);
};

export const sendSurveyRequest = async (
    phoneNumber: string,
    orderNumber: string
): Promise<boolean> => {
    const message: SMSMessage = {
        type: "survey",
        phoneNumber,
        message: `How was your Owl Shop experience? 🦉 Share your feedback about order #${orderNumber} and get 10% off your next purchase: owl-shop.com/survey/${orderNumber}`,
    };

    return sendSMS(message);
};

// Utility function to validate phone number format
export const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
};
