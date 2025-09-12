# 🦉 Twilio Owl Shop

**A complete e-commerce demo platform showcasing Twilio's communication APIs**

Owl Shop is a fully functional online clothing store that demonstrates how modern businesses can integrate Twilio's SMS, Voice, WhatsApp, and RCS messaging capabilities to enhance customer experience and drive sales.

## 🛍️ What Is This?

**Owl Shop** is a premium e-commerce website selling developer-themed clothing and accessories. It includes:

- **Complete online store** with product catalog, shopping cart, and checkout
- **Real customer journey** from browsing to purchase to delivery
- **Twilio SMS integration** at every touchpoint
- **Two demo modes** for different presentation needs

## 🎭 Two Demo Experiences

### 1. **Classic E-commerce Demo** (`/`)
**Full shopping experience with integrated SMS**
- Browse and purchase products like a real customer
- Experience SMS notifications throughout the journey:
  - Welcome messages for new customers
  - Cart abandonment reminders  
  - Order confirmations and shipping updates
  - Post-purchase surveys
- Perfect for showing **real-world SMS integration**

### 2. **Dynamic Communication Demo** (`/dynamic-sms-demo`)
**Customizable Twilio feature showcase**
- **Virtual phone interface** showing exactly what customers see
- **28+ Twilio features** across SMS, RCS, WhatsApp, and Voice
- **Live customization** - edit messages and branding during presentations
- **Industry templates** for different customer verticals
- Perfect for **sales presentations and technical demos**

## 🚀 Quick Start

1. **Install and run:**
   ```bash
   git clone [repository-url]
   cd twilio-owl-shop
   npm install
   npm run dev
   ```

2. **Try both demos:**
   - **E-commerce experience:** `http://localhost:3001/`
   - **Communication showcase:** `http://localhost:3001/dynamic-sms-demo`

## 🎯 Who Is This For?

### **Sales Teams & Solution Engineers**
- Demo Twilio's capabilities to prospects
- Show real-world SMS integration in e-commerce
- Customize presentations for specific industries
- Interactive virtual phone shows customer experience

### **Developers & Technical Teams**
- Learn SMS integration patterns
- See complete Twilio API implementations
- Study e-commerce SMS workflows
- Reference code for customer projects

### **Business Teams**
- Understand SMS marketing opportunities
- See customer journey touchpoints
- Experience modern communication channels
- Plan SMS integration strategies

## 🛍️ E-commerce Features

- **Product Catalog**: 8 premium clothing items with filtering and search
- **Shopping Cart**: Persistent cart with promo codes and quantity controls
- **Checkout Flow**: Multi-step process with guest and authenticated options
- **Order Tracking**: Real-time status updates with SMS notifications
- **User Accounts**: Registration, login, and profile management
- **SMS Integration**: Automated messaging at every customer touchpoint

## 📱 Communication Features

- **SMS Campaigns**: Marketing messages and promotional offers
- **Transactional SMS**: Order confirmations, shipping updates, receipts
- **Rich Messaging**: RCS cards, carousels, and interactive buttons
- **WhatsApp Business**: Professional business messaging with media
- **Voice Capabilities**: Text-to-speech, IVR systems, call recording
- **Virtual Phone**: Realistic mobile interface showing customer experience

## 🎨 Customization

**For customer demos**, customize the dynamic demo in `config/demo-config.ts`:

```typescript
// Brand for your customer
title: "ACME CORP COMMUNICATION DEMO",
brandName: "ACME Corp",
brandColors: {
  primary: "#FF6B35"  // Customer's brand color
}

// Virtual phone branding
virtualPhone: {
  contactName: "ACME Customer Service",
  phoneNumber: "+1 (555) ACME-HELP"
}
```

**Need detailed customization?** → **[Complete Configuration Guide](CONFIG-GUIDE.md)**

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Communication**: Twilio SMS, Voice, WhatsApp APIs
- **Data**: Local storage with mock authentication
- **Deployment**: Vercel-ready with serverless functions

## 🎭 Demo Scenarios

### **E-commerce SMS Journey**
1. Customer browses products at `/`
2. Abandons cart → receives SMS reminder
3. Completes purchase → gets order confirmation SMS
4. Package ships → receives tracking SMS with link
5. Delivery complete → SMS survey for feedback

### **Communication Feature Showcase**
1. Open `/dynamic-sms-demo`
2. Select communication channel (SMS/RCS/WhatsApp/Voice)
3. Demo individual features with virtual phone preview
4. Show customer journey flow across channels
5. Customize features live during presentation

## 🚀 Getting Started

### **For E-commerce Demo**
1. Start at homepage (`/`)
2. Browse products and add to cart
3. Go through checkout process
4. Check SMS notifications in console/logs
5. Track order status at `/orders/[id]`

### **For Communication Demo**
1. Go to `/dynamic-sms-demo`
2. Customize branding for your customer
3. Select relevant communication channel
4. Demo features and watch virtual phone
5. Edit features live during presentations

## 📞 SMS Setup (Optional)

Add Twilio credentials to `.env.local` for real SMS:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token  
TWILIO_PHONE_NUMBER=your_twilio_number
```

**Without credentials**: App runs in demo mode (SMS logged to console)

---

**🎯 Perfect for demonstrating how modern businesses can leverage Twilio's communication platform to enhance customer experience and drive revenue.**