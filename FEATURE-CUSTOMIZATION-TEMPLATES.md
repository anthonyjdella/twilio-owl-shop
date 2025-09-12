# 🎛️ Feature Customization Templates

**Copy-paste templates for customizing demo features for specific customer needs**

## 📱 SMS Features

### **Order Confirmation Template**
```typescript
{
  id: "customer-order-confirmation",
  title: "Order Confirmation",
  description: "Instant order confirmation for customers",
  emoji: "📦",
  category: "transactional",
  channel: "sms",
  messageContent: "✅ Order confirmed! {{brandName}} Order #{{orderNumber}} for ${{orderTotal}} is being processed. Track: {{trackingUrl}}",
  variables: { 
    orderNumber: "ORD-2024-001", 
    orderTotal: "149.99",
    trackingUrl: "https://track.customer.com/ORD-2024-001"
  },
  buttonText: "Demo Order Confirmation",
  demoConfig: {
    mockBehavior: "Show order confirmation with tracking link",
    virtualPhoneEffect: "Display order details with clickable tracking",
    customMessage: "Order confirmed with all customer details",
    timeDelay: 1000,
    persistEffect: true
  }
}
```

### **Appointment Reminder Template**
```typescript
{
  id: "customer-appointment-reminder", 
  title: "Appointment Reminder",
  description: "Reduce no-shows with automated reminders",
  emoji: "📅",
  category: "notification",
  channel: "sms",
  messageContent: "🏥 Reminder: Your {{appointmentType}} with {{providerName}} is {{appointmentTime}}. Reply C to confirm, R to reschedule.",
  variables: {
    appointmentType: "consultation",
    providerName: "Dr. Smith", 
    appointmentTime: "tomorrow at 2:30 PM"
  },
  buttonText: "Send Appointment Reminder"
}
```

## 💬 RCS Rich Features

### **Product Carousel Template**
```typescript
{
  id: "customer-product-carousel",
  title: "Interactive Product Showcase", 
  description: "Scrollable product cards with buy buttons",
  emoji: "🎠",
  category: "rcs-features",
  channel: "rcs",
  demoConfig: {
    mockBehavior: "Display horizontal scrollable product cards",
    virtualPhoneEffect: "Show carousel with swipeable product cards and buy buttons",
    customMessage: "🛍️ Check out our featured products! Swipe to browse, tap to buy.",
    interactiveElements: {
      buttons: [
        { title: "Buy Now - $99", type: "reply", payload: "buy_product_1" },
        { title: "Learn More", type: "url", url: "https://customer.com/product1" },
        { title: "Add to Wishlist", type: "reply", payload: "wishlist_add" }
      ]
    }
  }
}
```

### **Customer Survey Template**
```typescript
{
  id: "customer-feedback-survey",
  title: "Quick Customer Survey",
  description: "Interactive feedback collection with buttons", 
  emoji: "📊",
  category: "rcs-features",
  channel: "rcs",
  messageContent: "📝 How was your experience with {{brandName}}? Your feedback helps us improve!",
  demoConfig: {
    interactiveElements: {
      quickReplies: [
        { title: "⭐⭐⭐⭐⭐ Excellent", payload: "rating_5" },
        { title: "⭐⭐⭐⭐ Good", payload: "rating_4" },
        { title: "⭐⭐⭐ Average", payload: "rating_3" },
        { title: "⭐⭐ Poor", payload: "rating_2" },
        { title: "⭐ Very Poor", payload: "rating_1" }
      ]
    }
  }
}
```

## 📞 WhatsApp Business Features

