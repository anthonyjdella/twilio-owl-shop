# 🚀 Easy Configuration Guide - Dynamic Demo Customization

This guide shows you how to completely customize the Dynamic SMS Demo with minimal effort. Everything is configurable through simple configuration files.

## 🎯 Quick Start - 3 Steps to Your Custom Demo

### Step 1: Copy the Configuration Template
```bash
# Copy the sample config and rename it for your brand
cp config/sample-config.ts config/my-company-config.ts
```

### Step 2: Update the Main Settings
Open `config/my-company-config.ts` and change these key values:

```typescript
export const myCompanyConfig: DemoConfig = {
  title: "MY COMPANY SMS DEMO",                    // Your demo title
  subtitle: "Showcase your messaging capabilities", // Demo description  
  brandName: "My Company",                         // Your company name
  
  brandColors: {
    primary: "#FF6B35",      // Your main brand color
    secondary: "#2C3E50",    // Dark color for headers
    accent: "#28A745",       // Accent color for highlights
    background: "#F8F9FA",   // Page background
    text: "#6C757D"         // Text color
  },
  
  // ... rest of config stays the same for now
};
```

### Step 3: Use Your Configuration
In `app/dynamic-sms-demo/page.tsx`, change the import:

```typescript
// Change from:
import { defaultDemoConfig } from "@/config/demo-config";

// To:
import { myCompanyConfig as defaultDemoConfig } from "@/config/my-company-config";
```

**That's it!** Your demo now uses your branding and company name everywhere.

---

## 🎨 Customization Options

### 📱 Brand Identity
```typescript
{
  title: "YOUR DEMO TITLE",
  subtitle: "Your custom description",
  brandName: "Your Company",
  brandColors: {
    primary: "#your-color",    // Main buttons, highlights
    secondary: "#your-color",  // Headers, titles
    accent: "#your-color",     // Secondary buttons
    background: "#your-color", // Page background
    text: "#your-color"        // Body text
  }
}
```

### 🔧 Feature Controls
```typescript
features: {
  enableRichMessaging: true,      // Show rich content types
  enableVirtualPhone: true,       // Show virtual phone
  enableConfigPanel: true,        // Show configuration panel
  enableJourneyFlow: true,        // Show customer journey
  enableChannelSelection: true,   // Show channel selector
  availableChannels: ['sms', 'rcs', 'whatsapp', 'voice'], // Which channels
  defaultChannel: 'sms',          // Default selected
  enableContentTypes: true,       // Show content type options
  availableContentTypes: ['text', 'richCard', 'carousel'] // Which types
}
```

### 💬 Custom Messages
```typescript
messageTemplates: [
  {
    id: "welcome",
    title: "Welcome New Customers",
    description: "Greeting for new signups",
    emoji: "👋",
    category: "marketing",
    messageContent: "Welcome to {{brandName}}! Your message here...",
    variables: { customerName: "Demo User" },
    apiAction: "welcome",
    buttonText: "Send Welcome"
  }
  // Add more templates...
]
```

### 🎯 Customer Journey
```typescript
journeySteps: [
  {
    id: "onboarding",
    title: "Onboarding",
    description: "New user welcome flow",
    icon: "🚀",
    messageIds: ["welcome", "setup-guide"]
  }
  // Add more steps...
]
```

### 📱 Virtual Phone
```typescript
virtualPhone: {
  deviceName: "iPhone 15 Pro",
  carrierName: "Your Company Mobile",
  signalStrength: 4,
  batteryLevel: 95,
  contactName: "Your Company",
  phoneNumber: "+1 (555) 123-4567"
}
```

---

## 📋 Complete Customization Examples

### Example 1: E-commerce Store
```typescript
export const ecommerceConfig: DemoConfig = {
  title: "SHOPIFY SMS MARKETING DEMO",
  subtitle: "Boost sales with personalized SMS campaigns",
  brandName: "ShopStyle",
  
  brandColors: {
    primary: "#7C3AED",    // Purple
    secondary: "#1F2937",  // Dark gray
    accent: "#10B981",     // Green
    background: "#F9FAFB", // Light gray
    text: "#6B7280"        // Medium gray
  },
  
  messageTemplates: [
    {
      id: "flash-sale",
      title: "Flash Sale Alert",
      description: "Limited time offers",
      emoji: "⚡",
      category: "marketing",
      messageContent: "🔥 FLASH SALE! 50% off everything at {{brandName}}! Only 2 hours left. Use code: FLASH50 → {{shopUrl}}",
      variables: { shopUrl: "https://shopstyle.com/sale" },
      apiAction: "flash-sale",
      buttonText: "Send Flash Sale"
    }
    // More e-commerce templates...
  ]
};
```

