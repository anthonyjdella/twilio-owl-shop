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
  selectedContentType?: 'text' | 'media' | 'richCard' | 'carousel' | 'listMessage';
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
  
  // Feature Configuration
  features: {
    enableRichMessaging: boolean;
    enableVirtualPhone: boolean;
    enableConfigPanel: boolean;
    enableJourneyFlow: boolean;
    enableChannelSelection: boolean;
    availableChannels: ('sms' | 'rcs' | 'whatsapp')[];
    defaultChannel: 'sms' | 'rcs' | 'whatsapp';
    enableContentTypes: boolean;
    availableContentTypes: ('text' | 'media' | 'richCard' | 'carousel' | 'listMessage')[];
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
    availableChannels: ['sms', 'rcs', 'whatsapp'],
    defaultChannel: 'sms',
    enableContentTypes: true,
    availableContentTypes: ['text', 'media', 'richCard', 'carousel', 'listMessage']
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