// Demo Configuration System
// This file allows users to customize all aspects of the SMS demo experience

export interface MessageTemplate {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'transactional' | 'marketing' | 'notification' | 'authentication';
  messageContent: string;
  variables?: Record<string, string | number>;
  apiAction: string;
  buttonText: string;
}

export interface PhoneAppConfig {
  id: string;
  name: string;
  icon: string;
  defaultOpen?: boolean;
  backgroundColor: string;
  textColor: string;
}

export interface MessageTheme {
  id: string;
  name: string;
  type: 'sms' | 'whatsapp' | 'rcs' | 'imessage';
  bubbleColor: string;
  textColor: string;
  backgroundColor: string;
  borderRadius: string;
  fontFamily: string;
  showTimestamp?: boolean;
  showDeliveryStatus?: boolean;
  avatar?: string;
}

export interface VirtualPhoneConfig {
  deviceName: string;
  carrierName: string;
  signalStrength: number; // 1-4
  batteryLevel: number; // 0-100
  currentTime: string;
  defaultApp: string; // App ID to open by default
  phoneNumber: string;
  contactName: string;
  messageTheme: string; // Theme ID
  apps: PhoneAppConfig[];
}

export interface DemoConfig {
  // General Demo Settings
  title: string;
  subtitle: string;
  brandName: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  // UI Text Configuration
  uiText: {
    // Main page sections
    sections: {
      phoneNumber: string;
      demoActions: string;
      customerJourney: string;
      messageTemplates: string;
      virtualPhone: string;
      resultsLog: string;
    };
    
    // Buttons and actions
    buttons: {
      completeJourney: string;
      clearResults: string;
      clearLog: string;
      editMessage: string;
      cancelEdit: string;
      saveChanges: string;
      addVariable: string;
      cancel: string;
      add: string;
    };
    
    // Form labels and placeholders
    forms: {
      phoneNumberPlaceholder: string;
      messageContentLabel: string;
      messagePreviewLabel: string;
      variablesLabel: string;
      variableNamePlaceholder: string;
      variableValuePlaceholder: string;
      noVariablesText: string;
    };
    
    // Twilio status section
    twilioStatus: {
      title: string;
      mode: string;
      accountSid: string;
      phoneNumber: string;
      demoMode: string;
      liveMode: string;
      demoModeDescription: string;
    };
    
    // Virtual phone interface
    virtualPhone: {
      tapToWake: string;
      demoModeDisabled: string;
      noMessagesYet: string;
      messagesWillAppearHere: string;
      contactInfo: string;
      back: string;
      call: string;
      message: string;
      email: string;
      notes: string;
      recentActivity: string;
      noRecentMessages: string;
      sendTextMessage: string;
    };

    // WhatsApp interface
    whatsapp: {
      headerTitle: string;
      online: string;
      offline: string;
      about: string;
      businessInfo: string;
      website: string;
      email: string;
      location: string;
      aboutDescription: string;
      typeMessage: string;
      chatsTitle: string;
      contactInfoTitle: string;
      video: string;
    };
    
    // Results and logging
    results: {
      noMessages: string;
      messageReceived: string;
      sending: string;
      sentSuccessfully: string;
      failed: string;
      messageDelivered: string;
      messageContent: string;
      demoMode: string;
      sequenceStarting: string;
      waiting: string;
      sequenceCompleted: string;
      updated: string;
    };
  };
  
  // Message Templates
  messageTemplates: MessageTemplate[];
  
  // Virtual Phone Configuration
  virtualPhone: VirtualPhoneConfig;
  
  // Available Message Themes
  messageThemes: MessageTheme[];
  
  // Journey Flow Configuration
  journeySteps: {
    id: string;
    title: string;
    description: string;
    icon: string;
    messageIds: string[];
  }[];
  
  // Rich Message Content Types Configuration
  richMessageTypes: {
    text: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
    };
    media: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'audio' | 'document';
    };
    card: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      cardTitle?: string;
      cardSubtitle?: string;
      cardImage?: string;
      buttons?: Array<{ title: string; type: 'url' | 'action' }>;
    };
    quickReplies: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      replies?: Array<{ id: string; title: string }>;
    };
    carousel: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      items?: Array<{
        id: string;
        image: string;
        title: string;
        subtitle: string;
        price?: string;
        buttons: Array<{ title: string; type: 'url' | 'action' }>;
      }>;
    };
  };
  
  // API Configuration
  apiConfig: {
    enableRiskCheck: boolean;
    defaultMessageIntent: string;
    enableConsentAPI: boolean;
    enableContactAPI: boolean;
  };
}

