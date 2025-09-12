# 🦉 Twilio Owl Shop - Demo Platform

A customizable demo platform for showcasing Twilio's SMS, RCS, WhatsApp, and Voice capabilities.

## 🚀 Quick Start

1. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

2. **Demo URL:** `http://localhost:3001/dynamic-sms-demo`

## 🎨 Customize for Customer Demos

Edit `config/demo-config.ts`:

```typescript
// Brand it for your customer
title: "CUSTOMER NAME DEMO",
brandName: "Customer Company",
brandColors: {
  primary: "#CUSTOMER_COLOR"
}
```

## 📱 Features

- **Virtual Phone**: See exactly what customers see on their phones
- **Multi-Channel**: SMS, RCS, WhatsApp Business, Voice
- **Live Editing**: Click ✏️ on any feature to customize 
- **Industry Templates**: E-commerce, Healthcare, Financial, SaaS

## 🎯 Demo Flow

1. **Customize** your branding in the config file
2. **Select channel** (SMS/RCS/WhatsApp/Voice) 
3. **Click message templates** to send demos
4. **Watch virtual phone** show realistic customer experience
5. **Edit features live** during customer presentations

## ⚙️ Key Configuration

```typescript
// Enable/disable features
enabled: true/false

// Customize messages
messageContent: "Your custom message here"

// Virtual phone branding
virtualPhone: {
  contactName: "Your Business Name",
  phoneNumber: "+1 (555) YOUR-NUM"
}
```

## 🛠️ Technology

- **Next.js 15** with TypeScript
- **Tailwind CSS** styling
- **Twilio APIs** integration
- **Real-time** virtual phone simulation

---

**Perfect for Sales Teams and Solution Engineers showcasing Twilio's communication platform.**