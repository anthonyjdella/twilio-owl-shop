# 📱 Virtual Phone Customization Guide

**Make the virtual phone look and behave exactly like your customer's brand**

## 🎨 Visual Customization

### **Basic Phone Appearance**
```typescript
virtualPhone: {
  deviceName: "Customer iPhone Pro",           // What phone model to show
  carrierName: "Customer Wireless",            // Carrier name in status bar
  signalStrength: 4,                          // Signal bars (1-4)
  batteryLevel: 87,                           // Battery percentage (0-100)
  currentTime: "2:30 PM",                     // Time display
  phoneNumber: "+1 (555) CUSTOMER",           // Your customer's number
  contactName: "Customer Support Team"        // How your business appears
}
```

### **Brand-Specific Contact Profile**
The virtual phone automatically shows different contact profiles based on the selected channel:

**SMS Channel:**
- Shows basic contact name and number
- Standard messaging interface

**RCS Channel:**  
- Shows verified business badge ✅
- Displays business logo
- Shows "Verified Business" status

**WhatsApp Channel:**
- Shows WhatsApp Business profile
- Custom business information
- About section with company details

**Voice Channel:**
- Shows call interface
- Contact information during calls
- Call history with your business

## 🎯 Channel-Specific Virtual Phone Behavior

### **SMS Virtual Phone Setup**
```typescript
// For basic SMS demonstrations
messageThemes: [{
  id: "customer-sms",
  name: "Customer SMS Style",
  type: "sms",
  bubbleColor: "#E5E5EA",           // Message bubble color
  textColor: "#000000",             // Text color
  backgroundColor: "#FFFFFF",        // Background color
  borderRadius: "8px",              // Bubble roundness
  showTimestamp: true,              // Show message times
  showDeliveryStatus: false         // Hide delivery indicators
}]
```

### **WhatsApp Business Virtual Phone Setup**
```typescript
// Customize WhatsApp Business appearance
whatsapp: {
  headerTitle: "Customer Business",
  online: "Online now",
  about: "About Customer Corp",
  businessInfo: "Business Information",
  website: "customer-corp.com",
  email: "support@customer-corp.com",
  location: "Customer Headquarters",
  aboutDescription: "Welcome to Customer Corp! Your trusted business partner since 2010.",
  typeMessage: "Type a message to Customer Corp"
}
```

### **RCS Business Virtual Phone Setup**
The RCS virtual phone automatically shows:
- ✅ **Verified Business Badge** next to your company name
- 🏢 **Business Logo** (configurable)
- 📋 **Business Profile** with company information
- 🔒 **Trust Indicators** for security

## 📞 Voice Virtual Phone Customization

### **Call Interface Settings**
```typescript
voiceSettings: {
  autoEndCalls: false,                    // Manual hang up only
  callDurationSeconds: undefined,         // Unlimited call time
  showCallHistory: true,                  // Show recent calls
  maxCallHistoryItems: 10,               // Number of calls to show
  enableMockContacts: true,              // Show fake contacts for demo
  
  mockContacts: [
    {
      id: '1',
      name: 'Customer Success Team',
      number: '+1 (555) CUSTOMER',
      avatar: '👥',
      company: 'Customer Corp'
    },
    {
      id: '2', 
      name: 'Sales Team',
      number: '+1 (555) 123-SALES',
      avatar: '💼',
      company: 'Customer Corp Sales'
    }
  ]
}
```

### **Text-to-Speech Visual Effects**
When demonstrating voice features, the virtual phone shows:
- 🎙️ **TTS Indicator** - Visual microphone with pulsing animation
- 🌈 **Gradient Background** - Dramatic visual effect during speech
- 📢 **"VOICE SYNTHESIS"** - Large panel showing TTS is active
- 🔊 **Speaker Badge** - Bouncing speaker icon
- ⏱️ **Real-time Updates** - Shows TTS progress and completion

## 🎨 Message Theme Customization

### **Professional Business Theme**
```typescript
{
  id: "professional",
  name: "Professional Business",
  type: "sms",
  bubbleColor: "#4F46E5",           // Corporate purple
  textColor: "#FFFFFF",             // White text
  backgroundColor: "#F8FAFC",       // Light gray background
  borderRadius: "12px",             // Rounded corners
  fontFamily: "system-ui",          // Clean font
  showTimestamp: true,
  showDeliveryStatus: true
}
```

