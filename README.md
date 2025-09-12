# 🦉 Twilio Owl Shop - Demo Platform

A customizable demo platform for showcasing Twilio's SMS, RCS, WhatsApp, and Voice capabilities with a realistic virtual phone interface.

## 🚀 Quick Start

1. **Install and run:**
   ```bash
   git clone [repository-url]
   cd twilio-owl-shop
   npm install
   npm run dev
   ```

2. **Open demo:** `http://localhost:3001/dynamic-sms-demo`

3. **Customize for your customer:** Edit `config/demo-config.ts` to change branding, messages, and features

## 📱 What You Get

- **Virtual Phone**: Shows exactly what customers see on their phones
- **Multi-Channel**: SMS, RCS, WhatsApp Business, Voice with authentic interfaces  
- **28+ Features**: Complete Twilio feature demonstrations across all channels
- **Live Editing**: Click ✏️ on any feature to customize during presentations
- **Industry Ready**: E-commerce, Healthcare, Financial, SaaS templates

## 🎯 Basic Customization

**Brand for your customer** in `config/demo-config.ts`:
```typescript
title: "ACME CORP SMS DEMO",
brandName: "ACME Corp", 
brandColors: {
  primary: "#FF6B35"  // Customer's brand color
}
```

**Customize virtual phone:**
```typescript
virtualPhone: {
  contactName: "ACME Customer Service",
  phoneNumber: "+1 (555) ACME-HELP"
}
```

## 📚 Full Documentation

**Need to customize features, messages, or add new use cases?**  
👉 **[Complete Configuration Guide](CONFIG-GUIDE.md)**

## 🎭 Demo Flow

1. **Brand** your demo with customer colors/name
2. **Select channel** (SMS/RCS/WhatsApp/Voice)
3. **Click features** to demonstrate capabilities  
4. **Watch virtual phone** show realistic customer experience
5. **Edit live** during customer presentations

## 🛠️ Technology

- Next.js 15 + TypeScript
- Tailwind CSS styling  
- Twilio APIs integration
- Real-time virtual phone simulation

---

**Perfect for Sales Teams and Solution Engineers showcasing Twilio's communication platform.**