### Example 2: Healthcare Provider
```typescript
export const healthcareConfig: DemoConfig = {
  title: "HEALTHCARE SMS PLATFORM",
  subtitle: "Improve patient communication and care",
  brandName: "HealthCare Plus",
  
  brandColors: {
    primary: "#3B82F6",    // Medical blue
    secondary: "#1E40AF",  // Dark blue
    accent: "#059669",     // Medical green
    background: "#F8FAFC", // Clean white-blue
    text: "#475569"        // Professional gray
  },
  
  messageTemplates: [
    {
      id: "appointment-reminder",
      title: "Appointment Reminder", 
      description: "Reduce no-shows with reminders",
      emoji: "🏥",
      category: "notification",
      messageContent: "Reminder: Your appointment with Dr. {{doctorName}} at {{brandName}} is {{appointmentTime}}. Reply C to confirm or R to reschedule.",
      variables: {
        doctorName: "Smith",
        appointmentTime: "tomorrow at 2PM"
      },
      apiAction: "appointment-reminder",
      buttonText: "Send Reminder"
    }
    // More healthcare templates...
  ]
};
```

### Example 3: SaaS Platform
```typescript
export const saasConfig: DemoConfig = {
  title: "SAAS ENGAGEMENT PLATFORM",
  subtitle: "Drive user adoption with smart messaging",
  brandName: "TechFlow",
  
  brandColors: {
    primary: "#6366F1",    // Indigo
    secondary: "#1F2937",  // Dark
    accent: "#F59E0B",     // Orange
    background: "#F3F4F6", // Light gray
    text: "#4B5563"        // Dark gray
  },
  
  features: {
    availableChannels: ['sms', 'whatsapp'], // Only SMS and WhatsApp
    defaultChannel: 'sms',
    availableContentTypes: ['text', 'richCard'] // Simplified content types
  },
  
  messageTemplates: [
    {
      id: "trial-expiring",
      title: "Trial Expiring Soon",
      description: "Convert trial users to paid",
      emoji: "⏰",
      category: "transactional",
      messageContent: "Your {{brandName}} trial expires in 3 days! Upgrade now to keep all your data and unlock premium features: {{upgradeUrl}}",
      variables: { upgradeUrl: "https://techflow.com/upgrade" },
      apiAction: "trial-expiring",
      buttonText: "Send Trial Notice"
    }
    // More SaaS templates...
  ]
};
```

---

## 🎛️ Advanced Customization

### Custom UI Text
Change any text in the interface:
```typescript
uiText: {
  buttons: {
    completeJourney: "🚀 Start Demo Flow",
    clearResults: "🗑️ Clear Activity",
    editMessage: "✏️ Customize"
  },
  sections: {
    phoneNumber: "CUSTOMER PHONE",
    messageTemplates: "Message Library"
  }
}
```

### Layout Controls
```typescript
layout: {
  gridColumns: 3,           // Message cards per row
  showCategoryFilter: true, // Category filter buttons
  showTimestamps: true,     // Message timestamps
  compactMode: false        // Compact layout
}
```

### Voice Settings
```typescript
features: {
  voiceTemplateIds: [       // Which voice templates to show
    'appointment-reminder-voice',
    'delivery-notification-voice'
  ],
  phoneSettings: {
    defaultPhoneNumber: '+1 (555) 123-4567',
    enableRealCalls: true,  // Make real calls
    callAutoEndTime: undefined // Manual hang up
  }
}
```

---

## 🚀 Ready-Made Industry Templates

### Quick Deploy Options

**E-commerce**
```bash
cp config/templates/ecommerce-config.ts config/my-config.ts
```

**Healthcare** 
```bash
cp config/templates/healthcare-config.ts config/my-config.ts
```

**SaaS**
```bash
cp config/templates/saas-config.ts config/my-config.ts
```

**Real Estate**
```bash
cp config/templates/realestate-config.ts config/my-config.ts
```

---

## 🔧 Environment Setup

### Twilio Configuration (.env.local)
```bash
# For live SMS/Voice (optional - demo works without)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token  
TWILIO_PHONE_NUMBER=your_twilio_number

# Voice Settings
ENABLE_REAL_VOICE_CALLS=true  # Set to 'false' for demo only
```

---

## 🎯 One-Minute Setup Checklist

✅ **Copy config template**  
✅ **Update title, brandName, colors**  
✅ **Change import in page.tsx**  
✅ **Restart dev server**  
✅ **Your branded demo is ready!**

---

## 💡 Pro Tips

1. **Start Simple**: Change just title, brandName, and colors first
2. **Test Often**: Restart dev server after config changes
3. **Industry Templates**: Use pre-made templates for common industries  
4. **Brand Consistency**: Keep colors consistent across all sections
5. **Message Testing**: Use demo mode first, then add real Twilio credentials

---

## 🔗 Quick Links

- [Sample Config](config/sample-config.ts) - Complete example
- [Industry Templates](config/templates/) - Ready-made configs
- [Voice Config Guide](VOICE_CONFIG.md) - Voice channel setup
- [Message Templates](config/demo-config.ts#L643) - All available templates

Your demo will be completely customized and branded in under 5 minutes! 🚀