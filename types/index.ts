export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    subcategory: string;
    brand: string;
    description: string;
    images: string[];
    sizes: string[];
    colors: string[];
    inStock: boolean;
    rating: number;
    reviewCount: number;
    tags: string[];
    featured: boolean;
}

export interface CartItem {
    product: Product;
    quantity: number;
    size: string;
    color: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: Address;
    preferences: {
        marketing: boolean;
        notifications: boolean;
    };
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    id: string;
    userId?: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shippingAddress: Address;
    billingAddress: Address;
    contactInfo: {
        email: string;
        phone?: string;
        firstName: string;
        lastName: string;
    };
    status: OrderStatus;
    trackingNumber?: string;
    createdAt: Date;
    estimatedDelivery?: Date;
}

export interface OrderStatus {
    status:
        | "processing"
        | "shipped"
        | "in-transit"
        | "out-for-delivery"
        | "delivered";
    message: string;
    timestamp: Date;
}

export interface SMSMessage {
    type:
        | "marketing"
        | "cart-abandonment"
        | "order-confirmation"
        | "shipping-update"
        | "delivery"
        | "survey";
    message: string;
    phoneNumber: string;
}

export interface Filter {
    category?: string;
    subcategory?: string;
    brand?: string;
    priceRange?: [number, number];
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
}
