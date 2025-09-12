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
  selectedContentType?: 'text' | 'media' | 'richCard' | 'carousel' | 'listMessage' | 'location' | 'catalog' | 'authentication';
  richMessageConfig?: Record<string, unknown>;
  contentTypeConfig?: {
    interactiveType?: 'buttons' | 'quickReplies';
    cardImage?: string;
    cardTitle?: string;
    cardSubtitle?: string;
    cardBody?: string;
    buttons?: Array<{ title: string; type: string; payload?: string }>;
    quickReplies?: Array<{ title: string; payload?: string }>;
    carouselItems?: Array<{ id: string; image: string; title: string; subtitle: string; buttons: Array<{ title: string; type: string }> }>;
    carouselBody?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'audio' | 'document';
    caption?: string;
    listHeader?: string;
    listFooter?: string;
    buttonText?: string;
    listSections?: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>;
  };
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'sms-features' | 'rcs-features' | 'whatsapp-features' | 'voice-features';
  featureType: string; // e.g., 'delivery-tracking', 'smart-encoding', 'rich-carousel', 'text-to-speech'
  channel: 'sms' | 'rcs' | 'whatsapp' | 'voice';
  demoConfig: {
    mockBehavior: string; // How to simulate this feature in demo
    virtualPhoneEffect: string; // What visual effect to show on phone
    apiResponse?: Record<string, unknown>; // Mock API response
    timeDelay?: number; // Delay before showing effect (ms)
    persistEffect?: boolean; // Whether effect stays visible
    customMessage?: string; // Custom message for this feature demo
    customVariables?: Record<string, string | number | boolean | string[] | number[]>; // Feature-specific variables
    mediaUrl?: string; // For media features
    mediaType?: 'image' | 'video' | 'audio' | 'document'; // Media type
    voiceSettings?: { // For voice features
      voice?: string;
      language?: string;
      speed?: number;
      pitch?: number;
    };
    interactiveElements?: { // For interactive features
      buttons?: Array<{ title: string; type: string; payload?: string; url?: string }>;
      quickReplies?: Array<{ title: string; payload?: string }>;
      listItems?: Array<{ id: string; title: string; description?: string }>;
    };
  };
  technicalDetails: {
    apiEndpoint?: string;
    requiredParams?: string[];
    twilioFeature: string; // Official Twilio feature name
    documentation?: string; // Link to Twilio docs
    codeExample?: string; // Code snippet example
    limitations?: string[]; // Known limitations
  };
  messageContent: string;
  variables?: Record<string, string | number>;
  apiAction: string;
  buttonText: string;
  enabled: boolean;
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
  voiceSettings: {
    autoEndCalls: boolean;
    callDurationSeconds?: number;
    showCallHistory: boolean;
    maxCallHistoryItems: number;
    enableMockContacts: boolean;
    mockContacts: Array<{
      id: string;
      name: string;
      number: string;
      avatar: string;
      company?: string;
    }>;
  };
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
  
  // Feature Configuration
  features: {
    enableRichMessaging: boolean;
    enableVirtualPhone: boolean;
    enableConfigPanel: boolean;
    enableJourneyFlow: boolean;
    enableChannelSelection: boolean;
    availableChannels: ('sms' | 'rcs' | 'whatsapp' | 'voice')[];
    defaultChannel: 'sms' | 'rcs' | 'whatsapp' | 'voice';
    enableContentTypes: boolean;
    availableContentTypes: ('text' | 'media' | 'richCard' | 'carousel' | 'listMessage' | 'location' | 'catalog' | 'pay' | 'authentication')[];
    voiceTemplateIds: string[];
    phoneSettings: {
      defaultPhoneNumber: string;
      enableRealCalls: boolean;
      callAutoEndTime?: number;
    };
  };
  
  // Layout Configuration
  layout: {
    gridColumns: number;
    showCategoryFilter: boolean;
    showTimestamps: boolean;
    showDeliveryStatus: boolean;
    compactMode: boolean;
    showPreviewSection: boolean;
  };
  
  // Card Layout Templates
  cardLayouts: {
    default: {
      showEmoji: boolean;
      showCategory: boolean;
      showChannel: boolean;
      showDescription: boolean;
      headerLayout: 'horizontal' | 'vertical';
      buttonStyle: 'filled' | 'outlined' | 'text';
      borderStyle: 'left' | 'top' | 'full' | 'none';
    };
    compact: {
      showEmoji: boolean;
      showCategory: boolean;
      showChannel: boolean;
      showDescription: boolean;
      headerLayout: 'horizontal' | 'vertical';
      buttonStyle: 'filled' | 'outlined' | 'text';
      borderStyle: 'left' | 'top' | 'full' | 'none';
    };
    detailed: {
      showEmoji: boolean;
      showCategory: boolean;
      showChannel: boolean;
      showDescription: boolean;
      headerLayout: 'horizontal' | 'vertical';
      buttonStyle: 'filled' | 'outlined' | 'text';
      borderStyle: 'left' | 'top' | 'full' | 'none';
    };
  };
  
  // Content Type Templates
  contentTypeTemplates: {
    [key: string]: {
      name: string;
      description: string;
      icon: string;
      enabled: boolean;
      defaultValues: Record<string, string | number | boolean>;
      customFields?: Array<{
        name: string;
        type: 'text' | 'textarea' | 'url' | 'number' | 'select' | 'boolean';
        label: string;
        placeholder?: string;
        options?: string[];
        defaultValue?: string | number | boolean;
        required?: boolean;
      }>;
    };
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
  
  // Feature Demo Cards
  featureCards: FeatureCard[];
  
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
      customizable: {
        variables: boolean;
      };
    };
    media: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      customizable: {
        variables: boolean;
        mediaUrl: boolean;
        mediaType: boolean;
        caption: boolean;
      };
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'audio' | 'document';
      caption?: string;
    };
    richCard: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      customizable: {
        variables: boolean;
        cardTitle: boolean;
        cardSubtitle: boolean;
        cardImage: boolean;
        buttons: boolean;
        quickReplies: boolean;
      };
      cardTitle?: string;
      cardSubtitle?: string;
      cardImage?: string;
      buttons?: Array<{ title: string; type: 'url' | 'phone' | 'reply'; payload?: string; url?: string }>;
      quickReplies?: Array<{ title: string; payload?: string }>;
    };
    carousel: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      customizable: {
        variables: boolean;
        items: boolean;
        cardCount: boolean;
      };
      maxCards?: number;
      items?: Array<{
        id: string;
        title: string;
        subtitle?: string;
        image?: string;
        buttons?: Array<{ title: string; type: 'url' | 'phone' | 'reply'; payload?: string; url?: string }>;
      }>;
    };
    listMessage: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('sms' | 'rcs' | 'whatsapp')[];
      customizable: {
        variables: boolean;
        header: boolean;
        footer: boolean;
        sections: boolean;
        buttonText: boolean;
      };
      header?: string;
      footer?: string;
      buttonText?: string;
      sections?: Array<{
        title: string;
        rows: Array<{ id: string; title: string; description?: string }>;
      }>;
    };
    location: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('whatsapp')[];
      customizable: {
        variables: boolean;
        latitude: boolean;
        longitude: boolean;
        label: boolean;
      };
      latitude?: number;
      longitude?: number;
      label?: string;
    };
    catalog: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('whatsapp')[];
      customizable: {
        variables: boolean;
        catalogId: boolean;
        title: boolean;
        body: boolean;
        thumbnailItemId: boolean;
      };
      catalogId?: string;
      title?: string;
      body?: string;
      thumbnailItemId?: string;
    };
    authentication: {
      id: string;
      name: string;
      description: string;
      icon: string;
      available: ('whatsapp')[];
      customizable: {
        variables: boolean;
        otpCode: boolean;
        addSecurityRecommendation: boolean;
        codeExpirationMinutes: boolean;
        copyCodeText: boolean;
      };
      otpCode?: string;
      addSecurityRecommendation?: boolean;
      codeExpirationMinutes?: number;
      copyCodeText?: string;
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
  
  // Feature Configuration
  features: {
    enableRichMessaging: true,
    enableVirtualPhone: true,
    enableConfigPanel: true,
    enableJourneyFlow: true,
    enableChannelSelection: true,
    availableChannels: ['sms', 'rcs', 'whatsapp', 'voice'],
    defaultChannel: 'sms',
    enableContentTypes: true,
    availableContentTypes: ['text', 'media', 'richCard', 'carousel', 'listMessage', 'location', 'catalog', 'authentication'],
    voiceTemplateIds: [
      'interactive-ivr', 
      'appointment-reminder-voice', 
      'delivery-notification-voice', 
      'voice-survey-interactive', 
      'payment-reminder-voice', 
      'emergency-alert-voice', 
      'conference-call-voice', 
      'voice-authentication'
    ],
    phoneSettings: {
      defaultPhoneNumber: '+1 (555) 123-4567',
      enableRealCalls: true,
      callAutoEndTime: undefined // undefined = manual hang up only
    }
  },
  
  // Layout Configuration
  layout: {
    gridColumns: 2,
    showCategoryFilter: true,
    showTimestamps: true,
    showDeliveryStatus: true,
    compactMode: false,
    showPreviewSection: true
  },
  
  // Card Layout Templates
  cardLayouts: {
    default: {
      showEmoji: true,
      showCategory: true,
      showChannel: true,
      showDescription: true,
      headerLayout: 'horizontal',
      buttonStyle: 'filled',
      borderStyle: 'left'
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
  
  // Content Type Templates
  contentTypeTemplates: {
    text: {
      name: "Text Message",
      description: "Simple text with variables",
      icon: "💬",
      enabled: true,
      defaultValues: {},
      customFields: []
    },
    media: {
      name: "Media Message",
      description: "Image, video, audio or document",
      icon: "📷",
      enabled: true,
      defaultValues: {
        mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        mediaType: "image",
        caption: "Check out our latest products!"
      },
      customFields: [
        { name: "mediaUrl", type: "url", label: "Media URL", placeholder: "https://example.com/image.jpg", required: true },
        { name: "mediaType", type: "select", label: "Media Type", options: ["image", "video", "audio", "document"], defaultValue: "image" },
        { name: "caption", type: "textarea", label: "Caption", placeholder: "Optional caption text" }
      ]
    },
    richCard: {
      name: "Rich Card",
      description: "Interactive card with buttons",
      icon: "🃏",
      enabled: true,
      defaultValues: {
        cardTitle: "Special Offer!",
        cardSubtitle: "Limited time deal - Don't miss out!",
        cardBody: "Get exclusive access to premium items with amazing discounts.",
        cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        interactiveType: "buttons"
      },
      customFields: [
        { name: "cardTitle", type: "text", label: "Card Title", placeholder: "Card title", required: true },
        { name: "cardSubtitle", type: "text", label: "Card Subtitle", placeholder: "Card subtitle" },
        { name: "cardBody", type: "textarea", label: "Card Body", placeholder: "Optional body text" },
        { name: "cardImage", type: "url", label: "Card Image URL", placeholder: "https://example.com/card-image.jpg" },
        { name: "interactiveType", type: "select", label: "Interactive Type", options: ["buttons", "quickReplies"], defaultValue: "buttons" }
      ]
    },
    carousel: {
      name: "Carousel Cards",
      description: "Multiple scrollable cards",
      icon: "🎠",
      enabled: true,
      defaultValues: {
        carouselBody: "Browse our featured collection of developer merchandise."
      },
      customFields: [
        { name: "carouselBody", type: "textarea", label: "Carousel Body", placeholder: "Optional introduction text" }
      ]
    },
    listMessage: {
      name: "List Message",
      description: "Selectable list with sections",
      icon: "📋",
      enabled: true,
      defaultValues: {
        listHeader: "Choose Your Product Category",
        listFooter: "Select an option to continue",
        buttonText: "View Products"
      },
      customFields: [
        { name: "listHeader", type: "text", label: "List Header", placeholder: "Choose an option", required: true },
        { name: "listFooter", type: "text", label: "List Footer", placeholder: "Optional footer text" },
        { name: "buttonText", type: "text", label: "Button Text", placeholder: "View Options", required: true }
      ]
    },
    location: {
      name: "Location Message",
      description: "Share a location pin with optional label",
      icon: "📍",
      enabled: true,
      defaultValues: {
        latitude: 37.7749,
        longitude: -122.4194,
        label: "San Francisco, CA"
      },
      customFields: [
        { name: "latitude", type: "number", label: "Latitude", placeholder: "37.7749", required: true },
        { name: "longitude", type: "number", label: "Longitude", placeholder: "-122.4194", required: true },
        { name: "label", type: "text", label: "Location Label", placeholder: "Business Name or Description" }
      ]
    },
    catalog: {
      name: "Product Catalog",
      description: "Interactive product catalog with shopping features",
      icon: "🛍️",
      enabled: true,
      defaultValues: {
        catalogId: "CATALOG_ID_123",
        title: "Shop Our Collection",
        body: "Browse our premium developer merchandise",
        thumbnailItemId: "item_001"
      },
      customFields: [
        { name: "catalogId", type: "text", label: "Catalog ID", placeholder: "CATALOG_ID_123", required: true },
        { name: "title", type: "text", label: "Catalog Title", placeholder: "Shop Our Collection" },
        { name: "body", type: "textarea", label: "Catalog Description", placeholder: "Browse our collection..." },
        { name: "thumbnailItemId", type: "text", label: "Thumbnail Item ID", placeholder: "item_001" }
      ]
    },
    authentication: {
      name: "WhatsApp Authentication",
      description: "WhatsApp-approved OTP with copy button",
      icon: "🔐",
      enabled: true,
      defaultValues: {
        otpCode: "123456",
        addSecurityRecommendation: true,
        codeExpirationMinutes: 10,
        copyCodeText: "Copy Code"
      },
      customFields: [
        { name: "otpCode", type: "text", label: "OTP Code", placeholder: "123456", required: true },
        { name: "addSecurityRecommendation", type: "boolean", label: "Add Security Warning", defaultValue: true },
        { name: "codeExpirationMinutes", type: "number", label: "Expiration (minutes)", placeholder: "10" },
        { name: "copyCodeText", type: "text", label: "Copy Button Text", placeholder: "Copy Code" }
      ]
    }
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
    },

    // ====== TWILIO VOICE DEMOS ======
    {
      id: "interactive-ivr",
      title: "Interactive Voice Response (IVR)",
      description: "Smart phone menus with voice prompts and keypad input",
      emoji: "🎤",
      category: "transactional",
      messageContent: "Thank you for calling {{brandName}}! For Sales, press 1. For Support, press 2. For Billing, press 3. Or stay on the line to speak with an operator.",
      variables: {},
      apiAction: "ivr-demo",
      buttonText: "Demo IVR System"
    },
    
    {
      id: "appointment-reminder-voice",
      title: "Voice Appointment Reminder",
      description: "Automated appointment reminders with confirmation options",
      emoji: "📅",
      category: "notification",
      messageContent: "Hello! This is {{brandName}} calling to remind you of your {{appointmentType}} appointment scheduled for {{appointmentDate}} at {{appointmentTime}}. Press 1 to confirm, or press 2 to reschedule.",
      variables: {
        appointmentType: "consultation",
        appointmentDate: "tomorrow",
        appointmentTime: "2:30 PM"
      },
      apiAction: "appointment-reminder-voice",
      buttonText: "Send Voice Reminder"
    },

    {
      id: "delivery-notification-voice",
      title: "Delivery Status Call",
      description: "Real-time delivery updates via voice calls",
      emoji: "📦",
      category: "transactional", 
      messageContent: "Hi! This is {{brandName}} with an update on order {{orderNumber}}. Your {{orderItems}} will be delivered today between {{deliveryWindow}}. Press 1 if someone will be home, or press 2 to reschedule.",
      variables: {
        orderNumber: "12345",
        orderItems: "Owl Hoodie and Coffee Mug",
        deliveryWindow: "2-4 PM"
      },
      apiAction: "delivery-notification-voice",
      buttonText: "Call About Delivery"
    },

    {
      id: "voice-survey-interactive",
      title: "Interactive Voice Survey",
      description: "Collect customer feedback through voice and keypad",
      emoji: "📊",
      category: "marketing",
      messageContent: "Hello! This is {{brandName}}. We'd love your feedback! On a scale of 1 to 5, how would you rate your recent experience? Press 1 for poor, up to 5 for excellent. Or press 9 to leave a voice message.",
      variables: {},
      apiAction: "voice-survey-interactive",
      buttonText: "Conduct Voice Survey"
    },

    {
      id: "payment-reminder-voice",
      title: "Payment Due Notification",
      description: "Automated payment reminders with pay-by-phone option",
      emoji: "💳",
      category: "transactional",
      messageContent: "This is {{brandName}} calling about your account. Your payment of ${{amount}} was due on {{dueDate}}. Press 1 to pay by phone now, or press 2 to set up a payment plan.",
      variables: {
        amount: "99.50",
        dueDate: "January 15th"
      },
      apiAction: "payment-reminder-voice",
      buttonText: "Payment Reminder Call"
    },

    {
      id: "emergency-alert-voice",
      title: "Emergency Voice Alert",
      description: "Mass voice notifications for urgent alerts and emergencies",
      emoji: "🚨",
      category: "notification",
      messageContent: "This is an emergency notification from {{brandName}}. {{alertMessage}} This is not a test. Please follow all safety protocols immediately. This message will repeat.",
      variables: {
        alertMessage: "A severe weather warning is in effect for your area until 8 PM tonight."
      },
      apiAction: "emergency-alert-voice",
      buttonText: "Send Emergency Alert"
    },

    {
      id: "conference-call-voice",
      title: "Conference Call Invitation",
      description: "Automated conference call setup and participant connection",
      emoji: "👥",
      category: "transactional",
      messageContent: "Welcome to the {{brandName}} conference call for {{meetingTopic}}. You will be connected shortly. Press star 6 to mute or unmute yourself during the meeting.",
      variables: {
        meetingTopic: "Q4 Planning Session"
      },
      apiAction: "conference-call-voice",
      buttonText: "Start Conference Call"
    },

    {
      id: "voice-authentication",
      title: "Voice Security Verification",
      description: "Two-factor authentication via voice calls",
      emoji: "🔐",
      category: "authentication",
      messageContent: "This is {{brandName}} security. We've detected a login attempt on your account. Your verification code is {{verificationCode}}. Press 1 to approve this login, or press 2 to deny and secure your account.",
      variables: {
        verificationCode: "7-4-9-2-1-8"
      },
      apiAction: "voice-authentication",
      buttonText: "Voice Security Check"
    }
  ],
  
  // Feature Demo Cards - SMS Features
  featureCards: [
    // === SMS FEATURE CARDS ===
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
        persistEffect: true,
        customMessage: "🚀 Testing delivery tracking! You'll see status updates: queued → sent → delivered.",
        customVariables: {
          trackingEnabled: true,
          statusCallbackUrl: "https://your-domain.com/sms/status",
          deliveryStages: 3
        }
      },
      technicalDetails: {
        apiEndpoint: "/Messages/{MessageSid}",
        requiredParams: ["StatusCallback"],
        twilioFeature: "Message Status Callbacks",
        documentation: "https://www.twilio.com/docs/messaging/webhooks",
        codeExample: `const message = await client.messages.create({
  body: 'Hello from Twilio!',
  from: '+1234567890',
  to: '+0987654321',
  statusCallback: 'https://your-domain.com/sms/status'
});`,
        limitations: [
          "Webhooks require publicly accessible endpoint",
          "Status callbacks may be delayed depending on carrier",
          "Not all carriers support delivery receipts"
        ]
      },
      messageContent: "🚀 Testing delivery tracking! You'll see status updates: queued → sent → delivered. StatusCallback URL configured for real-time updates.",
      variables: {},
      apiAction: "delivery-tracking-demo",
      buttonText: "Demo Delivery Tracking",
      enabled: true
    },
    
    {
      id: "sms-smart-encoding",
      title: "Smart Message Encoding",
      description: "Automatic character encoding detection and optimization",
      emoji: "🧠",
      category: "sms-features", 
      featureType: "smart-encoding",
      channel: "sms",
      demoConfig: {
        mockBehavior: "Show encoding type detection: GSM-7, UCS-2, or UTF-8",
        virtualPhoneEffect: "Display message with encoding information",
        apiResponse: {
          numSegments: 1,
          price: "0.0075",
          encoding: "GSM-7"
        },
        timeDelay: 1000,
        persistEffect: false,
        customMessage: "Testing smart encoding: English (GSM-7), émojis 🎉 (UCS-2), and 中文 (UTF-8). Twilio auto-detects optimal encoding!",
        customVariables: {
          encodingTypes: ["GSM-7", "UCS-2", "UTF-8"],
          characterLimit: 160,
          multilingualSupport: true
        }
      },
      technicalDetails: {
        apiEndpoint: "/Messages.json",
        requiredParams: ["Body"],
        twilioFeature: "Smart Encoding",
        documentation: "https://www.twilio.com/docs/messaging/guides/how-to-use-your-free-trial-account",
        codeExample: `const message = await client.messages.create({
  body: 'Mixed encoding: Hello 🌍 世界',
  from: '+1234567890',
  to: '+0987654321'
});`,
        limitations: [
          "GSM-7 supports basic Latin characters (160 chars per segment)",
          "UCS-2 required for emojis and special characters (70 chars per segment)",
          "UTF-8 automatic detection may increase message costs"
        ]
      },
      messageContent: "Testing smart encoding: English (GSM-7), émojis 🎉 (UCS-2), and 中文 (UTF-8). Twilio auto-detects optimal encoding!",
      variables: {},
      apiAction: "smart-encoding-demo", 
      buttonText: "Test Smart Encoding",
      enabled: true
    },

    {
      id: "sms-media-messages",
      title: "Media Messages (MMS)",
      description: "Send images, videos, audio, and documents via MMS",
      emoji: "📷",
      category: "sms-features",
      featureType: "media-messages",
      channel: "sms", 
      demoConfig: {
        mockBehavior: "Display media preview with download capability",
        virtualPhoneEffect: "Show media thumbnail in message thread",
        apiResponse: {
          numMedia: 1,
          mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
        },
        timeDelay: 1500,
        persistEffect: true,
        customMessage: "📷 Check out our latest products! High-quality image attached via MMS.",
        customVariables: {
          maxFileSize: "5MB",
          supportedFormats: ["JPEG", "PNG", "GIF", "MP4", "PDF"],
          attachmentCount: 1
        },
        mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        mediaType: "image"
      },
      technicalDetails: {
        apiEndpoint: "/Messages.json",
        requiredParams: ["MediaUrl"],
        twilioFeature: "MMS (Multimedia Messaging)",
        documentation: "https://www.twilio.com/docs/messaging/send-mms"
      },
      messageContent: "📷 Check out our latest products! High-quality image attached via MMS.",
      variables: {
        mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        mediaType: "image"
      },
      apiAction: "mms-demo",
      buttonText: "Send MMS",
      enabled: true
    },

    {
      id: "sms-link-shortening", 
      title: "Automatic Link Shortening",
      description: "Shorten URLs automatically to save characters and track clicks",
      emoji: "🔗",
      category: "sms-features",
      featureType: "link-shortening",
      channel: "sms",
      demoConfig: {
        mockBehavior: "Show original vs shortened URL with click tracking",
        virtualPhoneEffect: "Display shortened link that opens when tapped",
        apiResponse: {
          originalUrl: "https://owlshop.com/products/developer-hoodie-premium-collection",
          shortenedUrl: "https://owl.sh/h8k2j",
          clicks: 0
        },
        timeDelay: 800,
        persistEffect: true,
        customMessage: "🔥 SALE: 50% OFF Developer Hoodies! Limited time: https://owlshop.com/products/developer-hoodie-premium-collection → https://owl.sh/h8k2j (auto-shortened & tracked)",
        customVariables: {
          clickTracking: true,
          customDomain: "owl.sh",
          analyticsEnabled: true,
          maxUrlLength: 2048
        }
      },
      technicalDetails: {
        twilioFeature: "URL Shortening Service",
        documentation: "https://www.twilio.com/docs/messaging/shorten-links"
      },
      messageContent: "🔥 SALE: 50% OFF Developer Hoodies! Limited time: https://owlshop.com/products/developer-hoodie-premium-collection → https://owl.sh/h8k2j (auto-shortened & tracked)",
      variables: {
        originalUrl: "https://owlshop.com/products/developer-hoodie-premium-collection",
        shortUrl: "https://owl.sh/h8k2j"
      },
      apiAction: "link-shortening-demo",
      buttonText: "Demo Link Shortening", 
      enabled: true
    },

    // === RCS FEATURE CARDS ===
    {
      id: "rcs-rich-carousel",
      title: "Rich Media Carousel",
      description: "Interactive scrollable cards with images, text, and action buttons",
      emoji: "🎠",
      category: "rcs-features",
      featureType: "rich-carousel",
      channel: "rcs",
      demoConfig: {
        mockBehavior: "Display horizontal scrollable product cards",
        virtualPhoneEffect: "Show carousel with swipeable product cards",
        apiResponse: {
          messageType: "richCard",
          carouselCard: {
            cardContents: [
              {
                title: "Developer Hoodie",
                description: "Premium comfort for coding sessions",
                suggestions: [
                  { reply: { text: "Buy $49.99", postbackData: "buy_hoodie" } }
                ],
                media: {
                  height: "MEDIUM",
                  contentInfo: {
                    fileUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
                  }
                }
              }
            ]
          }
        },
        timeDelay: 1200,
        persistEffect: true,
        customMessage: "🛍️ Browse our developer collection! Swipe through products, tap for details, or buy instantly.",
        customVariables: {
          maxCards: 10,
          cardHeight: "MEDIUM",
          allowSwiping: true,
          showPricing: true
        },
        interactiveElements: {
          buttons: [
            { title: "Buy Now", type: "reply", payload: "buy_product" },
            { title: "Learn More", type: "reply", payload: "product_details" },
            { title: "Add to Cart", type: "reply", payload: "add_to_cart" }
          ]
        }
      },
      technicalDetails: {
        apiEndpoint: "/Messages.json",
        requiredParams: ["ContentType", "ContentSid"],
        twilioFeature: "RCS Rich Cards",
        documentation: "https://www.twilio.com/docs/rcs"
      },
      messageContent: "🛍️ Browse our developer collection! Swipe through products, tap for details, or buy instantly.",
      variables: {},
      apiAction: "rcs-carousel-demo",
      buttonText: "Demo Rich Carousel",
      enabled: true
    },

    {
      id: "rcs-suggested-actions",
      title: "Suggested Actions & Quick Replies",
      description: "Interactive buttons and quick reply options for user engagement",
      emoji: "⚡",
      category: "rcs-features",
      featureType: "suggested-actions",
      channel: "rcs",
      demoConfig: {
        mockBehavior: "Show suggested reply buttons below message",
        virtualPhoneEffect: "Display tappable action buttons in chat",
        apiResponse: {
          suggestions: [
            { reply: { text: "Yes, I'm interested", postbackData: "interested" } },
            { reply: { text: "Not right now", postbackData: "not_now" } },
            { action: { text: "Call Sales", postbackData: "call_sales", dialAction: { phoneNumber: "+18333659260" } } }
          ]
        },
        timeDelay: 800,
        persistEffect: true,
        customMessage: "🎯 Exclusive offer: 25% off your first developer kit! Limited time deal for premium members.",
        customVariables: {
          maxSuggestions: 11,
          allowCustomActions: true,
          trackInteractions: true
        },
        interactiveElements: {
          quickReplies: [
            { title: "🛍️ Browse Products", payload: "browse_products" },
            { title: "📞 Call Sales", payload: "call_sales" },
            { title: "❓ Get Support", payload: "get_support" }
          ]
        }
      },
      technicalDetails: {
        twilioFeature: "RCS Suggested Actions",
        documentation: "https://www.twilio.com/docs/rcs/send-messages"
      },
      messageContent: "🎯 Exclusive offer: 25% off your first developer kit! Limited time deal for premium members.",
      variables: {},
      apiAction: "rcs-suggested-actions-demo",
      buttonText: "Demo Suggested Actions",
      enabled: true
    },

    {
      id: "rcs-branded-sender",
      title: "Branded Business Profile",
      description: "Send messages with your business logo and verified identity",
      emoji: "🏢",
      category: "rcs-features",
      featureType: "branded-sender",
      channel: "rcs",
      demoConfig: {
        mockBehavior: "Show verified business badge and logo in message header",
        virtualPhoneEffect: "Display business logo instead of phone number",
        apiResponse: {
          brandedSender: {
            businessName: "Owl Shop",
            logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100",
            verified: true
          }
        },
        timeDelay: 500,
        persistEffect: true
      },
      technicalDetails: {
        twilioFeature: "RCS Business Profile",
        documentation: "https://www.twilio.com/docs/rcs/business-profile"
      },
      messageContent: "👋 Welcome to Owl Shop! You're now chatting with our verified business account. How can we help you today?",
      variables: {},
      apiAction: "rcs-branded-sender-demo", 
      buttonText: "Demo Branded Profile",
      enabled: true
    },

    {
      id: "rcs-read-receipts",
      title: "Read Receipts & Delivery Status",
      description: "Track when customers read your messages with precise timestamps",
      emoji: "✅",
      category: "rcs-features",
      featureType: "read-receipts",
      channel: "rcs",
      demoConfig: {
        mockBehavior: "Show read status progression: sent → delivered → read",
        virtualPhoneEffect: "Display read receipt with timestamp",
        apiResponse: {
          deliveryReceipt: {
            messageId: "msg_123",
            status: "read",
            timestamp: new Date().toISOString()
          }
        },
        timeDelay: 3000,
        persistEffect: true
      },
      technicalDetails: {
        twilioFeature: "RCS Delivery & Read Receipts",
        documentation: "https://www.twilio.com/docs/rcs/delivery-receipts"
      },
      messageContent: "📧 Your order confirmation #OWL-2024-001 is ready! Check your email for tracking details.",
      variables: {},
      apiAction: "rcs-read-receipts-demo",
      buttonText: "Demo Read Receipts",
      enabled: true
    },

    // === WHATSAPP FEATURE CARDS ===
    {
      id: "whatsapp-message-templates",
      title: "Message Templates",
      description: "Pre-approved business message templates for marketing and notifications",
      emoji: "📋",
      category: "whatsapp-features",
      featureType: "message-templates",
      channel: "whatsapp",
      demoConfig: {
        mockBehavior: "Display template structure with variable placeholders",
        virtualPhoneEffect: "Show formatted template message in WhatsApp interface",
        apiResponse: {
          templateName: "order_confirmation",
          language: "en_US",
          status: "approved",
          components: [
            {
              type: "header",
              parameters: [{ type: "text", text: "Order Confirmation" }]
            },
            {
              type: "body", 
              parameters: [
                { type: "text", text: "John" },
                { type: "text", text: "OWL-2024-001" },
                { type: "text", text: "$127.50" }
              ]
            }
          ]
        },
        timeDelay: 1000,
        persistEffect: true
      },
      technicalDetails: {
        apiEndpoint: "/Messages.json",
        requiredParams: ["ContentSid", "ContentVariables"],
        twilioFeature: "WhatsApp Message Templates",
        documentation: "https://www.twilio.com/docs/whatsapp/tutorial/send-whatsapp-notification-messages-templates"
      },
      messageContent: "Hello {{customerName}}, your order #{{orderNumber}} for {{orderTotal}} has been confirmed! Track your order: {{trackingUrl}}",
      variables: {
        customerName: "John",
        orderNumber: "OWL-2024-001", 
        orderTotal: "$127.50",
        trackingUrl: "https://owlshop.com/track"
      },
      apiAction: "whatsapp-template-demo",
      buttonText: "Demo Message Template",
      enabled: true
    },

    {
      id: "whatsapp-interactive-buttons",
      title: "Interactive Buttons",
      description: "Quick reply and call-to-action buttons for seamless user interactions",
      emoji: "🔘",
      category: "whatsapp-features",
      featureType: "interactive-buttons",
      channel: "whatsapp",
      demoConfig: {
        mockBehavior: "Show interactive button options below message",
        virtualPhoneEffect: "Display tappable buttons in WhatsApp chat",
        apiResponse: {
          interactive: {
            type: "button",
            body: { text: "Choose an option:" },
            action: {
              buttons: [
                { type: "reply", reply: { id: "yes", title: "Yes, interested" } },
                { type: "reply", reply: { id: "no", title: "Not now" } },
                { type: "reply", reply: { id: "info", title: "More info" } }
              ]
            }
          }
        },
        timeDelay: 800,
        persistEffect: true,
        customMessage: "💡 How can we help you today? Choose from the options below:",
        interactiveElements: {
          buttons: [
            { title: "📞 Call Support", type: "phone", payload: "+1-833-365-9260" },
            { title: "💬 Live Chat", type: "reply", payload: "start_chat" },
            { title: "🌐 Visit Website", type: "url", url: "https://owlshop.com/support" }
          ]
        },
        customVariables: {
          maxButtons: 3,
          buttonTypes: ["reply", "url", "phone_number"],
          allowCustomButtons: true
        }
      },
      technicalDetails: {
        twilioFeature: "WhatsApp Interactive Messages",
        documentation: "https://www.twilio.com/docs/whatsapp/interactive-messages"
      },
      messageContent: "🎉 Exclusive early access to our new Developer Collection! Would you like to be notified when it launches?",
      variables: {},
      apiAction: "whatsapp-buttons-demo",
      buttonText: "Demo Interactive Buttons",
      enabled: true
    },

    {
      id: "whatsapp-list-messages",
      title: "List Messages",
      description: "Interactive selection menus with multiple organized options",
      emoji: "📋",
      category: "whatsapp-features",
      featureType: "list-messages",
      channel: "whatsapp",
      demoConfig: {
        mockBehavior: "Display expandable list menu with sections",
        virtualPhoneEffect: "Show list button that expands to selection menu",
        apiResponse: {
          interactive: {
            type: "list",
            header: { type: "text", text: "Product Categories" },
            body: { text: "Choose a category to browse:" },
            footer: { text: "Tap to select" },
            action: {
              button: "View Products",
              sections: [
                {
                  title: "Clothing",
                  rows: [
                    { id: "hoodies", title: "Hoodies", description: "Premium developer hoodies" },
                    { id: "tshirts", title: "T-Shirts", description: "Comfortable coding tees" }
                  ]
                },
                {
                  title: "Accessories", 
                  rows: [
                    { id: "mugs", title: "Coffee Mugs", description: "Fuel your coding sessions" },
                    { id: "stickers", title: "Laptop Stickers", description: "Show your dev pride" }
                  ]
                }
              ]
            }
          }
        },
        timeDelay: 1200,
        persistEffect: true
      },
      technicalDetails: {
        twilioFeature: "WhatsApp List Messages",
        documentation: "https://www.twilio.com/docs/whatsapp/interactive-messages#list-messages"
      },
      messageContent: "🛍️ Welcome to Owl Shop! Browse our developer merchandise by category.",
      variables: {},
      apiAction: "whatsapp-list-demo",
      buttonText: "Demo List Message",
      enabled: true
    },

    {
      id: "whatsapp-media-sharing",
      title: "Rich Media Sharing",
      description: "Send images, videos, documents, and location data",
      emoji: "📸",
      category: "whatsapp-features",
      featureType: "media-sharing",
      channel: "whatsapp",
      demoConfig: {
        mockBehavior: "Display media with download and preview options",
        virtualPhoneEffect: "Show media thumbnail with WhatsApp preview",
        apiResponse: {
          mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
          mediaType: "image",
          caption: "Check out our new Developer Collection!",
          mediaSize: "1.2MB"
        },
        timeDelay: 1500,
        persistEffect: true
      },
      technicalDetails: {
        apiEndpoint: "/Messages.json",
        requiredParams: ["MediaUrl"],
        twilioFeature: "WhatsApp Media Messages",
        documentation: "https://www.twilio.com/docs/whatsapp/tutorial/send-and-receive-media-messages-whatsapp"
      },
      messageContent: "📸 Sneak peek at our new collection! What do you think?",
      variables: {
        mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
        caption: "New Developer Collection Preview"
      },
      apiAction: "whatsapp-media-demo",
      buttonText: "Send Media Message",
      enabled: true
    },

    // === VOICE FEATURE CARDS ===
    {
      id: "voice-text-to-speech",
      title: "Text-to-Speech (TTS)",
      description: "Convert text to natural-sounding speech with multiple voices and languages",
      emoji: "🗣️",
      category: "voice-features",
      featureType: "text-to-speech",
      channel: "voice",
      demoConfig: {
        mockBehavior: "Play synthesized speech with voice selection options",
        virtualPhoneEffect: "Show incoming call with TTS playback interface",
        apiResponse: {
          twimlResponse: `<Response><Say voice="alice">Hello from Owl Shop! Your order has been processed successfully.</Say></Response>`,
          voice: "alice",
          language: "en-US"
        },
        timeDelay: 1000,
        persistEffect: false,
        customMessage: "Hello from Owl Shop! Your order has been processed successfully.",
        voiceSettings: {
          voice: "alice",
          language: "en-US",
          speed: 1.0,
          pitch: 1.0
        },
        customVariables: {
          availableVoices: ["alice", "man", "woman", "Polly.Joanna", "Polly.Matthew"],
          supportedLanguages: ["en-US", "en-GB", "es-ES", "fr-FR", "de-DE"],
          maxTextLength: 4000
        }
      },
      technicalDetails: {
        apiEndpoint: "/Calls.json",
        requiredParams: ["TwiML", "Voice"],
        twilioFeature: "Text-to-Speech (TTS)",
        documentation: "https://www.twilio.com/docs/voice/twiml/say",
        codeExample: `<Response>
  <Say voice="alice" language="en-US">
    Hello from Owl Shop! Your order has been processed successfully.
  </Say>
</Response>`,
        limitations: [
          "Text must be under 4,000 characters",
          "Some voices only available in specific regions",
          "Polly voices require additional configuration"
        ]
      },
      messageContent: "🎙️ Converting text to speech: 'Hello from Owl Shop! Your order has been processed successfully.' Using voice: Alice, Language: English-US",
      variables: {
        voice: "alice",
        message: "Hello from Owl Shop! Your order has been processed successfully."
      },
      apiAction: "tts-demo",
      buttonText: "Demo Text-to-Speech",
      enabled: true
    },

    {
      id: "voice-ivr-system",
      title: "Interactive Voice Response (IVR)",
      description: "Build smart phone menus with voice prompts and keypad input",
      emoji: "📞",
      category: "voice-features",
      featureType: "ivr-system",
      channel: "voice",
      demoConfig: {
        mockBehavior: "Show IVR menu flow with keypad interaction options",
        virtualPhoneEffect: "Display call interface with IVR menu and keypad",
        apiResponse: {
          twimlResponse: `<Response><Gather numDigits="1" action="/handle-key"><Say>For Sales, press 1. For Support, press 2. For Billing, press 3.</Say></Gather></Response>`,
          menuOptions: [
            { key: "1", description: "Sales Department" },
            { key: "2", description: "Support Team" },
            { key: "3", description: "Billing Questions" }
          ]
        },
        timeDelay: 1500,
        persistEffect: true,
        customMessage: "☎️ IVR Menu: 'Thank you for calling Owl Shop! For Sales, press 1. For Support, press 2. For Billing, press 3. Or stay on the line for an operator.'",
        customVariables: {
          maxMenuOptions: 9,
          gatherTimeout: 5,
          numDigits: 1,
          allowRepeat: true
        },
        voiceSettings: {
          voice: "alice",
          language: "en-US",
          speed: 1.0,
          pitch: 1.0
        },
        interactiveElements: {
          buttons: [
            { title: "Sales (Press 1)", type: "reply", payload: "ivr_sales" },
            { title: "Support (Press 2)", type: "reply", payload: "ivr_support" },
            { title: "Billing (Press 3)", type: "reply", payload: "ivr_billing" }
          ]
        }
      },
      technicalDetails: {
        apiEndpoint: "/Calls.json",
        requiredParams: ["TwiML", "Gather"],
        twilioFeature: "Interactive Voice Response (IVR)",
        documentation: "https://www.twilio.com/docs/voice/tutorials/how-to-create-a-simple-ivr-system",
        codeExample: `<Response>
  <Gather numDigits="1" action="/handle-key">
    <Say>For Sales, press 1. For Support, press 2.</Say>
  </Gather>
</Response>`,
        limitations: [
          "Limited to 9 menu options (digits 1-9)",
          "Timeout limitations for user input",
          "Requires webhook endpoint for handling selections"
        ]
      },
      messageContent: "☎️ IVR Menu: 'Thank you for calling Owl Shop! For Sales, press 1. For Support, press 2. For Billing, press 3. Or stay on the line for an operator.'",
      variables: {},
      apiAction: "ivr-demo",
      buttonText: "Demo IVR System",
      enabled: true
    },

    {
      id: "voice-call-recording",
      title: "Call Recording",
      description: "Record full conversations or single-side audio for quality assurance",
      emoji: "🎙️",
      category: "voice-features",
      featureType: "call-recording",
      channel: "voice",
      demoConfig: {
        mockBehavior: "Show recording indicator and playback controls",
        virtualPhoneEffect: "Display recording status with red indicator",
        apiResponse: {
          recordingUrl: "https://api.twilio.com/recordings/RExxxxxxxxx.mp3",
          recordingSid: "RExxxxxxxxx",
          duration: "45",
          status: "completed"
        },
        timeDelay: 2000,
        persistEffect: true
      },
      technicalDetails: {
        apiEndpoint: "/Calls/{CallSid}.json",
        requiredParams: ["Record"],
        twilioFeature: "Call Recording",
        documentation: "https://www.twilio.com/docs/voice/tutorials/how-to-record-phone-calls"
      },
      messageContent: "🎙️ Call recording active: Both sides recorded for quality assurance. Recording ID: RExxxxxxxxx, Duration: 45 seconds",
      variables: {
        recordingSid: "RExxxxxxxxx",
        duration: "45"
      },
      apiAction: "call-recording-demo",
      buttonText: "Demo Call Recording",
      enabled: true
    },

    {
      id: "voice-conference-calls",
      title: "Conference Calls",
      description: "Create multi-party voice conferences with moderation controls",
      emoji: "👥",
      category: "voice-features",
      featureType: "conference-calls",
      channel: "voice",
      demoConfig: {
        mockBehavior: "Show conference room with participant list and controls",
        virtualPhoneEffect: "Display conference interface with participant count",
        apiResponse: {
          conferenceSid: "CFxxxxxxxxx",
          friendlyName: "Owl Shop Team Meeting",
          participants: [
            { sid: "CAxxxxxxxxx", muted: false, hold: false },
            { sid: "CAyyyyyyyyy", muted: true, hold: false }
          ],
          participantCount: 3
        },
        timeDelay: 1200,
        persistEffect: true
      },
      technicalDetails: {
        apiEndpoint: "/Conferences.json",
        requiredParams: ["FriendlyName"],
        twilioFeature: "Conference Calls",
        documentation: "https://www.twilio.com/docs/voice/tutorials/conference-calls"
      },
      messageContent: "👥 Conference: 'Owl Shop Team Meeting' - 3 participants connected. Conference ID: CFxxxxxxxxx. Moderation controls available.",
      variables: {
        conferenceName: "Owl Shop Team Meeting",
        participantCount: 3
      },
      apiAction: "conference-demo",
      buttonText: "Demo Conference Call",
      enabled: true
    },

    {
      id: "voice-speech-recognition",
      title: "Speech Recognition",
      description: "Convert customer speech to text for voice-driven interactions",
      emoji: "🎯",
      category: "voice-features",
      featureType: "speech-recognition",
      channel: "voice",
      demoConfig: {
        mockBehavior: "Show speech-to-text conversion with confidence scores",
        virtualPhoneEffect: "Display speech recognition with real-time transcription",
        apiResponse: {
          transcript: "I would like to place an order for a developer hoodie in size large",
          confidence: 0.92,
          speechResult: "success",
          language: "en-US"
        },
        timeDelay: 2500,
        persistEffect: true
      },
      technicalDetails: {
        twilioFeature: "Speech Recognition",
        documentation: "https://www.twilio.com/docs/voice/twiml/gather#attributes-speech-recognition"
      },
      messageContent: "🎯 Speech Recognition: Customer said 'I would like to place an order for a developer hoodie in size large' (Confidence: 92%)",
      variables: {
        transcript: "I would like to place an order for a developer hoodie in size large",
        confidence: "92%"
      },
      apiAction: "speech-recognition-demo",
      buttonText: "Demo Speech Recognition",
      enabled: true
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
    ],
    voiceSettings: {
      autoEndCalls: false, // Manual hang up only
      callDurationSeconds: undefined, // Unlimited duration
      showCallHistory: true,
      maxCallHistoryItems: 10,
      enableMockContacts: true,
      mockContacts: [
        {
          id: '1',
          name: 'Demo Contact',
          number: '+1 (555) 123-4567',
          avatar: '👤',
          company: 'Twilio'
        },
        {
          id: '2',
          name: 'Support Team',
          number: '+1 (555) 987-6543',
          avatar: '🛟',
          company: 'Help Desk'
        },
        {
          id: '3',
          name: 'Sales Team',
          number: '+1 (555) 111-2222',
          avatar: '💼',
          company: 'Sales'
        }
      ]
    }
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
      description: "Simple text message with variables",
      icon: "💬",
      available: ["sms", "rcs", "whatsapp"],
      customizable: {
        variables: true
      }
    },
    media: {
      id: "media",
      name: "Media Message (MMS)",
      description: "Message with image, video, audio, or document",
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
      name: "Rich Card",
      description: "Interactive card with image, text, and action buttons",
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
      cardTitle: "Special Offer!",
      cardSubtitle: "Limited time deal - Don't miss out!",
      cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      buttons: [
        { title: "Shop Now", type: "url", url: "https://owlshop.com" },
        { title: "Call Us", type: "phone", payload: "+1-833-365-9260" },
        { title: "More Info", type: "reply", payload: "more_info" }
      ],
      quickReplies: [
        { title: "Yes, I'm interested", payload: "interested" },
        { title: "Not now", payload: "not_now" },
        { title: "Tell me more", payload: "more_info" }
      ]
    },
    carousel: {
      id: "carousel",
      name: "Carousel Cards",
      description: "Multiple scrollable rich cards",
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
          title: "Owl Hoodie",
          subtitle: "Premium comfort hoodie",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          buttons: [
            { title: "Buy $49.99", type: "url", url: "https://owlshop.com/hoodie" },
            { title: "Details", type: "reply", payload: "hoodie_details" }
          ]
        },
        {
          id: "2",
          title: "Dev T-Shirt",
          subtitle: "Perfect for coding sessions",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          buttons: [
            { title: "Buy $29.99", type: "url", url: "https://owlshop.com/tshirt" },
            { title: "Details", type: "reply", payload: "tshirt_details" }
          ]
        },
        {
          id: "3",
          title: "Code Mug",
          subtitle: "Fuel your coding with coffee",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          buttons: [
            { title: "Buy $19.99", type: "url", url: "https://owlshop.com/mug" },
            { title: "Details", type: "reply", payload: "mug_details" }
          ]
        }
      ]
    },
    listMessage: {
      id: "listMessage",
      name: "List Message",
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
      header: "Choose Your Product Category",
      footer: "Select an option to continue",
      buttonText: "View Products",
      sections: [
        {
          title: "Clothing",
          rows: [
            { id: "hoodies", title: "Hoodies", description: "Comfortable and stylish hoodies" },
            { id: "tshirts", title: "T-Shirts", description: "Perfect for everyday wear" }
          ]
        },
        {
          title: "Accessories",
          rows: [
            { id: "mugs", title: "Mugs", description: "Coffee mugs for developers" },
            { id: "stickers", title: "Stickers", description: "Laptop stickers and decals" }
          ]
        }
      ]
    },
    location: {
      id: "location",
      name: "Location Message",
      description: "Share location pin with label",
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
      label: "San Francisco, CA"
    },
    catalog: {
      id: "catalog",
      name: "Product Catalog",
      description: "Interactive shopping catalog",
      icon: "🛍️",
      available: ["whatsapp"],
      customizable: {
        variables: true,
        catalogId: true,
        title: true,
        body: true,
        thumbnailItemId: true
      },
      catalogId: "CATALOG_ID_123",
      title: "Shop Our Collection",
      body: "Browse our premium developer merchandise",
      thumbnailItemId: "item_001"
    },
    authentication: {
      id: "authentication",
      name: "WhatsApp Authentication",
      description: "OTP with copy button",
      icon: "🔐",
      available: ["whatsapp"],
      customizable: {
        variables: true,
        otpCode: true,
        addSecurityRecommendation: true,
        codeExpirationMinutes: true,
        copyCodeText: true
      },
      otpCode: "123456",
      addSecurityRecommendation: true,
      codeExpirationMinutes: 10,
      copyCodeText: "Copy Code"
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