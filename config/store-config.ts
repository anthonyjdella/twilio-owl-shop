// Store Configuration System
// Customize the entire Owl Shop e-commerce experience

export interface StoreConfig {
  // Store Branding
  storeName: string;
  storeTagline: string;
  storeDescription: string;
  
  // Brand Colors
  brandColors: {
    primary: string;      // Main brand color (buttons, links)
    secondary: string;    // Secondary elements
    accent: string;       // Highlights and CTAs
    background: string;   // Page backgrounds
    text: string;         // Body text
    muted: string;        // Subtle text
    success: string;      // Success messages
    error: string;        // Error messages
    warning: string;      // Warning messages
  };
  
  // Store Categories & Products
  categories: {
    id: string;
    name: string;
    description: string;
    image: string;
  }[];
  
  // Featured Products (homepage)
  featuredProducts: string[]; // Product IDs to feature
  
  // Homepage Content
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaUrl: string;
  };
  
  // Footer Content
  footer: {
    companyDescription: string;
    socialLinks: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
      linkedin?: string;
    };
    contactEmail: string;
    contactPhone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  
  // SMS Integration Settings
  smsSettings: {
    welcomeMessage: string;
    cartAbandonmentDelay: number; // minutes
    orderConfirmationMessage: string;
    shippingUpdateMessage: string;
    deliveryConfirmationMessage: string;
    postPurchaseSurveyMessage: string;
  };
  
  // Checkout & Payment
  checkout: {
    enableGuestCheckout: boolean;
    requirePhoneNumber: boolean;
    smsConsentText: string;
    shippingOptions: {
      id: string;
      name: string;
      price: number;
      estimatedDays: string;
    }[];
    taxRate: number; // 0.08 = 8%
  };
  
  // Promo Codes
  promoCodes: {
    code: string;
    description: string;
    type: 'percentage' | 'fixed';
    value: number; // percentage (0.10 = 10%) or fixed amount
    minOrderAmount?: number;
  }[];
  
  // Currency & Formatting
  currency: {
    code: string; // USD, EUR, GBP
    symbol: string; // $, €, £
    position: 'before' | 'after'; // $100 or 100$
  };
}

// Default Store Configuration
export const defaultStoreConfig: StoreConfig = {
  // Store Branding
  storeName: "Owl Shop",
  storeTagline: "Premium Developer Apparel",
  storeDescription: "High-quality clothing and accessories for the modern developer. Comfortable, stylish, and built for those who code.",
  
  // Brand Colors
  brandColors: {
    primary: "#FF1233",     // Owl Shop red
    secondary: "#000D25",   // Dark navy
    accent: "#081F47",      // Blue accent
    background: "#DDE0E6",  // Light gray
    text: "#4D5777",        // Medium gray text
    muted: "#9CA3AF",       // Muted text
    success: "#10B981",     // Green
    error: "#EF4444",       // Red
    warning: "#F59E0B"      // Orange
  },
  
  // Store Categories
  categories: [
    {
      id: "hoodies",
      name: "Hoodies & Sweatshirts",
      description: "Comfortable hoodies perfect for long coding sessions",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
    },
    {
      id: "tshirts", 
      name: "T-Shirts",
      description: "Soft, comfortable tees for everyday wear",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    },
    {
      id: "accessories",
      name: "Accessories", 
      description: "Mugs, stickers, and gear for developers",
      image: "https://images.unsplash.com/photo-1572313856066-c6c1f6b5d50e?w=400"
    }
  ],
  
  // Featured Products (show on homepage)
  featuredProducts: ["dev-hoodie", "comfort-tee", "code-mug", "laptop-stickers"],
  
  // Homepage Hero Section
  hero: {
    title: "Premium Developer Apparel",
    subtitle: "Comfortable, stylish clothing designed for those who build the future. Quality materials, modern fits, and designs that speak to your passion for code.",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    ctaText: "Shop Collection",
    ctaUrl: "/products"
  },
  
  // Footer Content
  footer: {
    companyDescription: "Owl Shop provides premium apparel and accessories for developers and tech professionals. Quality, comfort, and style for the modern coder.",
    socialLinks: {
      twitter: "https://twitter.com/owlshop",
      instagram: "https://instagram.com/owlshop", 
      facebook: "https://facebook.com/owlshop"
    },
    contactEmail: "hello@owlshop.com",
    contactPhone: "+1 (555) 123-OWLS",
    address: {
      street: "123 Developer Street",
      city: "San Francisco",
      state: "CA", 
      zip: "94105"
    }
  },
  
  // SMS Integration Settings
  smsSettings: {
    welcomeMessage: "Welcome to {{storeName}}! 🦉 Thanks for joining our community of developers. Reply STOP to opt out.",
    cartAbandonmentDelay: 60, // 1 hour
    orderConfirmationMessage: "Thanks for your order! 📦 Order #{{orderNumber}} confirmed for ${{total}}. Track: {{trackingUrl}}",
    shippingUpdateMessage: "📦 Your {{storeName}} order #{{orderNumber}} has shipped! Track: {{trackingNumber}} Expected: {{deliveryDate}}",
    deliveryConfirmationMessage: "🎉 Your {{storeName}} order has been delivered! How did we do? Rate your experience: {{surveyUrl}}",
    postPurchaseSurveyMessage: "How was your {{storeName}} experience? Rate us: ⭐⭐⭐⭐⭐ Reply 1-5 or visit {{surveyUrl}}"
  },
  
  // Checkout Settings
  checkout: {
    enableGuestCheckout: true,
    requirePhoneNumber: true,
    smsConsentText: "By providing your phone number, you consent to receive SMS updates about your order and occasional marketing messages from {{storeName}}. Reply STOP to opt out.",
    shippingOptions: [
      {
        id: "standard",
        name: "Standard Shipping",
        price: 0,
        estimatedDays: "5-7 business days"
      },
      {
        id: "express",
        name: "Express Shipping", 
        price: 15,
        estimatedDays: "2-3 business days"
      },
      {
        id: "overnight",
        name: "Overnight Delivery",
        price: 35,
        estimatedDays: "Next business day"
      }
    ],
    taxRate: 0.0875 // 8.75% tax rate
  },
  
  // Promo Codes
  promoCodes: [
    {
      code: "WELCOME10",
      description: "10% off your first order",
      type: "percentage",
      value: 0.10,
      minOrderAmount: 50
    },
    {
      code: "SAVE20", 
      description: "20% off orders over $100",
      type: "percentage",
      value: 0.20,
      minOrderAmount: 100
    },
    {
      code: "FREESHIP",
      description: "Free shipping on any order",
      type: "fixed",
      value: 15 // shipping cost to subtract
    },
    {
      code: "DEVELOPER25",
      description: "25% off for fellow developers",
      type: "percentage", 
      value: 0.25,
      minOrderAmount: 75
    }
  ],
  
  // Currency Settings
  currency: {
    code: "USD",
    symbol: "$", 
    position: "before"
  }
};

