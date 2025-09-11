# Configuration Guide

## What Can You Customize?

The dynamic SMS demo is **fully configurable** - you can customize everything without touching any code:

## 🎨 Visual & Branding
- **Colors**: Change all colors (primary, secondary, accent, background, text)
- **Text**: Customize all button labels, section titles, and UI text
- **Layout**: Switch between grid layouts, card styles, and arrangements
- **Branding**: Update company name, demo title, and descriptions

## 📱 Features & Functionality
- **Toggle Features**: Show/hide major sections (virtual phone, journey flow, etc.)
- **Channel Support**: Enable SMS, RCS, WhatsApp or any combination
- **Content Types**: Choose which rich message types are available
- **Message Templates**: Add, modify, or remove message examples

## 🔧 Virtual Phone
- **Device Appearance**: Change device model, carrier name, battery level
- **Contact Info**: Update business name and phone number
- **Message Themes**: Choose between iMessage, SMS, WhatsApp, RCS styles
- **Apps**: Configure which messaging apps are available

## 📝 Message System
- **Templates**: Create custom message templates with variables
- **Categories**: Marketing, transactional, notification, authentication
- **Variables**: Use dynamic content like `{{brandName}}`, `{{customerName}}`
- **Rich Content**: Configure interactive cards, carousels, and lists

## 🚀 Getting Started

### Method 1: Quick Start (5 minutes)
1. Copy `config/sample-config.ts` to `config/my-demo.ts`
2. Update the branding section with your company info
3. Import your config in `app/dynamic-sms-demo/page.tsx`
4. See changes instantly!

**Full instructions**: [QUICK-START.md](QUICK-START.md)

### Method 2: Use Existing Config
The demo works out-of-the-box with `defaultDemoConfig` - just start customizing the values in `config/demo-config.ts`.

## 📖 Detailed Documentation

For comprehensive configuration options and examples:
- **[README.md](README.md)** - Complete feature overview
- **[sample-config.ts](sample-config.ts)** - Fully commented example
- **[demo-config.ts](demo-config.ts)** - Interface definitions

## 🎯 Common Use Cases

### Rebrand for Your Company
```typescript
// In your config file
title: "ACME CORP SMS DEMO",
brandName: "ACME Corp",
brandColors: {
  primary: "#FF6B35",    // Your brand color
  secondary: "#2C3E50",  // Dark headers
  // ... other colors
}
```

### Hide Features You Don't Need
```typescript
features: {
  enableVirtualPhone: false,    // Hide phone preview
  enableJourneyFlow: false,     // Hide customer journey
  availableChannels: ['sms'],   // Only show SMS
}
```

### Add Your Message Templates
```typescript
messageTemplates: [
  {
    id: "custom-welcome",
    title: "Welcome Message",
    description: "Greet new customers",
    emoji: "👋",
    category: "marketing",
    messageContent: "Welcome to {{brandName}}! Get 10% off with code WELCOME10",
    variables: {},
    apiAction: "welcome",
    buttonText: "Send Welcome"
  }
]
```

## ✅ That's It!

The configuration system is designed to be simple and powerful. Most customizations take just a few minutes, and you can see changes immediately in the demo.

**Need help?** Check the sample config file for real examples of every option.