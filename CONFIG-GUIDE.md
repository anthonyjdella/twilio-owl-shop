# 📖 Complete Configuration Guide

**Everything you need to customize the Twilio demo for your customers**

## 🎯 Quick Customization (5 minutes)

Edit `config/demo-config.ts` and change these core values:

```typescript
// Basic branding - change these first
title: "YOUR CUSTOMER NAME DEMO",
subtitle: "See how [Customer] can engage customers with Twilio",
brandName: "Customer Company",

// Brand colors - use customer's colors
brandColors: {
  primary: "#FF6B35",     // Customer's main brand color
  secondary: "#2D3748",   // Dark text color  
  accent: "#4299E1",      // Accent highlights
  background: "#F7FAFC",  // Page background
  text: "#718096"         // Body text
},

// Virtual phone branding
virtualPhone: {
  contactName: "Customer Support",
  phoneNumber: "+1 (555) CUSTOMER"
}
```

## 📱 Virtual Phone Customization

### Basic Phone Settings
```typescript
virtualPhone: {
  deviceName: "Customer iPhone Pro",     // Phone model shown
  carrierName: "Customer Wireless",      // Carrier in status bar
  signalStrength: 4,                     // Signal bars (1-4)
  batteryLevel: 87,                      // Battery % (0-100)
  currentTime: "2:30 PM",                // Time display
  phoneNumber: "+1 (555) YOUR-NUMBER",   // Business number
  contactName: "Your Business Name",     // How you appear in contacts
  messageTheme: "imessage"               // Message bubble style
}
```

### WhatsApp Business Profile
```typescript
whatsapp: {
  headerTitle: "Customer Business",
  website: "customer.com",
  email: "support@customer.com",
  aboutDescription: "Welcome to Customer Corp! Your trusted partner.",
  online: "Online now",
  location: "Customer Headquarters"
}
```

## 🎨 UI Text Customization

### Section Headers
```typescript
uiText: {
  sections: {
    phoneNumber: "CUSTOMER PHONE",
    demoActions: "DEMO SCENARIOS",
    customerJourney: "CUSTOMER EXPERIENCE FLOW",
    virtualPhone: "CUSTOMER'S PHONE PREVIEW",
    resultsLog: "DEMO ACTIVITY LOG"
  }
}
```

### Button Labels
```typescript
buttons: {
  completeJourney: "🚀 Run Customer Journey",
  clearResults: "🗑️ Clear Demo Log",
  editMessage: "✏️ Customize",
  sendMessage: "📤 Send Demo"
}
```

## 💬 Message Templates

### Adding New Message Templates
```typescript
messageTemplates: [
  {
    id: "your-custom-message",
    title: "Custom Use Case",
    description: "Describe what this message does",
    emoji: "🎯",
    category: "transactional", // or marketing, notification, authentication
    messageContent: "Hi {{customerName}}, your {{service}} is ready!",
    variables: { 
      customerName: "John Smith",
      service: "order"
    },
    apiAction: "custom-action",
    buttonText: "Demo Custom Message"
  }
]
```

### Message Categories
- **`marketing`** - Promotional messages, campaigns
- **`transactional`** - Order confirmations, receipts  
- **`notification`** - Alerts, reminders, updates
- **`authentication`** - OTP codes, security alerts

### Using Variables
Variables automatically replace `{{variableName}}` in messages:
```typescript
messageContent: "Hi {{customerName}}, your order #{{orderNumber}} for ${{total}} is confirmed!",
variables: {
  customerName: "Demo User",
  orderNumber: "12345", 
  total: "99.99"
}
```

## ⚡ Feature Cards Configuration

### Enable/Disable Features
```typescript
// In any feature card
enabled: true,  // Shows the feature
enabled: false, // Hides the feature completely
```

