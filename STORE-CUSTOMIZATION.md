# 🛍️ Store Customization Guide

**Transform Owl Shop into any e-commerce business for customer demos**

## 🚀 Quick Store Rebrand (5 Minutes)

Edit `config/store-config.ts` to completely transform the store:

```typescript
// Change these core values to rebrand instantly
storeName: "ACME Store",
storeTagline: "Premium ACME Products", 
storeDescription: "High-quality products for ACME customers.",

// Apply customer's brand colors
brandColors: {
  primary: "#FF6B35",     // Customer's main color
  secondary: "#2D3748",   // Dark elements
  accent: "#4299E1",      // Highlights
  background: "#F7FAFC",  // Page background
  text: "#4D5777"         // Body text
}
```

## 🎨 Complete Store Transformation

### **Store Branding**
```typescript
// Basic store identity
storeName: "Customer Store Name",
storeTagline: "Your Store Tagline",
storeDescription: "Description of what your store sells and why customers should choose you.",

// Homepage hero section
hero: {
  title: "Your Store's Main Message",
  subtitle: "Compelling description that converts visitors to customers",
  backgroundImage: "https://your-hero-image.jpg",
  ctaText: "Shop Now",
  ctaUrl: "/products"
}
```

### **Brand Colors** 
```typescript
brandColors: {
  primary: "#YOUR_BRAND_COLOR",    // Buttons, links, CTAs
  secondary: "#DARK_COLOR",        // Headers, navigation
  accent: "#HIGHLIGHT_COLOR",      // Special elements
  background: "#PAGE_BG_COLOR",    // Page backgrounds
  text: "#TEXT_COLOR",             // Body text
  muted: "#SUBTLE_TEXT_COLOR",     // Less important text
  success: "#GREEN_COLOR",         // Success messages
  error: "#RED_COLOR",             // Error messages
  warning: "#ORANGE_COLOR"         // Warning messages
}
```

### **Product Categories**
```typescript
categories: [
  {
    id: "category-1",
    name: "Your Category Name",
    description: "What this category includes",
    image: "https://category-image.jpg"
  },
  {
    id: "category-2", 
    name: "Another Category",
    description: "Description of products in this category",
    image: "https://another-category-image.jpg"
  }
]
```

## 📞 SMS Message Customization

### **Automated SMS Messages**
```typescript
smsSettings: {
  welcomeMessage: "Welcome to {{storeName}}! 🎉 Thanks for joining. Reply STOP to opt out.",
  
  cartAbandonmentDelay: 60, // minutes before sending reminder
  
  orderConfirmationMessage: "Order confirmed! 📦 #{{orderNumber}} for ${{total}}. Track: {{trackingUrl}}",
  
  shippingUpdateMessage: "📦 Your order #{{orderNumber}} has shipped! Track: {{trackingNumber}}",
  
  deliveryConfirmationMessage: "🎉 Your order has been delivered! Rate us: {{surveyUrl}}",
  
  postPurchaseSurveyMessage: "How was your experience? ⭐⭐⭐⭐⭐ Reply 1-5"
}
```

### **SMS Variables Available**
- `{{storeName}}` - Your store name
- `{{orderNumber}}` - Order ID
- `{{total}}` - Order total amount
- `{{trackingUrl}}` - Package tracking link
- `{{trackingNumber}}` - Carrier tracking number
- `{{deliveryDate}}` - Expected delivery date
- `{{surveyUrl}}` - Feedback survey link
- `{{customerName}}` - Customer's name

## 🛒 Checkout & Payment Settings

### **Checkout Configuration**
```typescript
checkout: {
  enableGuestCheckout: true,           // Allow checkout without account
  requirePhoneNumber: true,            // Require phone for SMS updates
  smsConsentText: "By providing your phone number, you consent to receive SMS updates from {{storeName}}. Reply STOP to opt out.",
  
  // Shipping options
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
    }
  ],
  
  taxRate: 0.08 // 8% tax rate
}
```

### **Promo Codes**
```typescript
promoCodes: [
  {
    code: "WELCOME10",
    description: "10% off first order",
    type: "percentage",
    value: 0.10,
    minOrderAmount: 50
  },
  {
    code: "FREESHIP",
    description: "Free shipping",
    type: "fixed", 
    value: 15 // shipping cost to subtract
  }
]
```

## 🏢 Company Information

### **Footer & Contact Details**
```typescript
footer: {
  companyDescription: "Your company description and value proposition.",
  
  socialLinks: {
    twitter: "https://twitter.com/yourstore",
    instagram: "https://instagram.com/yourstore",
    facebook: "https://facebook.com/yourstore",
    linkedin: "https://linkedin.com/company/yourstore"
  },
  
  contactEmail: "support@yourstore.com",
  contactPhone: "+1 (555) YOUR-PHONE",
  
  address: {
    street: "123 Your Street",
    city: "Your City", 
    state: "ST",
    zip: "12345"
  }
}
```

## 🏭 Industry-Specific Templates

### **Healthcare Store**
```typescript
import { healthcareStoreConfig } from './store-config';

// Use healthcare template
const myStoreConfig = {
  ...defaultStoreConfig,
  ...healthcareStoreConfig,
  
  // Customize further
  storeName: "MediCorp Supplies",
  footer: {
    ...healthcareStoreConfig.footer,
    contactEmail: "orders@medicorp.com"
  }
}
```

