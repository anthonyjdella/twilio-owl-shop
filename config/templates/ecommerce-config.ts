// E-commerce Configuration Template
// Perfect for online stores, retail businesses, and marketplace platforms

import { DemoConfig } from '../demo-config';

export const ecommerceConfig: DemoConfig = {
  // ====== BRAND IDENTITY ======
  title: "E-COMMERCE SMS MARKETING",
  subtitle: "Boost sales and customer engagement with personalized SMS campaigns",
  brandName: "ShopFlow",
  
  // ====== BRAND COLORS ======
  brandColors: {
    primary: "#7C3AED",    // Purple - premium feel
    secondary: "#1F2937",  // Dark gray - professional
    accent: "#10B981",     // Green - success/sales
    background: "#F9FAFB", // Clean light background
    text: "#6B7280"        // Readable gray text
  },
  
  // ====== FEATURE CONFIGURATION ======
  features: {
    enableRichMessaging: true,
    enableVirtualPhone: true,
    enableConfigPanel: true,
    enableJourneyFlow: true,
    enableChannelSelection: true,
    availableChannels: ['sms', 'rcs', 'whatsapp'], // No voice for e-commerce
    defaultChannel: 'sms',
    enableContentTypes: true,
    availableContentTypes: ['text', 'richCard', 'carousel'],
    voiceTemplateIds: [], // No voice templates
    phoneSettings: {
      defaultPhoneNumber: '+1 (555) SHOP-NOW',
      enableRealCalls: false,
      callAutoEndTime: undefined
    }
  },
  
  // ====== LAYOUT SETTINGS ======
  layout: {
    gridColumns: 2,
    showCategoryFilter: true,
    showTimestamps: true,
    showDeliveryStatus: true,
    compactMode: false,
    showPreviewSection: true
  },
  
  // ====== CARD LAYOUTS ======
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
  
  // ====== CONTENT TYPE TEMPLATES ======
  contentTypeTemplates: {
    text: {
      name: "Text Message",
      description: "Simple promotional text",
      icon: "💬",
      enabled: true,
      defaultValues: {},
      customFields: []
    },
    richCard: {
      name: "Product Card",
      description: "Featured product with image and buy button",
      icon: "🛍️",
      enabled: true,
      defaultValues: {
        cardTitle: "🔥 Flash Sale - 50% Off!",
        cardSubtitle: "Limited time offer - Don't miss out!",
        cardBody: "Premium quality items at unbeatable prices. Free shipping on orders over $50.",
        cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        interactiveType: "buttons"
      },
      customFields: [
        { name: "cardTitle", type: "text", label: "Product Title", required: true },
        { name: "cardSubtitle", type: "text", label: "Offer Description" },
        { name: "cardBody", type: "textarea", label: "Product Details" },
        { name: "cardImage", type: "url", label: "Product Image URL" }
      ]
    },
    carousel: {
      name: "Product Carousel",
      description: "Multiple featured products",
      icon: "🎠",
      enabled: true,
      defaultValues: {
        carouselBody: "🛒 Shop our best-selling items with exclusive discounts!"
      },
      customFields: [
        { name: "carouselBody", type: "textarea", label: "Carousel Description" }
      ]
    },
    media: {
      name: "Product Media",
      description: "Product images and videos",
      icon: "📸",
      enabled: false,
      defaultValues: {
        mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        mediaType: "image",
        caption: "New arrivals - Shop now!"
      },
      customFields: [
        { name: "mediaUrl", type: "url", label: "Media URL", required: true },
        { name: "caption", type: "textarea", label: "Product Caption" }
      ]
    },
    listMessage: {
      name: "Product Categories",
      description: "Browse by category",
      icon: "📋",
      enabled: false,
      defaultValues: {
        listHeader: "Shop by Category",
        listFooter: "Free shipping on orders over $50",
        buttonText: "Browse Products"
      },
      customFields: [
        { name: "listHeader", type: "text", label: "Category Header", required: true },
        { name: "listFooter", type: "text", label: "Promotion Footer" },
        { name: "buttonText", type: "text", label: "Shop Button Text" }
      ]
    }
  },
  
  // ====== UI TEXT CUSTOMIZATION ======
  uiText: {
    sections: {
      phoneNumber: "CUSTOMER PHONE",
      demoActions: "SALES ACTIONS",
      customerJourney: "CUSTOMER SHOPPING JOURNEY",
      messageTemplates: "Marketing Messages",
      virtualPhone: "CUSTOMER PHONE PREVIEW",
      resultsLog: "CAMPAIGN ACTIVITY"
    },
    
    buttons: {
      completeJourney: "🛒 Run Shopping Journey",
      clearResults: "🗑️ Clear Activity",
      clearLog: "Clear",
      editMessage: "Customize",
      cancelEdit: "Cancel",
      saveChanges: "Save Changes",
      addVariable: "+ Add Variable",
      cancel: "Cancel",
      add: "Add"
    },
    
    forms: {
      phoneNumberPlaceholder: "+1 (555) 123-4567",
      messageContentLabel: "Message:",
      messagePreviewLabel: "Preview:",
      variablesLabel: "Dynamic Fields:",
      variableNamePlaceholder: "Field name",
      variableValuePlaceholder: "Value",
      noVariablesText: "No variables yet. Click 'Add' to create one."
    },
    
    twilioStatus: {
      title: "SMS MARKETING STATUS",
      mode: "Mode:",
      accountSid: "Account:",
      phoneNumber: "Number:",
      demoMode: "🎭 DEMO MODE",
      liveMode: "📱 LIVE MODE",
      demoModeDescription: "💡 Demo mode - messages appear in virtual phone for testing."
    },
    
    virtualPhone: {
      tapToWake: "Tap to wake customer phone",
      demoModeDisabled: "Demo mode - customer view",
      noMessagesYet: "No messages yet",
      messagesWillAppearHere: "Customer messages will appear here",
      contactInfo: "Store Contact",
      back: "← Back",
      call: "Call Store",
      message: "Text Store",
      email: "Email Store",
      notes: "Order Notes",
      recentActivity: "Recent Orders",
      noRecentMessages: "No recent messages",
      sendTextMessage: "Message the store"
    },

    whatsapp: {
      headerTitle: "ShopFlow Store",
      online: "Online now",
      offline: "Usually replies quickly",
      about: "About Our Store",
      businessInfo: "Store Information",
      website: "shopflow.com",
      email: "orders@shopflow.com",
      location: "Online Retail Store",
      aboutDescription: "Welcome to ShopFlow! 🛒 Your destination for quality products at great prices with fast shipping.",
      typeMessage: "Type a message",
      chatsTitle: "WhatsApp",
      contactInfoTitle: "Store Info",
      video: "Video Call"
    },
    
    results: {
      noMessages: "No campaigns sent yet. Start your SMS marketing campaign.",
      messageReceived: "📱 Customer received:",
      sending: "🚀 Sending campaign",
      sentSuccessfully: "✅ delivered",
      failed: "❌ Failed:",
      messageDelivered: "📱 Message delivered to customer",
      messageContent: "📋 Campaign Content:",
      demoMode: "📋 Demo Mode:",
      sequenceStarting: "🛒 Starting shopping journey",
      waiting: "⏳ Waiting",
      sequenceCompleted: "✅ Journey completed!",
      updated: "📝 Updated campaign:"
    }
  },
  
  // ====== E-COMMERCE MESSAGE TEMPLATES ======
  messageTemplates: [
    {
      id: "flash-sale",
      title: "Flash Sale Alert",
      description: "Limited time promotions",
      emoji: "⚡",
      category: "marketing",
      messageContent: "🔥 FLASH SALE! 50% off everything at {{brandName}}! Only {{timeLeft}} left. Use code: {{promoCode}} → {{shopUrl}} Reply STOP to opt out.",
      variables: { 
        timeLeft: "2 hours",
        promoCode: "FLASH50", 
        shopUrl: "https://shopflow.com/sale"
      },
      apiAction: "flash-sale",
      buttonText: "Send Flash Sale"
    },
    
    {
      id: "abandoned-cart",
      title: "Cart Recovery",
      description: "Win back customers who left items",
      emoji: "🛒",
      category: "transactional",
      messageContent: "Don't let these items get away! You have {{itemCount}} items ({{cartTotal}}) waiting in your {{brandName}} cart. Complete your order: {{cartUrl}}",
      variables: { 
        itemCount: 3, 
        cartTotal: "$127.99", 
        cartUrl: "https://shopflow.com/cart" 
      },
      apiAction: "abandoned-cart",
      buttonText: "Send Cart Reminder"
    },
    
    {
      id: "order-shipped",
      title: "Order Shipped",
      description: "Shipping confirmations with tracking",
      emoji: "📦",
      category: "transactional",
      messageContent: "📦 Your {{brandName}} order #{{orderNumber}} has shipped! Track your package: {{trackingNumber}} Expected delivery: {{deliveryDate}}",
      variables: { 
        orderNumber: "SF{{timestamp}}", 
        trackingNumber: "SF{{timestamp}}", 
        deliveryDate: "Thursday" 
      },
      apiAction: "order-shipped",
      buttonText: "Send Shipping Update"
    },
    
    {
      id: "back-in-stock",
      title: "Back in Stock",
      description: "Notify customers when items return",
      emoji: "📬",
      category: "notification",
      messageContent: "🎉 Great news! {{productName}} is back in stock at {{brandName}}! Only {{stockCount}} left. Shop now: {{productUrl}} Reply STOP to opt out.",
      variables: { 
        productName: "Premium Wireless Headphones",
        stockCount: "12",
        productUrl: "https://shopflow.com/headphones"
      },
      apiAction: "back-in-stock",
      buttonText: "Send Stock Alert"
    },
    
    {
      id: "vip-early-access",
      title: "VIP Early Access",
      description: "Exclusive offers for loyal customers",
      emoji: "👑",
      category: "marketing",
      messageContent: "👑 VIP ACCESS: Get {{discount}}% off our new collection before anyone else! {{brandName}} VIP exclusive until {{endDate}}. Shop: {{vipUrl}} Reply STOP to opt out.",
      variables: { 
        discount: "30",
        endDate: "midnight tonight",
        vipUrl: "https://shopflow.com/vip"
      },
      apiAction: "vip-early-access",
      buttonText: "Send VIP Offer"
    },
    
    {
      id: "review-request",
      title: "Review Request",
      description: "Ask customers to review purchases",
      emoji: "⭐",
      category: "notification",
      messageContent: "How was your {{brandName}} experience? Rate your recent purchase and get {{incentive}} off your next order! Review: {{reviewUrl}} Reply STOP to opt out.",
      variables: { 
        incentive: "15%",
        reviewUrl: "https://shopflow.com/review"
      },
      apiAction: "review-request",
      buttonText: "Request Review"
    }
  ],
  
  // ====== VIRTUAL PHONE SETUP ======
  virtualPhone: {
    deviceName: "iPhone 15 Pro",
    carrierName: "ShopFlow Mobile",
    signalStrength: 4,
    batteryLevel: 92,
    currentTime: "2:30 PM",
    defaultApp: "messages",
    phoneNumber: "+1 (555) SHOP-NOW",
    contactName: "ShopFlow Store",
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
      showCallHistory: false, // Not needed for e-commerce
      maxCallHistoryItems: 0,
      enableMockContacts: false,
      mockContacts: []
    }
  },
  
  // ====== MESSAGE THEMES ======
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
      id: "whatsapp",
      name: "WhatsApp Business",
      type: "whatsapp",
      bubbleColor: "#DCF8C6",
      textColor: "#000000",
      backgroundColor: "#E5DDD5",
      borderRadius: "12px",
      fontFamily: "system-ui",
      showTimestamp: true,
      showDeliveryStatus: true,
      avatar: "🛒"
    }
  ],
  
  // ====== SHOPPING JOURNEY FLOW ======
  journeySteps: [
    {
      id: "promotional",
      title: "Flash Sales",
      description: "Limited time offers & promotions",
      icon: "⚡",
      messageIds: ["flash-sale", "vip-early-access"]
    },
    {
      id: "cart-recovery",
      title: "Cart Recovery",
      description: "Re-engage customers who abandoned carts",
      icon: "🛒",
      messageIds: ["abandoned-cart"]
    },
    {
      id: "order-fulfillment",
      title: "Order Updates",
      description: "Shipping and delivery notifications",
      icon: "📦",
      messageIds: ["order-shipped"]
    },
    {
      id: "retention",
      title: "Customer Retention",
      description: "Reviews, restocks, and loyalty",
      icon: "⭐",
      messageIds: ["review-request", "back-in-stock"]
    }
  ],
  
  // ====== RICH MESSAGE TYPES ======
  richMessageTypes: {
    text: {
      id: "text",
      name: "Text Message",
      description: "Simple promotional text",
      icon: "💬",
      available: ["sms", "rcs", "whatsapp"],
      customizable: {
        variables: true
      }
    },
    media: {
      id: "media",
      name: "Product Media",
      description: "Product images and videos",
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
      caption: "New arrivals - Shop now!"
    },
    richCard: {
      id: "richCard",
      name: "Product Card",
      description: "Featured product with buy button",
      icon: "🛍️",
      available: ["rcs", "whatsapp"],
      customizable: {
        variables: true,
        cardTitle: true,
        cardSubtitle: true,
        cardImage: true,
        buttons: true,
        quickReplies: true
      },
      cardTitle: "🔥 Flash Sale - 50% Off!",
      cardSubtitle: "Limited time offer - Don't miss out!",
      cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      buttons: [
        { title: "Shop Now", type: "url", url: "https://shopflow.com" },
        { title: "View Cart", type: "url", url: "https://shopflow.com/cart" },
        { title: "Call Store", type: "phone", payload: "+1-555-SHOP-NOW" }
      ],
      quickReplies: [
        { title: "Show me more deals", payload: "more_deals" },
        { title: "Not interested", payload: "not_interested" },
        { title: "Save for later", payload: "save_later" }
      ]
    },
    carousel: {
      id: "carousel",
      name: "Product Carousel",
      description: "Multiple featured products",
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
          title: "Wireless Headphones",
          subtitle: "Premium sound quality",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
          buttons: [
            { title: "Buy $99", type: "url", url: "https://shopflow.com/headphones" },
            { title: "Details", type: "reply", payload: "headphones_info" }
          ]
        },
        {
          id: "2",
          title: "Smart Watch",
          subtitle: "Track your fitness goals",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
          buttons: [
            { title: "Buy $199", type: "url", url: "https://shopflow.com/watch" },
            { title: "Details", type: "reply", payload: "watch_info" }
          ]
        }
      ]
    },
    listMessage: {
      id: "listMessage",
      name: "Product Categories",
      description: "Browse by category",
      icon: "📋",
      available: ["whatsapp"],
      customizable: {
        variables: true,
        header: true,
        footer: true,
        sections: true,
        buttonText: true
      },
      header: "Shop by Category",
      footer: "Free shipping on orders over $50",
      buttonText: "Browse Products",
      sections: [
        {
          title: "Electronics",
          rows: [
            { id: "phones", title: "Smartphones", description: "Latest models and accessories" },
            { id: "laptops", title: "Laptops", description: "High-performance computing" }
          ]
        },
        {
          title: "Fashion",
          rows: [
            { id: "clothing", title: "Clothing", description: "Trending styles for everyone" },
            { id: "shoes", title: "Shoes", description: "Comfort meets style" }
          ]
        }
      ]
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