### Adding Custom Features
```typescript
featureCards: [
  {
    id: "custom-feature",
    title: "Your Custom Feature",
    description: "What this Twilio feature does",
    emoji: "⚡",
    category: "sms-features", // sms-features, rcs-features, whatsapp-features, voice-features
    channel: "sms", // sms, rcs, whatsapp, voice
    
    // Demo behavior
    demoConfig: {
      mockBehavior: "What happens when they click demo",
      virtualPhoneEffect: "What shows on the virtual phone",
      customMessage: "The actual message that appears",
      timeDelay: 1000, // milliseconds before effect
      persistEffect: true // whether effect stays visible
    },
    
    // Technical info
    technicalDetails: {
      twilioFeature: "Official Twilio Feature Name",
      documentation: "https://www.twilio.com/docs/...",
      apiEndpoint: "/api/endpoint"
    },
    
    messageContent: "📨 Message customers see",
    buttonText: "Demo This Feature",
    enabled: true
  }
]
```

### Feature Categories
- **`sms-features`** - SMS/MMS capabilities
- **`rcs-features`** - Rich messaging features  
- **`whatsapp-features`** - WhatsApp Business features
- **`voice-features`** - Voice and calling features

## 🎭 Customer Journey Flow

### Customizing Journey Steps
```typescript
journeySteps: [
  {
    id: "welcome",
    title: "Welcome",
    description: "Greet new customers", 
    icon: "👋",
    messageIds: ["welcome-message"] // IDs of messages to send
  },
  {
    id: "promotion", 
    title: "Special Offer",
    description: "Send promotional deals",
    icon: "🎁",
    messageIds: ["promo-message", "limited-time-offer"]
  }
]
```

## 📞 Voice Features Configuration

### Voice Settings for Features
```typescript
// In voice feature cards
demoConfig: {
  voiceSettings: {
    voice: "alice",        // alice, man, woman, Polly.Joanna, Polly.Matthew
    language: "en-US",     // en-US, en-GB, es-ES, fr-FR, de-DE
    speed: 1.0,           // Speech speed (0.5 - 2.0)
    pitch: 1.0            // Voice pitch (0.5 - 2.0)
  }
}
```

### Available Voice Options
- **Basic voices**: `alice`, `man`, `woman`
- **Polly voices**: `Polly.Joanna`, `Polly.Matthew`, `Polly.Amy`, `Polly.Brian`
- **Languages**: `en-US`, `en-GB`, `es-ES`, `fr-FR`, `de-DE`, `pt-BR`, `it-IT`

## 🔘 Interactive Elements

### Adding Buttons and Quick Replies
```typescript
demoConfig: {
  interactiveElements: {
    // For buttons (WhatsApp, RCS)
    buttons: [
      { title: "Call Support", type: "phone", payload: "+1-800-SUPPORT" },
      { title: "Visit Website", type: "url", url: "https://customer.com" },
      { title: "Get Help", type: "reply", payload: "help_requested" }
    ],
    
    // For quick replies (RCS)
    quickReplies: [
      { title: "Yes, interested", payload: "interested" },
      { title: "Not now", payload: "not_now" },
      { title: "Tell me more", payload: "more_info" }
    ]
  }
}
```

## 🎨 Rich Content Configuration

### Media Messages
```typescript
demoConfig: {
  mediaUrl: "https://your-image-url.com/image.jpg",
  mediaType: "image", // image, video, audio, document
  customMessage: "📷 Check out our latest products!"
}
``` 

### Carousel Cards (RCS)
```typescript
richMessageTypes: {
  carousel: {
    items: [
      {
        id: "1",
        title: "Product 1",
        subtitle: "Description of product",
        image: "https://product-image.jpg",
        buttons: [
          { title: "Buy Now", type: "url", url: "https://buy-link" },
          { title: "Learn More", type: "reply", payload: "product_1_info" }
        ]
      }
    ]
  }
}
```

## 🏭 Industry-Specific Templates

### E-commerce Configuration
```typescript
// Focus on shopping features
title: "ACME STORE SMS DEMO",
brandName: "ACME Store",

// Enable shopping-focused features
messageTemplates: [
  // Order confirmations, shipping updates, cart abandonment
],

// Shopping-focused journey
journeySteps: [
  { id: "marketing", title: "Product Discovery" },
  { id: "cart-recovery", title: "Cart Abandonment" },
  { id: "order", title: "Order Updates" },
  { id: "feedback", title: "Customer Reviews" }
]
```

