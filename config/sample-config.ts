// Sample Configuration File
// Copy this file and customize it for your own demo

import { DemoConfig } from './demo-config';

export const mySampleConfig: DemoConfig = {
  // ====== BASIC BRANDING ======
  title: "MY AWESOME SMS DEMO",
  subtitle: "Customize this demo for your business needs",
  brandName: "My Company",
  
  // ====== BRAND COLORS ======
  brandColors: {
    primary: "#3B82F6",    // Blue - your main brand color
    secondary: "#1F2937",  // Dark gray - for headers
    accent: "#10B981",     // Green - for accents
    background: "#F3F4F6", // Light gray - page background
    text: "#6B7280"        // Medium gray - body text
  },
  
  // ====== FEATURE TOGGLES ======
  features: {
    enableRichMessaging: true,     // Show rich content types
    enableVirtualPhone: true,      // Show virtual phone
    enableConfigPanel: true,       // Show config panel
    enableJourneyFlow: true,       // Show customer journey
    enableChannelSelection: true,  // Show channel selector
    availableChannels: ['sms', 'rcs', 'whatsapp', 'voice'], // Which channels to show
    defaultChannel: 'sms',         // Default selected channel
    enableContentTypes: true,      // Show content type options
    availableContentTypes: ['text', 'richCard', 'carousel'], // Which content types to show
    voiceTemplateIds: [            // Voice-specific message template IDs
      'outbound-call',
      'appointment-reminder-call', 
      'support-callback',
      'order-confirmation-call',
      'survey-call'
    ],
    phoneSettings: {               // Voice call settings
      defaultPhoneNumber: '+1 (555) 123-4567',
      enableRealCalls: true,       // Enable actual voice calls
      callAutoEndTime: undefined   // undefined = manual hang up only
    }
  },
  
  // ====== LAYOUT SETTINGS ======
  layout: {
    gridColumns: 2,           // Number of columns for message cards
    showCategoryFilter: true, // Show category filter buttons
    showTimestamps: true,     // Show message timestamps
    showDeliveryStatus: true, // Show delivery status
    compactMode: false,       // Use compact layout
    showPreviewSection: true  // Show content preview when not editing
  },
  
  // ====== CARD LAYOUTS ======
  cardLayouts: {
    default: {
      showEmoji: true,          // Show emoji in cards
      showCategory: true,       // Show category badges
      showChannel: true,        // Show channel badges
      showDescription: true,    // Show template descriptions
      headerLayout: 'horizontal', // 'horizontal' or 'vertical'
      buttonStyle: 'filled',    // 'filled', 'outlined', or 'text'
      borderStyle: 'left'       // 'left', 'top', 'full', or 'none'
    },
    compact: {
      showEmoji: true,
      showCategory: false,
      showChannel: false, 
      showDescription: false,
      headerLayout: 'horizontal',
      buttonStyle: 'filled',
      borderStyle: 'none'
    },
    detailed: {
      showEmoji: true,
      showCategory: true,
      showChannel: true,
      showDescription: true,
      headerLayout: 'vertical',
      buttonStyle: 'outlined',
      borderStyle: 'full'
    }
  },
  
  // ====== CONTENT TYPE TEMPLATES ======
  contentTypeTemplates: {
    text: {
      name: "Simple Text",
      description: "Basic text message with variables",
      icon: "💬",
      enabled: true,
      defaultValues: {},
      customFields: []
    },
    
    richCard: {
      name: "Rich Card", 
      description: "Interactive card with image and buttons",
      icon: "🃏",
      enabled: true,
      defaultValues: {
        cardTitle: "🎉 Special Offer!",
        cardSubtitle: "Limited time - don't miss out!",
        cardBody: "Get exclusive deals on all our products.",
        cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        interactiveType: "buttons"
      },
      customFields: [
        { name: "cardTitle", type: "text", label: "Card Title", required: true },
        { name: "cardSubtitle", type: "text", label: "Card Subtitle" },
        { name: "cardBody", type: "textarea", label: "Card Body Text" },
        { name: "cardImage", type: "url", label: "Card Image URL" }
      ]
    },
    
    carousel: {
      name: "Product Carousel",
      description: "Multiple scrollable product cards", 
      icon: "🎠",
      enabled: true,
      defaultValues: {
        carouselBody: "Check out our featured products!"
      },
      customFields: [
        { name: "carouselBody", type: "textarea", label: "Carousel Description" }
      ]
    },
    
    media: {
      name: "Media Message",
      description: "Image, video or document with caption",
      icon: "📷", 
      enabled: false, // Disabled by default in this sample
      defaultValues: {
        mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        mediaType: "image",
        caption: "Check this out!"
      },
      customFields: [
        { name: "mediaUrl", type: "url", label: "Media URL", required: true },
        { name: "caption", type: "textarea", label: "Caption Text" }
      ]
    },
    
    listMessage: {
      name: "Selection List",
      description: "Interactive list with selectable options",
      icon: "📋",
      enabled: false, // Disabled by default in this sample
      defaultValues: {
        listHeader: "Choose an Option",
        listFooter: "Tap to select",
        buttonText: "View Options"
      },
      customFields: [
        { name: "listHeader", type: "text", label: "List Header", required: true },
        { name: "listFooter", type: "text", label: "List Footer" },
        { name: "buttonText", type: "text", label: "Button Text" }
      ]
    }
  },
  
  // ====== UI TEXT CUSTOMIZATION ======
  uiText: {
    sections: {
      phoneNumber: "CUSTOMER PHONE",
      demoActions: "QUICK ACTIONS", 
      customerJourney: "CUSTOMER EXPERIENCE FLOW",
      messageTemplates: "Message Library",
      virtualPhone: "PREVIEW PHONE",
      resultsLog: "ACTIVITY LOG"
    },
    
    buttons: {
      completeJourney: "🚀 Run Complete Flow",
      clearResults: "🗑️ Clear Log",
      clearLog: "Clear",
      editMessage: "Edit",
      cancelEdit: "Cancel",
      saveChanges: "Save",
      addVariable: "+ Add",
      cancel: "Cancel",
      add: "Add"
    },
    
    forms: {
      phoneNumberPlaceholder: "+1 (555) 123-4567",
      messageContentLabel: "Message:",
      messagePreviewLabel: "Preview:",
      variablesLabel: "Dynamic Variables:",
      variableNamePlaceholder: "Variable name",
      variableValuePlaceholder: "Value",
      noVariablesText: "No variables yet. Click 'Add' to create one."
    },
    
    twilioStatus: {
      title: "TWILIO CONNECTION STATUS",
      mode: "Mode:",
      accountSid: "Account:",
      phoneNumber: "Number:",
      demoMode: "🎭 DEMO MODE",
      liveMode: "📱 LIVE MODE", 
      demoModeDescription: "💡 Demo mode active - messages will appear in virtual phone."
    },
    
    virtualPhone: {
      tapToWake: "Tap to wake up",
      demoModeDisabled: "Demo mode - input disabled",
      noMessagesYet: "No messages yet",
      messagesWillAppearHere: "Messages will appear here",
      contactInfo: "Contact Details",
      back: "← Back",
      call: "Call",
      message: "Text",
      email: "Email",
      notes: "Notes",
      recentActivity: "Recent Activity",
      noRecentMessages: "No recent messages",
      sendTextMessage: "Send a text message"
    },
    
    whatsapp: {
      headerTitle: "WhatsApp Business",
      online: "Online now",
      offline: "Last seen recently", 
      about: "About Us",
      businessInfo: "Business Info",
      website: "mycompany.com",
      email: "hello@mycompany.com",
      location: "Online Business",
      aboutDescription: "Welcome to My Company! Your trusted business partner.",
      typeMessage: "Type a message",
      chatsTitle: "WhatsApp",
      contactInfoTitle: "Contact Info",
      video: "Video"
    },
    
    results: {
      noMessages: "No activity yet. Send a message to get started.",
      messageReceived: "📱 Phone received:",
      sending: "🚀 Sending",
      sentSuccessfully: "✅ delivered",
      failed: "❌ Failed:",
      messageDelivered: "📱 Message delivered to virtual phone",
      messageContent: "📋 Message Content:",
      demoMode: "📋 Demo Mode:",
      sequenceStarting: "🎭 Starting message flow",
      waiting: "⏳ Waiting",
      sequenceCompleted: "✅ Flow completed!",
      updated: "📝 Updated template:"
    }
  },
  
  // ====== SAMPLE MESSAGE TEMPLATES ======
  messageTemplates: [
    {
      id: "welcome",
      title: "Welcome Message",
      description: "Greet new customers",
      emoji: "👋",
      category: "marketing",
      messageContent: "Welcome to {{brandName}}, {{customerName}}! 🎉 We're excited to have you. Reply STOP to opt out.",
      variables: { customerName: "John" },
      apiAction: "welcome",
      buttonText: "Send Welcome"
    },
    
    {
      id: "promotion",
      title: "Special Offer",
      description: "Limited time deals",
      emoji: "🎁",
      category: "marketing", 
      messageContent: "🔥 Exclusive for you! Get {{discount}}% OFF everything at {{brandName}}. Use code: {{promoCode}}. Shop now: {{shopUrl}}",
      variables: { 
        discount: 25,
        promoCode: "SAVE25", 
        shopUrl: "https://mycompany.com/sale"
      },
      apiAction: "promotion",
      buttonText: "Send Offer"
    },
    
    {
      id: "order-update",
      title: "Order Status",
      description: "Keep customers informed",
      emoji: "📦",
      category: "transactional",
      messageContent: "Your {{brandName}} order #{{orderNumber}} is {{status}}! Track your package: {{trackingUrl}}",
      variables: { 
        orderNumber: "12345",
        status: "shipped",
        trackingUrl: "https://mycompany.com/track"
      },
      apiAction: "order-update", 
      buttonText: "Send Update"
    },
    
    {
      id: "appointment",
      title: "Appointment Reminder", 
      description: "Reduce no-shows",
      emoji: "📅",
      category: "notification",
      messageContent: "Hi {{customerName}}! Reminder: Your {{serviceType}} appointment with {{brandName}} is {{appointmentTime}}. Reply C to confirm.",
      variables: {
        customerName: "John",
        serviceType: "consultation", 
        appointmentTime: "tomorrow at 2PM"
      },
      apiAction: "appointment",
      buttonText: "Send Reminder"
    },
    
    {
      id: "verification",
      title: "Security Code",
      description: "Account verification",
      emoji: "🔐", 
      category: "authentication",
      messageContent: "Your {{brandName}} verification code: {{verificationCode}}. Valid for 10 minutes. Never share this code.",
      variables: { verificationCode: "123456" },
      apiAction: "verification",
      buttonText: "Send Code"
    },

    // ====== VOICE-SPECIFIC TEMPLATES ======
    {
      id: "outbound-call",
      title: "Outbound Sales Call",
      description: "Make a sales call to prospect",
      emoji: "📞",
      category: "marketing",
      messageContent: "Hello! This is a call from {{brandName}}. We have an exciting offer for you about our services.",
      variables: {},
      apiAction: "outbound-call",
      buttonText: "Make Sales Call"
    },
    
    {
      id: "appointment-reminder-call",
      title: "Appointment Reminder Call",
      description: "Call customer about upcoming appointment",
      emoji: "📅",
      category: "notification",
      messageContent: "Hi! This is {{brandName}} calling to remind you about your {{serviceType}} appointment scheduled for {{appointmentTime}}.",
      variables: {
        serviceType: "consultation",
        appointmentTime: "tomorrow at 2PM"
      },
      apiAction: "appointment-call",
      buttonText: "Call for Reminder"
    },
    
    {
      id: "support-callback",
      title: "Support Callback",
      description: "Return customer support call",
      emoji: "🛟",
      category: "transactional",
      messageContent: "Hello! This is {{brandName}} support calling you back regarding your recent inquiry. How can we help you today?",
      variables: {},
      apiAction: "support-callback",
      buttonText: "Call Customer Back"
    },
    
    {
      id: "order-confirmation-call",
      title: "Order Confirmation Call",
      description: "Call to confirm order details",
      emoji: "📦",
      category: "transactional",
      messageContent: "Hi! This is {{brandName}} calling to confirm your recent order #{{orderNumber}}. Your order total is ${{orderTotal}}.",
      variables: {
        orderNumber: "12345",
        orderTotal: "99.99"
      },
      apiAction: "order-confirmation-call",
      buttonText: "Confirm Order"
    },
    
    {
      id: "survey-call",
      title: "Customer Survey Call",
      description: "Call for customer feedback",
      emoji: "📊",
      category: "marketing",
      messageContent: "Hello! This is {{brandName}}. We'd love to get your feedback on our recent service. Do you have 2 minutes for a quick survey?",
      variables: {},
      apiAction: "survey-call",
      buttonText: "Conduct Survey"
    }
  ],
  
  // ====== FEATURE DEMO CARDS ======
  featureCards: [
    // Sample feature cards - you can customize these or add your own
    {
      id: "sms-delivery-tracking",
      title: "Message Delivery Tracking",
      description: "Real-time message status updates with webhooks",
      emoji: "📊",
      category: "sms-features",
      featureType: "delivery-tracking",
      channel: "sms",
      demoConfig: {
        mockBehavior: "Show delivery status progression: queued → sent → delivered",
        virtualPhoneEffect: "Display delivery confirmation with timestamp",
        apiResponse: {
          status: "delivered",
          dateUpdated: new Date().toISOString(),
          errorCode: null
        },
        timeDelay: 2000,
        persistEffect: true
      },
      technicalDetails: {
        apiEndpoint: "/Messages/{MessageSid}",
        requiredParams: ["StatusCallback"],
        twilioFeature: "Message Status Callbacks",
        documentation: "https://www.twilio.com/docs/messaging/webhooks"
      },
      messageContent: "🚀 Testing delivery tracking! You'll see status updates: queued → sent → delivered.",
      variables: {},
      apiAction: "delivery-tracking-demo",
      buttonText: "Demo Delivery Tracking",
      enabled: true
    },
    
    {
      id: "voice-text-to-speech",
      title: "Text-to-Speech (TTS)",
      description: "Convert text to natural-sounding speech",
      emoji: "🗣️",
      category: "voice-features",
      featureType: "text-to-speech",
      channel: "voice",
      demoConfig: {
        mockBehavior: "Play synthesized speech with voice selection options",
        virtualPhoneEffect: "Show incoming call with TTS playback interface",
        apiResponse: {
          twimlResponse: `<Response><Say voice="alice">Hello from My Company! Your order has been processed successfully.</Say></Response>`,
          voice: "alice",
          language: "en-US"
        },
        timeDelay: 1000,
        persistEffect: false
      },
      technicalDetails: {
        apiEndpoint: "/Calls.json",
        requiredParams: ["TwiML", "Voice"],
        twilioFeature: "Text-to-Speech (TTS)",
        documentation: "https://www.twilio.com/docs/voice/twiml/say"
      },
      messageContent: "🎙️ Converting text to speech: 'Hello from My Company! Your order has been processed successfully.' Using voice: Alice",
      variables: {
        voice: "alice",
        message: "Hello from My Company! Your order has been processed successfully."
      },
      apiAction: "tts-demo",
      buttonText: "Demo Text-to-Speech",
      enabled: true
    }
  ],
  
  // ====== VIRTUAL PHONE SETUP ======
  virtualPhone: {
    deviceName: "iPhone 15 Pro",
    carrierName: "My Company Mobile",
    signalStrength: 4,           // 1-4 bars
    batteryLevel: 95,            // 0-100%
    currentTime: "2:30 PM",
    defaultApp: "messages",      // Which app opens by default
    phoneNumber: "+1 (555) 123-4567",
    contactName: "My Company",   // How your business appears in contacts
    messageTheme: "imessage",    // Message bubble style
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
    ],
    voiceSettings: {
      autoEndCalls: false,
      callDurationSeconds: undefined,
      showCallHistory: true,
      maxCallHistoryItems: 10,
      enableMockContacts: true,
      mockContacts: [
        {
          id: '1',
          name: 'Demo Customer',
          number: '+1 (555) 123-4567',
          avatar: '👤',
          company: 'My Company'
        },
        {
          id: '2', 
          name: 'Support Team',
          number: '+1 (555) 987-6543',
          avatar: '🛟',
          company: 'Help Desk'
        }
      ]
    }
  },
  
  // ====== MESSAGE THEMES ======
  messageThemes: [
    {
      id: "imessage",
      name: "iMessage Style",
      type: "imessage",
      bubbleColor: "#007AFF",      // Blue bubbles
      textColor: "#FFFFFF",        // White text
      backgroundColor: "#F2F2F7",  // Light gray background
      borderRadius: "18px",        // Rounded bubbles
      fontFamily: "system-ui",
      showTimestamp: true,
      showDeliveryStatus: true
    },
    {
      id: "business",
      name: "Professional",
      type: "sms",
      bubbleColor: "#4F46E5",      // Purple bubbles  
      textColor: "#FFFFFF",
      backgroundColor: "#F8FAFC",
      borderRadius: "12px",
      fontFamily: "system-ui", 
      showTimestamp: true,
      showDeliveryStatus: false
    }
  ],
  
  // ====== JOURNEY FLOW CONFIGURATION ======
  journeySteps: [
    {
      id: "welcome",
      title: "Welcome",
      description: "Greet new customers",
      icon: "👋",
      messageIds: ["welcome"]
    },
    {
      id: "promotion",
      title: "Promotion",
      description: "Special offers & deals",
      icon: "🎁",
      messageIds: ["promotion"]
    },
    {
      id: "order-flow",
      title: "Order Updates",
      description: "Purchase to delivery",
      icon: "📦",
      messageIds: ["order-update"]
    },
    {
      id: "appointment",
      title: "Appointments",
      description: "Booking confirmations",
      icon: "📅",
      messageIds: ["appointment"]
    },
    {
      id: "security",
      title: "Security",
      description: "Account verification",
      icon: "🔐",
      messageIds: ["verification"]
    }
  ],
  
  // ====== RICH MESSAGE TYPES ======
  richMessageTypes: {
    text: {
      id: "text",
      name: "Simple Text",
      description: "Basic text message with variables",
      icon: "💬",
      available: ["sms", "rcs", "whatsapp"],
      customizable: {
        variables: true
      }
    },
    
    media: {
      id: "media",
      name: "Media Message",
      description: "Image, video, audio, or document with caption",
      icon: "📷",
      available: ["rcs", "whatsapp"],
      customizable: {
        variables: true,
        mediaUrl: true,
        mediaType: true,
        caption: true
      },
      mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      mediaType: "image",
      caption: "Check out our latest products!"
    },
    
    richCard: {
      id: "richCard",
      name: "Rich Interactive Card",
      description: "Card with image, text, and action buttons",
      icon: "🃏",
      available: ["rcs", "whatsapp"],
      customizable: {
        variables: true,
        cardTitle: true,
        cardSubtitle: true,
        cardImage: true,
        buttons: true,
        quickReplies: true
      },
      cardTitle: "🎉 Special Offer!",
      cardSubtitle: "Limited time - don't miss out!",
      cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      buttons: [
        { title: "Shop Now", type: "url", url: "https://mycompany.com/shop" },
        { title: "Call Us", type: "phone", payload: "+1-555-123-4567" }
      ],
      quickReplies: [
        { title: "Yes, interested", payload: "interested" },
        { title: "Not now", payload: "not_now" },
        { title: "Tell me more", payload: "more_info" }
      ]
    },
    
    carousel: {
      id: "carousel",
      name: "Product Carousel",
      description: "Multiple scrollable product cards",
      icon: "🎠",
      available: ["rcs", "whatsapp"],
      customizable: {
        variables: true,
        items: true,
        cardCount: true
      },
      maxCards: 10,
      items: [
        {
          id: "1",
          title: "Premium Package",
          subtitle: "Best value for your business",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          buttons: [
            { title: "Buy Now", type: "url", url: "https://mycompany.com/premium" },
            { title: "Learn More", type: "reply", payload: "premium_info" }
          ]
        },
        {
          id: "2",
          title: "Starter Package",
          subtitle: "Perfect for getting started",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          buttons: [
            { title: "Buy Now", type: "url", url: "https://mycompany.com/starter" },
            { title: "Learn More", type: "reply", payload: "starter_info" }
          ]
        }
      ]
    },
    
    listMessage: {
      id: "listMessage",
      name: "Selection List",
      description: "Interactive list with selectable options",
      icon: "📋",
      available: ["whatsapp"],
      customizable: {
        variables: true,
        header: true,
        footer: true,
        sections: true,
        buttonText: true
      },
      header: "Choose Your Service",
      footer: "Select an option to continue",
      buttonText: "View Services",
      sections: [
        {
          title: "Services",
          rows: [
            { id: "consulting", title: "Consulting", description: "Expert business consulting" },
            { id: "support", title: "Support", description: "Technical support services" }
          ]
        },
        {
          title: "Products",
          rows: [
            { id: "software", title: "Software", description: "Business software solutions" },
            { id: "training", title: "Training", description: "Professional training programs" }
          ]
        }
      ]
    },
    
    location: {
      id: "location",
      name: "Location Share",
      description: "Share geographic location",
      icon: "📍",
      available: ["whatsapp"],
      customizable: {
        variables: true,
        latitude: true,
        longitude: true,
        label: true
      },
      latitude: 37.7749,
      longitude: -122.4194,
      label: "Business Location"
    },
    
    catalog: {
      id: "catalog",
      name: "Product Catalog",
      description: "Showcase product catalog",
      icon: "🛍️",
      available: ["whatsapp"],
      customizable: {
        variables: true,
        catalogId: true,
        title: true,
        body: true,
        thumbnailItemId: true
      },
      catalogId: "SAMPLE_CATALOG_123",
      title: "Our Product Collection",
      body: "Browse our latest products and services",
      thumbnailItemId: "featured_item"
    },
    
    authentication: {
      id: "authentication",
      name: "2FA Verification",
      description: "Two-factor authentication codes",
      icon: "🔐",
      available: ["whatsapp"],
      customizable: {
        variables: true,
        otpCode: true,
        addSecurityRecommendation: true,
        codeExpirationMinutes: true,
        copyCodeText: true
      },
      otpCode: "567890",
      addSecurityRecommendation: true,
      codeExpirationMinutes: 5,
      copyCodeText: "Copy Code"
    }
  },
  
  // ====== API CONFIGURATION ======
  apiConfig: {
    enableRiskCheck: true,
    defaultMessageIntent: "marketing",
    enableConsentAPI: true,
    enableContactAPI: true
  }
};