# 🚀 5-Minute Configuration Tutorial

## Complete Demo Customization Made Easy

Transform your SMS demo in **under 5 minutes** with industry-specific templates.

---

## ⚡ Quick Start (1 Minute)

### Step 1: Choose Your Industry Template
```bash
# E-commerce/Retail
cp config/templates/ecommerce-config.ts config/my-config.ts

# Healthcare/Medical
cp config/templates/healthcare-config.ts config/my-config.ts

# SaaS/Technology (coming soon)
cp config/templates/saas-config.ts config/my-config.ts
```

### Step 2: Update Your Branding
Edit `config/my-config.ts`:

```typescript
export const myConfig: DemoConfig = {
  title: "MY COMPANY SMS DEMO",           // ← Change this
  brandName: "My Company",                // ← Change this
  brandColors: {
    primary: "#YOUR-COLOR",               // ← Your main color
    // ... rest stays the same initially
  },
  // ... everything else stays the same
};
```

### Step 3: Apply Configuration
In `app/dynamic-sms-demo/page.tsx`:

```typescript
// Change line 4 from:
import { defaultDemoConfig } from "@/config/demo-config";

// To:
import { myConfig as defaultDemoConfig } from "@/config/my-config";
```

### Step 4: Restart & Test
```bash
# Restart your dev server
npm run dev
```

**🎉 Done!** Your demo is now fully branded and industry-specific.

---

## 🎯 Industry Templates Overview

### 🛒 E-commerce Template
**Perfect for:** Online stores, retail, marketplaces

**Key Features:**
- Flash sale alerts
- Cart abandonment recovery  
- Order shipping updates
- Product carousels
- VIP customer campaigns
- Review requests

**Channels:** SMS, RCS, WhatsApp
**Colors:** Purple, green, professional grays

### 🏥 Healthcare Template  
**Perfect for:** Hospitals, clinics, medical practices

**Key Features:**
- Appointment reminders
- Lab result notifications
- Medication reminders
- Preventive care alerts
- Telehealth links
- HIPAA-compliant messaging

**Channels:** SMS, Voice (HIPAA-focused)
**Colors:** Medical blue, clean whites

### 💼 SaaS Template (Coming Soon)
**Perfect for:** Software companies, B2B platforms

**Key Features:**
- Trial expiration notices
- Feature announcements
- Onboarding sequences
- Usage alerts
- Billing reminders

---

## 🎨 Customization Examples

### Change Colors Only
```typescript
brandColors: {
  primary: "#FF6B35",    // Your brand orange
  secondary: "#2C3E50",  // Keep dark header
  accent: "#28A745",     // Keep green accent
  background: "#F8F9FA", // Keep light background
  text: "#6C757D"        // Keep readable text
}
```

### Change Company Info
```typescript
brandName: "TechCorp",
uiText: {
  sections: {
    phoneNumber: "CUSTOMER PHONE",
    messageTemplates: "TechCorp Messages",
    virtualPhone: "CUSTOMER PREVIEW"
  },
  virtualPhone: {
    contactInfo: "TechCorp Support",
    // ...
  }
}
```

### Add Custom Message
```typescript
messageTemplates: [
  // ... existing templates
  {
    id: "my-custom-message",
    title: "Custom Promotion",
    description: "Special campaign for VIP customers",
    emoji: "🎉",
    category: "marketing",
    messageContent: "Exclusive offer for {{customerName}} at {{brandName}}! Get {{discount}}% off with code {{promoCode}}",
    variables: { 
      customerName: "John",
      discount: "25",
      promoCode: "VIP25"
    },
    apiAction: "custom-promo",
    buttonText: "Send VIP Offer"
  }
]
```

---

## 🔧 Advanced Customization

### Enable/Disable Features
```typescript
features: {
  enableRichMessaging: true,        // Show rich content types
  enableVirtualPhone: true,         // Show phone preview
  enableChannelSelection: true,     // Show channel buttons
  availableChannels: ['sms', 'whatsapp'], // Only show these
  defaultChannel: 'sms',            // Start with SMS
  enableContentTypes: false,        // Hide content type options
}
```

### Customize Phone Appearance
```typescript
virtualPhone: {
  deviceName: "iPhone 15 Pro",
  carrierName: "My Company Mobile",
  contactName: "My Company Support",
  phoneNumber: "+1 (555) MY-BRAND",
  apps: [
    {
      id: "messages",
      name: "Messages",
      icon: "💬",
      backgroundColor: "#YOUR-COLOR"
    }
  ]
}
```

### Custom Journey Flow
```typescript
journeySteps: [
  {
    id: "welcome",
    title: "Welcome Series",
    description: "Onboard new customers",
    icon: "👋",
    messageIds: ["welcome", "setup-guide"]
  },
  {
    id: "engagement",
    title: "Engagement",
    description: "Keep customers active",
    icon: "🚀",
    messageIds: ["tips", "features"]
  }
]
```

---

## 🚀 Pro Tips

### 1. Start Simple, Iterate
- Begin with just title, brandName, and colors
- Test your changes immediately
- Add more customization gradually

### 2. Use Industry Templates
- Don't start from scratch
- Industry templates are pre-optimized
- They include relevant message types

### 3. Test Thoroughly  
- Verify all message templates work
- Check different channels (SMS, WhatsApp, etc.)
- Test the customer journey flow

### 4. Environment Variables
```bash
# .env.local - for real Twilio integration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
```

### 5. Keep Configs Organized
```
config/
├── demo-config.ts          # Default config
├── my-company-config.ts     # Your customization
├── templates/
│   ├── ecommerce-config.ts  # E-commerce template
│   ├── healthcare-config.ts # Healthcare template
│   └── saas-config.ts       # SaaS template
```

---

## 🎯 Common Use Cases

### Demo for Sales Prospects
1. Copy their industry template
2. Change brandName to prospect's company
3. Update colors to match their brand
4. Show them their branded demo

### Conference/Trade Show
1. Use generic branding
2. Enable all channels and features
3. Focus on impressive visual demo
4. Have multiple industry configs ready

### Customer Onboarding
1. Use their exact branding
2. Customize message templates for their use cases  
3. Set up their real Twilio credentials
4. Train them on the configuration system

---

## 📋 Troubleshooting

### Demo Not Loading?
- Check your import statement in `page.tsx`
- Verify config file exports `myConfig`
- Restart dev server with `npm run dev`

### Colors Not Updating?
- Clear browser cache
- Check CSS custom properties in dev tools
- Verify hex color format (`#123456`)

### Messages Not Sending?
- Check `.env.local` for Twilio credentials
- Verify phone number format
- Look at browser console for errors

---

## 🔗 Quick Reference Links

- [Sample Config](config/sample-config.ts) - Complete example
- [E-commerce Template](config/templates/ecommerce-config.ts) - Retail-focused
- [Healthcare Template](config/templates/healthcare-config.ts) - Medical-focused  
- [Easy Config Guide](EASY-CONFIG-GUIDE.md) - Detailed customization
- [Voice Config](VOICE_CONFIG.md) - Voice channel setup

---

**Your fully customized demo is ready in under 5 minutes! 🚀**