// Default Configuration - Users can customize this
export const defaultDemoConfig: DemoConfig = {
  title: "TWILIO COMPLIANCE TOOLKIT DEMO",
  subtitle: "Test the complete Owl Shop SMS customer journey powered by Twilio",
  brandName: "Owl Shop",
  brandColors: {
    primary: "#FF1233",
    secondary: "#000D25", 
    accent: "#081F47",
    background: "#DDE0E6",
    text: "#4D5777"
  },
  
  uiText: {
    sections: {
      phoneNumber: "PHONE NUMBER",
      demoActions: "DEMO ACTIONS",
      customerJourney: "CUSTOMER JOURNEY FLOW",
      messageTemplates: "Message Templates",
      virtualPhone: "VIRTUAL PHONE",
      resultsLog: "RESULTS LOG"
    },
    
    buttons: {
      completeJourney: "🎭 Complete Customer Journey",
      clearResults: "🗑️ Clear Results",
      clearLog: "Clear Log",
      editMessage: "Edit Message",
      cancelEdit: "Cancel Edit",
      saveChanges: "Save Changes",
      addVariable: "+ Add",
      cancel: "Cancel",
      add: "Add"
    },
    
    forms: {
      phoneNumberPlaceholder: "+1234567890",
      messageContentLabel: "Content:",
      messagePreviewLabel: "Preview:",
      variablesLabel: "Variables:",
      variableNamePlaceholder: "Name",
      variableValuePlaceholder: "Value",
      noVariablesText: "No variables. Click \"Add\" to create one."
    },
    
    twilioStatus: {
      title: "TWILIO STATUS",
      mode: "Mode:",
      accountSid: "Account SID:",
      phoneNumber: "Phone Number:",
      demoMode: "🎭 DEMO MODE",
      liveMode: "📱 LIVE MODE",
      demoModeDescription: "💡 Running in demo mode. Messages will be logged to console and sent to virtual phone."
    },
    
    virtualPhone: {
      tapToWake: "Tap to wake",
      demoModeDisabled: "Demo mode - input disabled",
      noMessagesYet: "No messages yet",
      messagesWillAppearHere: "Messages from demo will appear here",
      contactInfo: "Contact Info",
      back: "← Back",
      call: "Call",
      message: "Message",
      email: "Email",
      notes: "Notes",
      recentActivity: "Recent Activity",
      noRecentMessages: "No recent messages",
      sendTextMessage: "Send a text message"
    },

    whatsapp: {
      headerTitle: "WhatsApp",
      online: "Online",
      offline: "Offline",
      about: "About",
      businessInfo: "Business Info",
      website: "owlshop.com",
      email: "support@owlshop.com", 
      location: "Online Store",
      aboutDescription: "Welcome to Owl Shop! 🦉 Your destination for developer merchandise.",
      typeMessage: "Type a message",
      chatsTitle: "WhatsApp",
      contactInfoTitle: "Contact Info",
      video: "Video"
    },
    
    results: {
      noMessages: "No messages sent yet. Configure and test SMS functionality.",
      messageReceived: "📱 Virtual phone received:",
      sending: "🚀 Sending",
      sentSuccessfully: "✅ sent successfully",
      failed: "❌ Failed:",
      messageDelivered: "📱 Message delivered to virtual phone",
      messageContent: "📋 Message Content:",
      demoMode: "📋 Demo Mode:",
      sequenceStarting: "🎭 Starting message sequence",
      waiting: "⏳ Waiting",
      sequenceCompleted: "✅ Sequence completed!",
      updated: "📝 Updated template:"
    }
  },
  
  messageTemplates: [
    {
      id: "welcome",
      title: "Welcome Message",
      description: "Greeting for new customers",
      emoji: "👋",
      category: "marketing",
      messageContent: "Welcome to {{brandName}}, {{customerName}}! 🎉 Your account is ready. Reply STOP to opt out.",
      variables: { customerName: "Demo User" },
      apiAction: "welcome",
      buttonText: "Send Welcome"
    },
    {
      id: "marketing", 
      title: "Marketing Message",
      description: "Promotional deals & campaigns",
      emoji: "📈",
      category: "marketing",
      messageContent: "🔥 Exclusive Deal! Get 25% OFF premium items at {{brandName}}. Limited time! Shop now: {{shopUrl}} Reply STOP to opt out.",
      variables: { shopUrl: "https://owlshop.com/sale" },
      apiAction: "marketing",
      buttonText: "Send Marketing"
    },
    {
      id: "cart-abandonment",
      title: "Cart Recovery", 
      description: "Reminders after 1 day",
      emoji: "🛒",
      category: "transactional",
      messageContent: "Don't forget! You have {{itemCount}} items ({{cartTotal}}) waiting in your {{brandName}} cart. Complete your order: {{cartUrl}}",
      variables: { itemCount: 3, cartTotal: "$247.50", cartUrl: "https://owlshop.com/cart" },
      apiAction: "cart-abandonment",
      buttonText: "Send Cart Reminder"
    },
    {
      id: "order-confirmation",
      title: "Order Confirm",
      description: "Purchase confirmation", 
      emoji: "📦",
      category: "transactional",
      messageContent: "Order confirmed! {{brandName}} Order #{{orderNumber}} for {{orderTotal}} is being processed. Track: {{trackUrl}}",
      variables: { orderNumber: "OWL{{timestamp}}", orderTotal: "$247.50", trackUrl: "https://owlshop.com/track" },
      apiAction: "order-confirmation", 
      buttonText: "Send Confirmation"
    },
    {
      id: "shipping-update",
      title: "Shipping Update",
      description: "Real-time tracking updates",
      emoji: "🚚", 
      category: "notification",
      messageContent: "📦 Your {{brandName}} order #{{orderNumber}} has shipped! Track: {{trackingNumber}} Delivery expected {{deliveryDate}}",
      variables: { orderNumber: "OWL{{timestamp}}", trackingNumber: "TW{{timestamp}}", deliveryDate: "Tomorrow" },
      apiAction: "shipping-update",
      buttonText: "Send Shipping"
    },
    {
      id: "survey",
      title: "Survey",
      description: "Post-purchase feedback", 
      emoji: "📊",
      category: "notification",
      messageContent: "How was your {{brandName}} experience? Rate order #{{orderNumber}}: ⭐⭐⭐⭐⭐ Reply 1-5 or visit {{surveyUrl}}",
      variables: { orderNumber: "OWL{{timestamp}}", surveyUrl: "https://owlshop.com/survey" },
      apiAction: "post-purchase-survey",
      buttonText: "Send Survey"
    },
    {
      id: "otp",
      title: "OTP Code",
      description: "Authentication verification",
      emoji: "🔐",
      category: "authentication", 
      messageContent: "Your {{brandName}} verification code is: {{otpCode}}. Valid for 10 minutes. Do not share this code.",
      variables: { otpCode: "{{randomOTP}}" },
      apiAction: "test-otp",
      buttonText: "Send OTP"
    }
  ],
  
  virtualPhone: {
    deviceName: "iPhone 15 Pro",
    carrierName: "Twilio Mobile",
    signalStrength: 4,
    batteryLevel: 87,
    currentTime: "9:41 AM",
    defaultApp: "messages",
    phoneNumber: "+1 (833) 365-9260",
    contactName: "Owl Shop",
    messageTheme: "imessage",
    apps: [
      {
        id: "messages",
        name: "Messages",
        icon: "💬",
        defaultOpen: true,
        backgroundColor: "#007AFF",
        textColor: "#FFFFFF"
      },
      {
        id: "phone",
        name: "Phone", 
        icon: "📞",
        backgroundColor: "#34C759",
        textColor: "#FFFFFF"
      },
      {
        id: "whatsapp",
        name: "WhatsApp",
        icon: "📱",
        backgroundColor: "#25D366", 
        textColor: "#FFFFFF"
      }
    ]
  },
  
  messageThemes: [
    {
      id: "imessage",
      name: "iMessage",
      type: "imessage",
      bubbleColor: "#007AFF",
      textColor: "#FFFFFF", 
      backgroundColor: "#F2F2F7",
      borderRadius: "18px",
      fontFamily: "system-ui",
      showTimestamp: true,
      showDeliveryStatus: true
    },
    {
      id: "sms",
      name: "SMS/Android",
      type: "sms", 
      bubbleColor: "#E5E5EA",
      textColor: "#000000",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px", 
      fontFamily: "system-ui",
      showTimestamp: true,
      showDeliveryStatus: false
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      type: "whatsapp",
      bubbleColor: "#DCF8C6", 
      textColor: "#000000",
      backgroundColor: "#E5DDD5",
      borderRadius: "12px",
      fontFamily: "system-ui",
      showTimestamp: true,
      showDeliveryStatus: true,
      avatar: "👤"
    },
    {
      id: "rcs",
      name: "RCS Business",
      type: "rcs",
      bubbleColor: "#1976D2",
      textColor: "#FFFFFF",
      backgroundColor: "#F5F5F5", 
      borderRadius: "16px",
      fontFamily: "system-ui",
      showTimestamp: true,
      showDeliveryStatus: true
    }
  ],
  
  journeySteps: [
    {
      id: "marketing",
      title: "Marketing", 
      description: "Promotional deals & campaigns",
      icon: "📈",
      messageIds: ["marketing"]
    },
    {
      id: "cart-recovery",
      title: "Cart Recovery",
      description: "Reminders after 1 day", 
      icon: "🛒",
      messageIds: ["cart-abandonment"]
    },
    {
      id: "order-flow",
      title: "Order Flow",
      description: "Purchase to delivery",
      icon: "📦", 
      messageIds: ["order-confirmation", "shipping-update"]
    },
    {
      id: "engagement",
      title: "Engagement",
      description: "Feedback & retention",
      icon: "📊",
      messageIds: ["survey"]
    },
    {
      id: "authentication", 
      title: "Authentication",
      description: "Secure verification",
      icon: "🔐",
      messageIds: ["otp"]
    }
  ],
  
  richMessageTypes: {
    text: {
      id: "text",
      name: "Text Message",
      description: "Simple text-only message",
      icon: "💬",
      available: ["sms", "rcs", "whatsapp"]
    },
    media: {
      id: "media",
      name: "Media Message",
      description: "Message with image, video, or document",
      icon: "📷",
      available: ["rcs", "whatsapp"],
      mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      mediaType: "image"
    },
    card: {
      id: "card",
      name: "Card Message",
      description: "Rich card with image, title, and buttons",
      icon: "🃏",
      available: ["rcs", "whatsapp"],
      cardTitle: "Special Offer!",
      cardSubtitle: "Limited time deal - Don't miss out!",
      cardImage: "🎉",
      buttons: [
        { title: "Shop Now", type: "url" },
        { title: "Learn More", type: "action" }
      ]
    },
    quickReplies: {
      id: "quickReplies",
      name: "Quick Replies",
      description: "Message with suggested reply buttons",
      icon: "⚡",
      available: ["rcs", "whatsapp"],
      replies: [
        { id: "1", title: "🛍️ Shop Now" },
        { id: "2", title: "📞 Call Us" },
        { id: "3", title: "💬 Chat" }
      ]
    },
    carousel: {
      id: "carousel",
      name: "Product Carousel",
      description: "Multiple cards with products or options",
      icon: "🎠",
      available: ["rcs", "whatsapp"],
      items: [
        {
          id: "1",
          image: "🦉",
          title: "Owl Hoodie",
          subtitle: "Premium comfort hoodie",
          price: "$49.99",
          buttons: [{ title: "Buy Now", type: "url" }]
        },
        {
          id: "2",
          image: "👔",
          title: "Dev T-Shirt",
          subtitle: "Perfect for coding",
          price: "$29.99",
          buttons: [{ title: "Buy Now", type: "url" }]
        },
        {
          id: "3",
          image: "☕",
          title: "Code Mug",
          subtitle: "Fuel your coding",
          price: "$19.99",
          buttons: [{ title: "Buy Now", type: "url" }]
        }
      ]
    }
  },
  
  apiConfig: {
    enableRiskCheck: true,
    defaultMessageIntent: "marketing",
    enableConsentAPI: true,
    enableContactAPI: true
  }
};

// Configuration loader with override support
export function loadDemoConfig(overrides?: Partial<DemoConfig>): DemoConfig {
  return {
    ...defaultDemoConfig,
    ...overrides
  };
}

// Utility functions for working with the config
export function getMessageTemplate(config: DemoConfig, id: string): MessageTemplate | undefined {
  return config.messageTemplates.find(template => template.id === id);
}

export function getMessageTheme(config: DemoConfig, id: string): MessageTheme | undefined {
  return config.messageThemes.find(theme => theme.id === id);
}

export function getPhoneApp(config: DemoConfig, id: string): PhoneAppConfig | undefined {
  return config.virtualPhone.apps.find(app => app.id === id);
}

export function processMessageTemplate(template: MessageTemplate, additionalVars?: Record<string, string | number>): string {
  let message = template.messageContent;
  const allVars = { ...template.variables, ...additionalVars };
  
  // Replace template variables
  Object.entries(allVars).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regex, String(value));
  });
  
  // Handle special variables
  message = message.replace(/{{timestamp}}/g, Date.now().toString());
  message = message.replace(/{{randomOTP}}/g, Math.floor(100000 + Math.random() * 900000).toString());
  
  return message;
}