### Healthcare Configuration  
```typescript
title: "PATIENT COMMUNICATION DEMO",
brandName: "HealthCorp",
brandColors: { primary: "#059669" }, // Medical green

// HIPAA-focused features
messageTemplates: [
  // Appointment reminders, test results, emergency alerts
],

// Healthcare journey
journeySteps: [
  { id: "appointment", title: "Appointment Management" },
  { id: "results", title: "Test Results" },
  { id: "emergency", title: "Emergency Alerts" }
]
```

### Financial Services Configuration
```typescript
title: "SECURE BANKING COMMUNICATIONS",
brandName: "SecureBank", 
brandColors: { primary: "#1E40AF" }, // Banking blue

// Security-focused features
messageTemplates: [
  // Transaction alerts, fraud prevention, authentication
],

// Banking journey  
journeySteps: [
  { id: "alerts", title: "Transaction Monitoring" },
  { id: "security", title: "Fraud Prevention" }, 
  { id: "auth", title: "Secure Authentication" }
]
```

## 🎛️ Advanced Configuration

### Channel-Specific Settings
```typescript
features: {
  availableChannels: ['sms', 'rcs', 'whatsapp', 'voice'], // Which channels to show
  defaultChannel: 'sms', // Which channel starts selected
  enableContentTypes: true, // Show rich content options
  availableContentTypes: ['text', 'media', 'richCard', 'carousel'] // Content types
}
```

### Layout Customization
```typescript
layout: {
  gridColumns: 2, // Number of columns for feature cards (1-3)
  showCategoryFilter: true, // Show category filter buttons
  showTimestamps: true, // Show message timestamps
  compactMode: false // Use compact card layout
}
```

### Phone Settings
```typescript
features: {
  phoneSettings: {
    defaultPhoneNumber: "+1 (555) 123-4567", // Default for voice demos
    enableRealCalls: true, // Allow actual voice calls (requires Twilio)
    callAutoEndTime: undefined // Auto-end calls after X seconds (undefined = manual)
  }
}
```

## 🚀 Quick Setup Examples

### 5-Minute Customer Demo Setup
1. **Change branding** (title, brandName, brandColors)
2. **Update virtual phone** (contactName, phoneNumber)  
3. **Select relevant features** (set enabled: false on unused features)
4. **Test customer journey** (click "Complete Customer Journey")

### Industry-Specific Setup
1. **Copy template** from `config/templates/[industry]-config.ts`
2. **Customize branding** with customer details
3. **Enable relevant features** for their use case
4. **Test demo flow** to ensure smooth presentation

### Live Demo Customization
1. **Edit features during demo** by clicking ✏️ buttons
2. **Change messages in real-time** to match customer needs
3. **Switch channels** to show multi-channel capabilities
4. **Update virtual phone** branding on the fly

## 🎯 Best Practices

### For Customer Demos
- Use customer's actual brand colors and company name
- Enable only features relevant to their industry/use case
- Test the complete customer journey before presenting
- Prepare 2-3 custom use case examples

### For Technical Discussions
- Show API documentation links in feature details
- Demonstrate webhook callbacks and error handling
- Explain rate limits and scaling considerations
- Provide code examples for integration

### For Executive Presentations
- Focus on business outcomes and ROI metrics
- Highlight multi-channel reach and customer engagement
- Show compliance and security features
- Demonstrate scalability for enterprise needs

## 🛠️ Troubleshooting

### Common Issues
- **Features not showing**: Check `enabled: true` in feature config
- **Virtual phone not updating**: Verify `selectedChannel` matches feature channel
- **Messages not appearing**: Check message template IDs match journey step IDs
- **Colors not applying**: Ensure hex color format (#RRGGBB)

### Configuration Validation
The system includes TypeScript validation to catch configuration errors:
- Invalid color formats will show TypeScript errors
- Missing required fields will be highlighted
- Incorrect channel/category combinations will be flagged

---

**🎉 With this configuration system, you can customize every aspect of the demo for compelling customer presentations!**