### **Fitness Store**
```typescript
import { fitnessStoreConfig } from './store-config';

// Use fitness template
const myStoreConfig = {
  ...defaultStoreConfig,
  ...fitnessStoreConfig,
  
  // Customize for your customer
  storeName: "FitCorp Gear",
  storeTagline: "Professional Athletic Equipment"
}
```

### **Tech Store**
```typescript
const techStoreConfig = {
  storeName: "TechCorp Store", 
  storeTagline: "Professional Tech Gear",
  storeDescription: "High-quality tech accessories and gadgets for professionals.",
  
  brandColors: {
    primary: "#6366F1",     // Purple/blue
    secondary: "#1F2937",   // Dark
    accent: "#F59E0B",      // Orange
    background: "#F9FAFB",  // Light
    text: "#374151"         // Dark gray
  },
  
  categories: [
    {
      id: "laptops",
      name: "Laptops & Computers", 
      description: "Professional computing equipment",
      image: "https://tech-image.jpg"
    },
    {
      id: "accessories",
      name: "Tech Accessories",
      description: "Cables, stands, and productivity tools",
      image: "https://accessories-image.jpg"
    }
  ]
}
```

## 💰 Currency & Pricing

### **Currency Settings**
```typescript
currency: {
  code: "USD",              // USD, EUR, GBP, CAD, etc.
  symbol: "$",              // $, €, £, etc.
  position: "before"        // "before" ($100) or "after" (100$)
}
```

### **International Examples**
```typescript
// European store
currency: {
  code: "EUR",
  symbol: "€", 
  position: "after"
}

// UK store
currency: {
  code: "GBP",
  symbol: "£",
  position: "before"
}
```

## 🎯 Featured Products

### **Homepage Product Showcase**
```typescript
// Show specific products on homepage
featuredProducts: [
  "product-id-1",    // Must match actual product IDs
  "product-id-2", 
  "product-id-3",
  "product-id-4"
]
```

## 🚀 Quick Setup Examples

### **5-Minute Customer Demo Setup**
1. **Change store branding:**
   ```typescript
   storeName: "Customer Store Name"
   storeTagline: "Customer's value proposition"
   ```

2. **Apply customer colors:**
   ```typescript
   brandColors: { primary: "#CUSTOMER_COLOR" }
   ```

3. **Update contact info:**
   ```typescript
   footer: {
     contactEmail: "info@customer.com",
     contactPhone: "+1 (555) CUSTOMER"
   }
   ```

4. **Customize SMS messages:**
   ```typescript
   smsSettings: {
     welcomeMessage: "Welcome to Customer Store! ..."
   }
   ```

### **Industry-Specific Demo Setup**
1. **Copy industry template:**
   ```typescript
   import { healthcareStoreConfig } from './store-config';
   ```

2. **Merge with customer details:**
   ```typescript
   const customerConfig = {
     ...defaultStoreConfig,
     ...healthcareStoreConfig,
     storeName: "Customer Healthcare Supplies"
   }
   ```

3. **Apply to your demo**

## 🎨 Visual Customization Tips

### **Color Psychology by Industry**
- **Healthcare**: Green (#059669) - trust, health, safety
- **Finance**: Blue (#1E40AF) - stability, trust, professional  
- **Fitness**: Red (#DC2626) - energy, passion, strength
- **Tech**: Purple (#6366F1) - innovation, creativity, modern
- **Luxury**: Black (#1F2937) - elegance, premium, sophisticated

### **Image Guidelines**
- **Hero images**: 1200x600px minimum, high quality
- **Category images**: 400x400px, consistent style
- **Product images**: 800x800px, white/clean background

### **Typography & Messaging**
- **Store tagline**: 3-5 words, memorable, benefit-focused
- **Descriptions**: Clear, concise, benefit-oriented
- **SMS messages**: Under 160 characters, include brand name

## 🛠️ Implementation

### **Using Custom Store Config**
1. **Create your config:**
   ```typescript
   // config/my-store-config.ts
   import { defaultStoreConfig } from './store-config';
   
   export const myStoreConfig = {
     ...defaultStoreConfig,
     storeName: "My Custom Store",
     // ... your customizations
   };
   ```

2. **Apply to your app:**
   ```typescript
   // In your components
   import { myStoreConfig } from '@/config/my-store-config';
   
   // Use throughout your app
   const storeName = myStoreConfig.storeName;
   ```

## 🎯 Demo Best Practices

### **For Customer Presentations**
- Use customer's actual brand colors and fonts
- Replace lorem ipsum with their industry terminology
- Show relevant product categories for their business
- Use their contact information in footer/checkout

### **For Different Audiences**
- **Executives**: Focus on brand consistency, customer experience
- **Marketing**: Show SMS automation, customer journey touchpoints  
- **Developers**: Demonstrate configuration flexibility, API integration
- **Operations**: Highlight inventory, shipping, tax configuration

---

**🎉 With store customization, you can transform Owl Shop into any e-commerce business for compelling customer demos!**