### **Healthcare Theme**
```typescript
{
  id: "healthcare",
  name: "Healthcare Secure",
  type: "sms", 
  bubbleColor: "#10B981",           // Medical green
  textColor: "#FFFFFF",
  backgroundColor: "#F0FDF4",       // Light green background
  borderRadius: "16px",
  showTimestamp: true,
  showDeliveryStatus: true,
  avatar: "🏥"                      // Hospital icon
}
```

### **E-commerce Theme**
```typescript
{
  id: "ecommerce",
  name: "Shopping Experience",
  type: "sms",
  bubbleColor: "#F59E0B",           // Shopping orange
  textColor: "#FFFFFF", 
  backgroundColor: "#FFFBEB",       // Light orange background
  borderRadius: "14px",
  showTimestamp: true,
  showDeliveryStatus: true,
  avatar: "🛍️"                     // Shopping bag icon
}
```

## 🎭 Demo-Specific Virtual Phone Behaviors

### **Order Confirmation Demo**
Virtual phone will show:
1. **Message arrives** with order details
2. **Delivery status** indicators (✓ sent, ✓✓ delivered)
3. **Clickable tracking link** (visual highlight)
4. **Timestamp** showing when order was confirmed

### **Appointment Reminder Demo**
Virtual phone will show:
1. **Calendar icon** in message
2. **Confirmation buttons** (C to confirm, R to reschedule)
3. **Provider information** clearly displayed
4. **Time/date** prominently shown

### **Interactive Features Demo (RCS/WhatsApp)**
Virtual phone will show:
1. **Swipeable carousels** with product cards
2. **Tappable buttons** with hover effects
3. **Quick reply chips** below messages
4. **Rich media previews** with download options

### **Voice Demo Behaviors**
Virtual phone will show:
1. **Incoming call screen** with business name
2. **IVR menu options** visually displayed
3. **Keypad interface** for number selection
4. **Call progress indicators** (ringing, connected, ended)

## 🚀 Quick Virtual Phone Setups by Industry

### **Healthcare Virtual Phone**
```typescript
virtualPhone: {
  deviceName: "Secure Patient Device",
  carrierName: "HealthSecure",
  contactName: "Patient Services",
  phoneNumber: "+1 (555) HEALTH-1",
  messageTheme: "healthcare"
},
whatsapp: {
  headerTitle: "Patient Portal",
  website: "patient.healthcorp.com",
  email: "patients@healthcorp.com",
  aboutDescription: "Your secure healthcare communication portal. HIPAA compliant messaging."
}
```

### **Financial Services Virtual Phone**
```typescript
virtualPhone: {
  deviceName: "Secure Banking Device", 
  carrierName: "SecureBank Mobile",
  contactName: "Account Services",
  phoneNumber: "+1 (555) BANK-SECURE",
  messageTheme: "professional"
},
whatsapp: {
  headerTitle: "Customer Bank",
  website: "secure.customerbank.com", 
  email: "security@customerbank.com",
  aboutDescription: "Official Customer Bank communication. Never share your login details."
}
```

### **E-commerce Virtual Phone**
```typescript
virtualPhone: {
  deviceName: "Customer Phone",
  carrierName: "Shopping Mobile",
  contactName: "Customer Support",
  phoneNumber: "+1 (555) SHOP-24-7",
  messageTheme: "ecommerce"
},
whatsapp: {
  headerTitle: "Customer Shop",
  website: "shop.customer.com",
  email: "orders@customer.com", 
  aboutDescription: "Welcome to Customer Shop! Track orders, get support, and discover new products."
}
```

## 🎯 Virtual Phone Demo Tips

### **Before Customer Demo:**
1. **Test all channels** - Switch between SMS, RCS, WhatsApp, Voice
2. **Verify branding** - Company name, colors, contact info
3. **Check message flow** - Complete customer journey works smoothly
4. **Test interactions** - Buttons, carousels, quick replies respond

### **During Demo:**
1. **Point out the virtual phone** - "Here's what your customers see..."
2. **Show channel differences** - Switch between basic SMS and rich RCS
3. **Highlight business verification** - Verified badges, business profiles
4. **Demonstrate interactions** - Tap buttons, swipe carousels
5. **Show real-time updates** - Messages appear instantly

### **Key Demo Moments:**
- 📱 **"And here's your customer's actual phone..."**
- ✅ **"Notice the verified business badge for trust..."**
- 🎨 **"Everything matches your brand colors..."**
- 🔄 **"Watch how smoothly this switches between channels..."**
- 📞 **"Even voice calls show your business information..."**

---

**🎉 The virtual phone is your secret demo weapon!** It shows customers exactly what their users will experience, making your Twilio demo incredibly compelling and tangible.