### **Customer Support Template**
```typescript
{
  id: "customer-whatsapp-support",
  title: "WhatsApp Customer Support",
  description: "Multi-option customer service menu",
  emoji: "🆘", 
  category: "whatsapp-features",
  channel: "whatsapp",
  messageContent: "👋 Hi! How can {{brandName}} help you today? Choose from the options below:",
  demoConfig: {
    interactiveElements: {
      buttons: [
        { title: "📞 Call Support", type: "phone", payload: "+1-800-CUSTOMER" },
        { title: "💬 Live Chat", type: "reply", payload: "start_chat" },
        { title: "📧 Email Us", type: "url", url: "mailto:support@customer.com" }
      ]
    }
  }
}
```

### **Order Status Template**
```typescript
{
  id: "customer-whatsapp-order-status",
  title: "Order Status Update",
  description: "Rich order tracking with media and buttons",
  emoji: "📦",
  category: "whatsapp-features", 
  channel: "whatsapp",
  messageContent: "📦 Your {{brandName}} order is on the way!",
  demoConfig: {
    mediaUrl: "https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=400",
    mediaType: "image",
    interactiveElements: {
      buttons: [
        { title: "🔍 Track Package", type: "url", url: "https://track.customer.com" },
        { title: "📞 Contact Driver", type: "phone", payload: "+1-555-DRIVER" },
        { title: "📅 Reschedule", type: "reply", payload: "reschedule_delivery" }
      ]
    }
  }
}
```

## 🎤 Voice Features

### **Customer Service IVR Template**
```typescript
{
  id: "customer-service-ivr",
  title: "Customer Service Menu",
  description: "Smart phone menu for customer inquiries",
  emoji: "📞",
  category: "voice-features",
  channel: "voice", 
  messageContent: "Thank you for calling {{brandName}}! For Sales, press 1. For Support, press 2. For Billing, press 3. For emergencies, press 0.",
  demoConfig: {
    voiceSettings: {
      voice: "alice",
      language: "en-US",
      speed: 0.9,
      pitch: 1.0
    },
    interactiveElements: {
      buttons: [
        { title: "Sales (Press 1)", type: "reply", payload: "transfer_sales" },
        { title: "Support (Press 2)", type: "reply", payload: "transfer_support" },
        { title: "Billing (Press 3)", type: "reply", payload: "transfer_billing" },
        { title: "Emergency (Press 0)", type: "reply", payload: "emergency_line" }
      ]
    }
  }
}
```

### **Appointment Confirmation Call Template**
```typescript
{
  id: "customer-appointment-call",
  title: "Voice Appointment Confirmation",
  description: "Automated appointment confirmation calls",
  emoji: "📅",
  category: "voice-features",
  channel: "voice",
  messageContent: "Hello! This is {{brandName}} calling to confirm your {{appointmentType}} scheduled for {{appointmentDate}} at {{appointmentTime}}. Press 1 to confirm, or press 2 to reschedule.",
  variables: {
    appointmentType: "consultation",
    appointmentDate: "Tuesday, March 15th", 
    appointmentTime: "2:30 PM"
  },
  demoConfig: {
    voiceSettings: {
      voice: "Polly.Joanna",
      language: "en-US",
      speed: 1.0,
      pitch: 1.0
    }
  }
}
```

## 🏭 Industry-Specific Templates

### **Healthcare: Lab Results**
```typescript
{
  id: "healthcare-lab-results",
  title: "Lab Results Notification", 
  description: "HIPAA-compliant test result alerts",
  emoji: "🧪",
  category: "transactional",
  channel: "sms",
  messageContent: "🏥 {{patientName}}, your lab results are ready. Please log into your patient portal or call {{clinicPhone}} to discuss with your provider.",
  variables: {
    patientName: "John D.",
    clinicPhone: "(555) 123-HEALTH"
  }
}
```

### **Financial: Transaction Alert**
```typescript
{
  id: "financial-transaction-alert",
  title: "Real-time Transaction Alert",
  description: "Instant fraud prevention notifications", 
  emoji: "💳",
  category: "authentication",
  channel: "sms", 
  messageContent: "🏦 {{bankName}} Alert: ${{amount}} {{transactionType}} at {{merchant}}. If this wasn't you, reply FRAUD or call {{fraudPhone}} immediately.",
  variables: {
    bankName: "Customer Bank",
    amount: "127.50",
    transactionType: "purchase",
    merchant: "Amazon.com",
    fraudPhone: "1-800-FRAUD-HELP"
  }
}
```