// Industry-Specific Store Templates

export const healthcareStoreConfig: Partial<StoreConfig> = {
  storeName: "MedWear Pro",
  storeTagline: "Professional Medical Apparel",
  storeDescription: "High-quality scrubs, lab coats, and medical accessories for healthcare professionals.",
  
  brandColors: {
    primary: "#059669",     // Medical green
    secondary: "#1F2937",   // Dark gray
    accent: "#3B82F6",      // Blue
    background: "#F9FAFB",  // Very light gray
    text: "#374151",        // Dark gray text
    muted: "#9CA3AF",
    success: "#10B981",
    error: "#EF4444", 
    warning: "#F59E0B"
  },
  
  categories: [
    {
      id: "scrubs",
      name: "Scrubs",
      description: "Comfortable, professional scrubs for all-day wear",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400"
    },
    {
      id: "lab-coats",
      name: "Lab Coats", 
      description: "Professional lab coats for medical professionals",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400"
    }
  ],
  
  hero: {
    title: "Professional Medical Apparel",
    subtitle: "Comfortable, durable clothing designed for healthcare heroes. Quality materials that meet the demands of your important work.",
    backgroundImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200",
    ctaText: "Shop Medical Wear",
    ctaUrl: "/products"
  }
};

export const fitnessStoreConfig: Partial<StoreConfig> = {
  storeName: "FitGear Pro",
  storeTagline: "Premium Athletic Wear",
  storeDescription: "High-performance activewear and fitness gear for athletes and fitness enthusiasts.",
  
  brandColors: {
    primary: "#DC2626",     // Red
    secondary: "#1F2937",   // Dark
    accent: "#F59E0B",      // Orange
    background: "#F9FAFB",  // Light gray
    text: "#374151",        // Dark text
    muted: "#9CA3AF",
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B"
  },
  
  categories: [
    {
      id: "activewear",
      name: "Activewear",
      description: "Performance clothing for workouts and training",
      image: "https://images.unsplash.com/photo-1544966503-7e532419e5a8?w=400"
    },
    {
      id: "equipment",
      name: "Equipment",
      description: "Quality fitness equipment and accessories", 
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
    }
  ],
  
  hero: {
    title: "Premium Athletic Wear",
    subtitle: "High-performance gear that moves with you. Designed for athletes who demand the best from their equipment and apparel.",
    backgroundImage: "https://images.unsplash.com/photo-1544966503-7e532419e5a8?w=1200",
    ctaText: "Shop Athletic Wear",
    ctaUrl: "/products"
  }
};

// Configuration loader with override support
export function loadStoreConfig(overrides?: Partial<StoreConfig>): StoreConfig {
  return {
    ...defaultStoreConfig,
    ...overrides
  };
}

// Utility functions
export function formatCurrency(amount: number, config: StoreConfig): string {
  const { symbol, position } = config.currency;
  const formatted = amount.toFixed(2);
  return position === 'before' ? `${symbol}${formatted}` : `${formatted}${symbol}`;
}

export function calculateTax(subtotal: number, config: StoreConfig): number {
  return subtotal * config.checkout.taxRate;
}

export function findPromoCode(code: string, config: StoreConfig) {
  return config.promoCodes.find(promo => promo.code.toLowerCase() === code.toLowerCase());
}

export function processMessageTemplate(template: string, variables: Record<string, string | number>): string {
  let message = template;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regex, String(value));
  });
  return message;
}