# 🎭 Demo Customization Guide for Customer Showcases

**Perfect for Sales Teams, Solution Engineers, and Customer Success Teams**

This guide shows you how to quickly customize the Twilio Owl Shop demo for your customer presentations. Everything is configurable - no coding required!

## 🚀 Quick Start (5 Minutes)

### 1. **Basic Branding**
Edit `config/demo-config.ts` to match your customer's brand:

```typescript
// Change these values to match your customer
title: "ACME CORP SMS DEMO",
subtitle: "See how ACME Corp can engage customers with Twilio",
brandName: "ACME Corp",

brandColors: {
  primary: "#FF6B35",     // Your customer's primary color
  secondary: "#2D3748",   // Dark text color
  accent: "#4299E1",      // Accent color for highlights
  background: "#F7FAFC",  // Page background
  text: "#718096"         // Body text color
}
```

### 2. **Virtual Phone Customization**
Make the virtual phone look like your customer's brand:

```typescript
virtualPhone: {
  deviceName: "ACME Corp Phone",
  carrierName: "ACME Mobile",
  contactName: "ACME Customer Service",
  phoneNumber: "+1 (555) ACME-HELP"
}
```

## 📱 Virtual Phone Behavior Customization

### **Channel-Specific Appearances**
The virtual phone automatically changes based on the selected channel:

- **SMS**: Standard text messaging interface
- **RCS**: Rich messaging with business verification badges
- **WhatsApp**: WhatsApp Business interface with company profile
- **Voice**: Phone app with call interface and TTS visualization

### **Customize WhatsApp Business Profile**
Edit the WhatsApp profile to match your customer:

```typescript
whatsapp: {
  headerTitle: "ACME Corp Business",
  website: "acme-corp.com",
  email: "support@acme-corp.com",
  aboutDescription: "Welcome to ACME Corp! Your trusted business partner.",
}
```

## 🎯 Adding/Removing/Customizing Features

### **Adding a New Feature Card**
Add this to the `featureCards` array in `config/demo-config.ts`:

```typescript
{
  id: "custom-feature-demo",
  title: "Your Custom Feature",
  description: "Describe what this Twilio feature does for customers",
  emoji: "⚡",
  category: "sms-features", // or rcs-features, whatsapp-features, voice-features
  channel: "sms",
  
  // What happens when they click the demo button
  demoConfig: {
    mockBehavior: "Show what happens in the demo",
    virtualPhoneEffect: "What the customer sees on the virtual phone",
    customMessage: "The actual message content that appears",
    timeDelay: 1000, // milliseconds before effect shows
    persistEffect: true // whether the effect stays visible
  },
  
  // Technical details for your customer
  technicalDetails: {
    twilioFeature: "Official Twilio Feature Name",
    documentation: "https://www.twilio.com/docs/...",
    apiEndpoint: "/api/endpoint",
    requiredParams: ["param1", "param2"]
  },
  
  messageContent: "📨 This is the message customers will see",
  buttonText: "Demo This Feature",
  enabled: true
}
```

### **Removing Features**
Simply set `enabled: false` on any feature you don't want to show:

```typescript
{
  id: "feature-to-hide",
  // ... other config
  enabled: false  // This hides the feature card
}
```

### **Customizing Existing Features**
Click the **edit button (✏️)** on any feature card in the demo to customize:

- **Message content** - What text appears
- **Button text** - What the demo button says  
- **Demo behavior** - How the feature demonstrates
- **Voice settings** - Voice, language, speed for voice features
- **Interactive elements** - Buttons and quick replies
- **Media settings** - Images, videos, file types

## 💬 Message Templates for Customer Journeys

### **Customizing Message Templates**
Edit the `messageTemplates` array to match your customer's use cases:

```typescript
{
  id: "welcome-acme",
  title: "ACME Welcome Message",
  description: "Greet new ACME customers",
  emoji: "👋",
  category: "marketing",
  messageContent: "Welcome to {{brandName}}, {{customerName}}! 🎉 Your ACME account is ready.",
  variables: { customerName: "John Smith" },
  buttonText: "Send ACME Welcome"
}
```

### **Customer Journey Flow**
Customize the journey steps in `journeySteps`:

```typescript
journeySteps: [
  {
    id: "onboarding",
    title: "Customer Onboarding", 
    description: "Welcome new ACME customers",
    icon: "🎯",
    messageIds: ["welcome-acme", "setup-instructions"]
  }
]
```

## 🎨 UI Text Customization

### **Section Headers**
```typescript
uiText: {
  sections: {
    phoneNumber: "CUSTOMER PHONE NUMBER",
    demoActions: "DEMO SCENARIOS", 
    customerJourney: "ACME CUSTOMER EXPERIENCE",
    virtualPhone: "CUSTOMER'S PHONE PREVIEW"
  }
}
```

### **Button Labels**
```typescript
buttons: {
  completeJourney: "🚀 Run ACME Customer Journey",
  clearResults: "🗑️ Clear Demo Log"
}
```

## 📊 Industry-Specific Templates

### **E-commerce Example**
```bash
# Copy the e-commerce template
cp config/templates/ecommerce-config.ts config/my-demo-config.ts

# Use it in your demo
import { myDemoConfig } from './config/my-demo-config';
```

### **Healthcare Example**  
```bash
cp config/templates/healthcare-config.ts config/my-demo-config.ts
```

### **SaaS Example**
```bash
cp config/templates/saas-config.ts config/my-demo-config.ts
```

## 🎭 Demo Scenarios by Industry

### **Retail/E-commerce**
- Order confirmations
- Shipping updates  
- Cart abandonment recovery
- Product recommendations
- Customer support

### **Healthcare**
- Appointment reminders
- Test results notifications
- Prescription refill alerts
- Telehealth confirmations
- HIPAA-compliant messaging

### **Financial Services**
- Transaction alerts
- Account security notifications
- Payment reminders
- Investment updates
- Fraud prevention

### **SaaS/Technology**
- User onboarding sequences
- Feature announcements
- Usage limit notifications
- Billing reminders
- Support ticket updates

## 🎯 Demo Presentation Tips

### **Before Your Customer Demo**
1. **Set the phone number** to your customer's number (optional - works without)
2. **Choose the right channel** (SMS for basic, RCS/WhatsApp for rich features)
3. **Select relevant message templates** for their industry
4. **Test the journey flow** to ensure smooth presentation

### **During the Demo**
1. **Start with the customer journey** - click "Complete Customer Journey"
2. **Show individual features** relevant to their use case
3. **Let them see the virtual phone** responding in real-time
4. **Edit features live** to show customization capabilities
5. **Switch channels** to demonstrate multi-channel capabilities

### **Key Demo Points**
- ✅ **Real-time delivery tracking** - Show message status progression
- ✅ **Rich media support** - Images, videos, interactive cards  
- ✅ **Multi-channel** - SMS, RCS, WhatsApp, Voice in one platform
- ✅ **Business verification** - Verified sender profiles and trust indicators
- ✅ **Interactive elements** - Buttons, quick replies, carousels
- ✅ **Voice capabilities** - Text-to-speech, IVR systems, call recording

## 🚨 Common Demo Scenarios

### **"Show me SMS for order confirmations"**
1. Select SMS channel
2. Click "Order Confirm" message template
3. Show delivery tracking feature
4. Demonstrate the virtual phone receiving the message

### **"How does WhatsApp Business work?"**
1. Switch to WhatsApp channel
2. Show interactive buttons feature
3. Demonstrate list messages for product catalogs
4. Show business verification in virtual phone

### **"Can you handle voice calls?"**
1. Select Voice channel  
2. Demo Text-to-Speech feature
3. Show IVR system capabilities
4. Watch virtual phone display call interface

### **"What about rich messaging?"**
1. Choose RCS channel
2. Demo rich carousel with product cards
3. Show suggested actions and quick replies
4. Display branded business profile

## 📞 Support & Questions

**Need help customizing for a specific customer?**
- Check the inline comments in `config/demo-config.ts`
- Reference the example templates in `config/templates/`
- All features are documented with Twilio docs links

**The demo is designed to be:**
- ✅ **Customer-ready** - Professional appearance out of the box
- ✅ **Highly customizable** - Brand colors, messages, features
- ✅ **No-code configuration** - Just edit config files
- ✅ **Real-time preview** - See changes immediately in virtual phone
- ✅ **Industry-flexible** - Templates for any vertical

---

*Happy demoing! Show your customers the power of Twilio's communication platform.* 🚀