### **E-commerce: Cart Abandonment**
```typescript
{
  id: "ecommerce-cart-recovery",
  title: "Smart Cart Recovery",
  description: "Win back customers with personalized offers",
  emoji: "🛒",
  category: "marketing", 
  channel: "rcs",
  messageContent: "🛍️ Don't forget your {{itemCount}} items at {{brandName}}! Complete your order now and get {{discount}}% off. Total: ${{cartTotal}}",
  variables: {
    itemCount: 3,
    discount: 15,
    cartTotal: "234.50"
  },
  demoConfig: {
    interactiveElements: {
      buttons: [
        { title: "🛒 Complete Order", type: "url", url: "https://customer.com/cart" },
        { title: "💰 Apply Discount", type: "reply", payload: "apply_discount_15" },
        { title: "❌ Remove Items", type: "reply", payload: "clear_cart" }
      ]
    }
  }
}
```

### **SaaS: Feature Announcement**
```typescript
{
  id: "saas-feature-announcement", 
  title: "New Feature Launch",
  description: "Engage users with interactive feature demos",
  emoji: "🚀",
  category: "marketing",
  channel: "whatsapp",
  messageContent: "🎉 Exciting news! {{brandName}} just launched {{featureName}}. This new feature will {{featureBenefit}}.",
  variables: {
    featureName: "AI Analytics Dashboard", 
    featureBenefit: "save you 5+ hours per week on reporting"
  },
  demoConfig: {
    mediaUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    mediaType: "image",
    interactiveElements: {
      buttons: [
        { title: "🔍 Try It Now", type: "url", url: "https://app.customer.com/analytics" },
        { title: "📚 Learn More", type: "url", url: "https://customer.com/features/analytics" },
        { title: "📅 Book Demo", type: "reply", payload: "book_feature_demo" }
      ]
    }
  }
}
```

## 🎨 Virtual Phone Customization Templates

### **Professional Services Virtual Phone**
```typescript
virtualPhone: {
  deviceName: "iPhone 15 Pro",
  carrierName: "Professional Mobile",
  contactName: "Customer Success Team",
  phoneNumber: "+1 (555) CUSTOMER",
  messageTheme: "imessage" // or "business" for more professional look
}
```

### **Healthcare Virtual Phone**  
```typescript
virtualPhone: {
  deviceName: "Secure Health Device",
  carrierName: "HealthNet Secure", 
  contactName: "Patient Services",
  phoneNumber: "+1 (555) HEALTH-1"
}
```

### **E-commerce Virtual Phone**
```typescript
virtualPhone: {
  deviceName: "Customer Phone",
  carrierName: "Retail Mobile",
  contactName: "Customer Support", 
  phoneNumber: "+1 (555) SHOP-NOW"
}
```

## 🚀 Quick Copy-Paste Checklist

**For Sales Demos:**
- [ ] Copy customer's brand colors
- [ ] Update company name throughout
- [ ] Add customer's phone number format
- [ ] Enable features relevant to their industry
- [ ] Test complete customer journey
- [ ] Prepare 2-3 specific use case templates

**For Technical Demos:**
- [ ] Show API documentation links
- [ ] Demonstrate webhook functionality  
- [ ] Explain rate limits and scaling
- [ ] Show error handling examples
- [ ] Provide code samples

**For Executive Demos:**
- [ ] Focus on business outcomes
- [ ] Show ROI metrics and benefits
- [ ] Demonstrate multi-channel reach
- [ ] Highlight security and compliance
- [ ] Present scalability options

---

**💡 Pro Tip:** Mix and match these templates to create the perfect demo experience for your specific customer's needs and industry!