// SaaS Configuration Template
// Perfect for software companies, tech startups, and cloud service providers

import { DemoConfig } from '../demo-config';

export const saasConfig: DemoConfig = {
  // ====== BRAND IDENTITY ======
  title: "SAAS CUSTOMER ENGAGEMENT",
  subtitle: "Drive user activation, retention, and growth with smart messaging",
  brandName: "CloudFlow",
  
  // ====== BRAND COLORS ======
  brandColors: {
    primary: "#4F46E5",    // Indigo - tech/trust
    secondary: "#1F2937",  // Dark gray - professional
    accent: "#06B6D4",     // Cyan - innovation
    background: "#F8FAFC", // Clean tech background
    text: "#64748B"        // Slate gray text
  },
  
  // ====== API CONFIGURATION ======
  apiConfig: {
    enableRiskCheck: false,
    defaultMessageIntent: "MARKETING",
    enableConsentAPI: true,
    enableContactAPI: true
  },
  
  // ====== FEATURE CONFIGURATION ======
  features: {
    enableRichMessaging: true,
    enableVirtualPhone: true,
    enableConfigPanel: true,
    enableJourneyFlow: true,
    enableChannelSelection: true,
    availableChannels: ['sms', 'rcs', 'whatsapp', 'voice'],
    defaultChannel: 'sms',
    enableContentTypes: true,
    availableContentTypes: ['text', 'richCard', 'carousel', 'listMessage', 'authentication'],
    voiceTemplateIds: [
      'interactive-ivr', 
      'voice-survey-interactive', 
      'voice-authentication'
    ],
    phoneSettings: {
      defaultPhoneNumber: '+1 (555) SAAS-HELP',
      enableRealCalls: true,
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
      showChannel: false,
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
      headerLayout: 'vertical',
      buttonStyle: 'outlined',
      borderStyle: 'none'
    },
    detailed: {
      showEmoji: true,
      showCategory: true,
      showChannel: true,
      showDescription: true,
      headerLayout: 'vertical',
      buttonStyle: 'filled',
      borderStyle: 'full'
    }
  },
  
  // ====== CONTENT TYPE TEMPLATES ======
  contentTypeTemplates: {
    text: {
      name: "Plain Text",
      description: "Simple text messages",
      icon: "💬",
      enabled: true,
      defaultValues: {}
    },
    richCard: {
      name: "Rich Card",
      description: "Interactive cards with buttons",
      icon: "🎯",
      enabled: true,
      defaultValues: {
        cardTitle: "CloudFlow Platform Update",
        cardSubtitle: "New features available now",
        cardBody: "Discover enhanced analytics, improved security, and faster performance in our latest release.",
        cardImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400"
      }
    },
    carousel: {
      name: "Carousel",
      description: "Multiple scrollable cards",
      icon: "🎠",
      enabled: true,
      defaultValues: {
        carouselBody: "Explore our platform features"
      }
    },
    listMessage: {
      name: "List Message",
      description: "Structured lists with options",
      icon: "📋",
      enabled: true,
      defaultValues: {
        listHeader: "Help Center",
        listFooter: "Select a topic for assistance",
        buttonText: "View Options"
      }
    },
    authentication: {
      name: "Authentication",
      description: "2FA and verification codes",
      icon: "🔐",
      enabled: true,
      defaultValues: {
        otpCode: "738291",
        addSecurityRecommendation: true,
        codeExpirationMinutes: 10,
        copyCodeText: "Copy Code"
      }
    },
    
    media: {
      name: "Media",
      description: "Images, videos, and documents",
      icon: "🎬",
      enabled: true,
      defaultValues: {
        mediaUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
        mediaType: "image",
        caption: "CloudFlow platform update"
      }
    },
    
    location: {
      name: "Location",
      description: "Share location information",
      icon: "📍",
      enabled: true,
      defaultValues: {
        latitude: 37.7749,
        longitude: -122.4194,
        label: "CloudFlow HQ - San Francisco"
      }
    },
    
    catalog: {
      name: "Catalog",
      description: "Product catalog showcase",
      icon: "🛍️",
      enabled: true,
      defaultValues: {
        catalogId: "CLOUDFLOW_CATALOG_123",
        title: "CloudFlow Features",
        body: "Explore our platform capabilities",
        thumbnailItemId: "analytics_suite"
      }
    }
  },
  
  // ====== RICH MESSAGE TYPES ======
  richMessageTypes: {
    text: {
      id: "text",
      name: "Text",
      description: "Simple text message",
      icon: "💬",
      available: ['sms', 'rcs', 'whatsapp'],
      customizable: {
        variables: true
      }
    },
    richCard: {
      id: "richCard",
      name: "Rich Card",
      description: "Interactive card with image and buttons",
      icon: "🎯",
      available: ['rcs', 'whatsapp'],
      customizable: {
        variables: true,
        cardTitle: true,
        cardSubtitle: true,
        cardImage: true,
        buttons: true,
        quickReplies: true
      },
      cardTitle: "CloudFlow Feature Update",
      cardSubtitle: "Enhanced analytics now available",
      cardImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
      buttons: [
        { title: "View Analytics", type: "url", url: "https://cloudflow.com/analytics" },
        { title: "Learn More", type: "reply", payload: "learn_more" },
        { title: "Contact Support", type: "phone", payload: "+1-555-SAAS-HELP" }
      ]
    },
    carousel: {
      id: "carousel",
      name: "Carousel",
      description: "Multiple cards in a scrollable view",
      icon: "🎠",
      available: ['rcs', 'whatsapp'],
      customizable: {
        variables: true,
        items: true,
        cardCount: true
      },
      items: [
        {
          id: "analytics",
          image: "📊",
          title: "Analytics Suite",
          subtitle: "Real-time insights",
          buttons: [{ title: "Explore", type: "url" }]
        },
        {
          id: "automation",
          image: "🤖",
          title: "Workflow Automation",
          subtitle: "Save time and scale",
          buttons: [{ title: "Set Up", type: "url" }]
        },
        {
          id: "security",
          image: "🔒",
          title: "Enterprise Security",
          subtitle: "Bank-grade protection",
          buttons: [{ title: "Learn More", type: "url" }]
        }
      ]
    },
    listMessage: {
      id: "listMessage",
      name: "List Message",
      description: "Structured list with selectable options",
      icon: "📋",
      available: ['whatsapp'],
      customizable: {
        variables: true,
        header: true,
        footer: true,
        sections: true,
        buttonText: true
      },
      header: "CloudFlow Help Center",
      footer: "Choose a topic for assistance",
      buttonText: "Get Help",
      sections: [
        {
          title: "Account & Billing",
          rows: [
            { id: "billing", title: "Billing Questions", description: "Payment and subscription help" },
            { id: "account", title: "Account Settings", description: "Profile and preferences" }
          ]
        },
        {
          title: "Technical Support",
          rows: [
            { id: "api", title: "API Integration", description: "Development and integration" },
            { id: "bugs", title: "Report an Issue", description: "Bug reports and feedback" }
          ]
        }
      ]
    },
    authentication: {
      id: "authentication",
      name: "Authentication",
      description: "2FA verification codes",
      icon: "🔐",
      available: ['whatsapp'],
      customizable: {
        variables: true,
        otpCode: true,
        addSecurityRecommendation: true,
        codeExpirationMinutes: true,
        copyCodeText: true
      },
      otpCode: "738291",
      addSecurityRecommendation: true,
      codeExpirationMinutes: 10,
      copyCodeText: "Copy Verification Code"
    },
    
    media: {
      id: "media",
      name: "Media",
      description: "Images, videos, and documents",
      icon: "🎬",
      available: ['rcs', 'whatsapp'],
      customizable: {
        variables: true,
        mediaUrl: true,
        mediaType: true,
        caption: true
      },
      mediaUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
      mediaType: "image",
      caption: "CloudFlow platform update"
    },
    
    location: {
      id: "location",
      name: "Location",
      description: "Share location information",
      icon: "📍",
      available: ['whatsapp'],
      customizable: {
        variables: true,
        latitude: true,
        longitude: true,
        label: true
      },
      latitude: 37.7749,
      longitude: -122.4194,
      label: "CloudFlow HQ - San Francisco"
    },
    
    catalog: {
      id: "catalog",
      name: "Catalog",
      description: "Product catalog showcase",
      icon: "🛍️",
      available: ['whatsapp'],
      customizable: {
        variables: true,
        catalogId: true,
        title: true,
        body: true,
        thumbnailItemId: true
      },
      catalogId: "CLOUDFLOW_CATALOG_123",
      title: "CloudFlow Features",
      body: "Explore our platform capabilities",
      thumbnailItemId: "analytics_suite"
    }
  },
  
  // ====== UI TEXT ======
  uiText: {
    twilioStatus: {
      title: "Twilio Integration Status",
      mode: "Mode:",
      demoMode: "Demo Mode",
      liveMode: "Live Mode", 
      accountSid: "Account SID:",
      phoneNumber: "Phone Number:",
      demoModeDescription: "Demo mode - messages will be simulated. Configure your Twilio credentials in .env.local for live messaging."
    },
    sections: {
      phoneNumber: "Target Phone Number",
      demoActions: "Demo Actions",
      messageTemplates: "SaaS Message Templates",
      virtualPhone: "Virtual Phone",
      resultsLog: "Activity Log",
      customerJourney: "Customer Journey"
    },
    buttons: {
      editMessage: "Edit Message",
      completeJourney: "Run Complete Journey",
      clearResults: "Clear Results",
      clearLog: "Clear",
      cancelEdit: "Cancel Edit",
      saveChanges: "Save Changes",
      addVariable: "Add Variable",
      cancel: "Cancel",
      add: "Add"
    },
    forms: {
      phoneNumberPlaceholder: "+1 (555) 123-4567",
      messageContentLabel: "Message Content",
      messagePreviewLabel: "Preview",
      variablesLabel: "Variables",
      variableNamePlaceholder: "Variable name",
      variableValuePlaceholder: "Variable value",
      noVariablesText: "No variables configured"
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
      sendTextMessage: "Send text message"
    },
    whatsapp: {
      headerTitle: "WhatsApp Business",
      online: "online",
      offline: "offline",
      about: "About",
      businessInfo: "Business Info",
      website: "cloudflow.com",
      email: "support@cloudflow.com",
      location: "San Francisco, CA",
      aboutDescription: "CloudFlow - Your complete SaaS communication platform",
      typeMessage: "Type a message",
      chatsTitle: "Chats",
      contactInfoTitle: "Business Info",
      video: "Video"
    },
    
    results: {
      noMessages: "No messages sent yet. Configure and test SaaS messaging functionality.",
      messageReceived: "Message received",
      sending: "Sending...",
      sentSuccessfully: "✅ Message sent successfully",
      failed: "❌ Failed to send message",
      messageDelivered: "Message delivered to virtual phone",
      messageContent: "Message content",
      demoMode: "Demo mode",
      sequenceStarting: "Starting message sequence",
      waiting: "Waiting",
      sequenceCompleted: "Sequence completed",
      updated: "Updated"
    }
  },
  
  // ====== JOURNEY STEPS ======
  journeySteps: [
    {
      id: "onboarding",
      title: "User Onboarding",
      description: "Welcome new users",
      icon: "👋",
      messageIds: ["welcome-user", "trial-activation"]
    },
    {
      id: "activation",
      title: "Feature Activation", 
      description: "Guide feature adoption",
      icon: "🚀",
      messageIds: ["feature-tutorial", "setup-reminder"]
    },
    {
      id: "engagement",
      title: "User Engagement",
      description: "Drive platform usage",
      icon: "📈",
      messageIds: ["usage-insights", "new-feature-announcement"]
    },
    {
      id: "retention",
      title: "Customer Retention",
      description: "Prevent churn",
      icon: "🔄",
      messageIds: ["renewal-reminder", "support-offer"]
    },
    {
      id: "expansion", 
      title: "Account Expansion",
      description: "Upgrade opportunities",
      icon: "⬆️",
      messageIds: ["upgrade-offer", "usage-limit-warning"]
    }
  ],
  
  // ====== SAAS MESSAGE TEMPLATES ======
  messageTemplates: [
    {
      id: "welcome-user",
      title: "Welcome New User",
      description: "Onboard new users with setup guidance",
      emoji: "👋",
      category: "transactional",
      messageContent: "Welcome to {{brandName}}! 🎉 Your account is ready. Complete your setup in 3 minutes to unlock powerful automation: {{setupUrl}} Need help? Reply HELP",
      variables: { 
        setupUrl: "https://cloudflow.com/setup"
      },
      apiAction: "welcome-user",
      buttonText: "Send Welcome"
    },
    
    {
      id: "trial-activation",
      title: "Trial Activation",
      description: "Activate trial features immediately", 
      emoji: "🚀",
      category: "marketing",
      messageContent: "Your {{brandName}} free trial is live! 🚀 {{trialDays}} days to explore premium features. Start with our Quick Setup Guide: {{guideUrl}} Questions? Text SUPPORT",
      variables: { 
        trialDays: "14",
        guideUrl: "https://cloudflow.com/quick-start"
      },
      apiAction: "trial-activation",
      buttonText: "Activate Trial"
    },
    
    {
      id: "feature-tutorial",
      title: "Feature Tutorial",
      description: "Guide users through key features",
      emoji: "🎯",
      category: "notification",
      messageContent: "💡 Pro tip: Did you know {{brandName}} can automate {{feature}}? This could save you {{timeSaved}} per week! Watch 2-min tutorial: {{tutorialUrl}} Reply SKIP to disable tips",
      variables: { 
        feature: "customer follow-up emails",
        timeSaved: "5 hours",
        tutorialUrl: "https://cloudflow.com/tutorials/automation"
      },
      apiAction: "feature-tutorial",
      buttonText: "Send Tutorial"
    },
    
    {
      id: "setup-reminder",
      title: "Setup Reminder",
      description: "Nudge incomplete setups",
      emoji: "⚙️",
      category: "notification",
      messageContent: "⚙️ Quick reminder: Complete your {{brandName}} setup to start seeing results! {{completionPercentage}}% done. Finish now: {{setupUrl}} Takes under 5 minutes",
      variables: { 
        completionPercentage: "60",
        setupUrl: "https://cloudflow.com/setup/continue"
      },
      apiAction: "setup-reminder", 
      buttonText: "Send Reminder"
    },
    
    {
      id: "usage-insights",
      title: "Usage Insights",
      description: "Share user analytics and achievements",
      emoji: "📊",
      category: "notification",
      messageContent: "📊 {{brandName}} Weekly Report: You've processed {{eventCount}} events this week (+{{growthPercent}}% vs last week)! View detailed insights: {{dashboardUrl}} Reply STOP to opt out",
      variables: { 
        eventCount: "1,247",
        growthPercent: "23",
        dashboardUrl: "https://cloudflow.com/dashboard/insights"
      },
      apiAction: "usage-insights",
      buttonText: "Send Insights"
    },
    
    {
      id: "new-feature-announcement",
      title: "New Feature Launch",
      description: "Announce product updates",
      emoji: "✨",
      category: "marketing",
      messageContent: "✨ NEW: {{featureName}} is here! {{description}} Early access for existing users: {{featureUrl}} What do you think? Reply with feedback!",
      variables: { 
        featureName: "Smart Analytics Dashboard",
        description: "Get AI-powered insights into your customer behavior patterns.",
        featureUrl: "https://cloudflow.com/features/smart-analytics"
      },
      apiAction: "new-feature-announcement",
      buttonText: "Announce Feature"
    },
    
    {
      id: "renewal-reminder",
      title: "Subscription Renewal",
      description: "Remind about upcoming renewals",
      emoji: "💳",
      category: "transactional",
      messageContent: "💳 Your {{brandName}} subscription renews in {{daysLeft}} days ({{renewalDate}}). Current plan: {{planName}} - ${{amount}}/mo. Manage subscription: {{billingUrl}} Questions? Reply BILLING",
      variables: { 
        daysLeft: "7",
        renewalDate: "March 15th",
        planName: "Professional",
        amount: "49",
        billingUrl: "https://cloudflow.com/billing"
      },
      apiAction: "renewal-reminder",
      buttonText: "Send Renewal Notice"
    },
    
    {
      id: "support-offer",
      title: "Proactive Support",
      description: "Offer help based on usage patterns",
      emoji: "🎧",
      category: "notification",
      messageContent: "🎧 We noticed you're exploring {{featureArea}} in {{brandName}}. Want a quick 15-min walkthrough with our team? Book here: {{bookingUrl}} Or reply with questions anytime!",
      variables: { 
        featureArea: "advanced automation workflows",
        bookingUrl: "https://cloudflow.com/book-demo"
      },
      apiAction: "support-offer",
      buttonText: "Offer Support"
    },
    
    {
      id: "upgrade-offer",
      title: "Upgrade Opportunity",
      description: "Suggest plan upgrades",
      emoji: "⬆️",
      category: "marketing",
      messageContent: "⬆️ You're using {{usagePercent}}% of your {{currentPlan}} plan limits! Upgrade to {{suggestedPlan}} for unlimited access + {{bonusFeature}}: {{upgradeUrl}} Questions? Text UPGRADE",
      variables: { 
        usagePercent: "87",
        currentPlan: "Starter",
        suggestedPlan: "Professional", 
        bonusFeature: "priority support",
        upgradeUrl: "https://cloudflow.com/upgrade"
      },
      apiAction: "upgrade-offer",
      buttonText: "Suggest Upgrade"
    },
    
    {
      id: "usage-limit-warning",
      title: "Usage Limit Warning", 
      description: "Alert about approaching limits",
      emoji: "⚠️",
      category: "transactional",
      messageContent: "⚠️ {{brandName}} Alert: You've used {{usagePercent}}% of your monthly {{resource}} limit. {{remainingAmount}} remaining. Upgrade or optimize usage: {{actionUrl}} Need help? Reply HELP",
      variables: { 
        usagePercent: "85",
        resource: "API calls",
        remainingAmount: "1,500 calls",
        actionUrl: "https://cloudflow.com/usage"
      },
      apiAction: "usage-limit-warning",
      buttonText: "Send Warning"
    }
  ],
  
  // ====== SAAS FEATURE CARDS ======
  featureCards: [
    {
      id: "smart-delivery",
      title: "Smart Delivery Optimization",
      description: "AI-powered message timing for maximum engagement",
      emoji: "🎯",
      category: "sms-features",
      featureType: "delivery-optimization",
      channel: "sms",
      demoConfig: {
        mockBehavior: "Analyzes user timezone and engagement patterns",
        virtualPhoneEffect: "Message delivered at optimal time",
        timeDelay: 2000,
        persistEffect: true
      },
      technicalDetails: {
        twilioFeature: "Programmable Messaging - Send Time Optimization",
        documentation: "https://www.twilio.com/docs/messaging/programmable-messaging"
      },
      messageContent: "🎯 Smart delivery engaged! Your message to {{brandName}} users will be sent at optimal engagement times based on their timezone and activity patterns.",
      variables: {},
      apiAction: "smart-delivery",
      buttonText: "Demo Smart Delivery",
      enabled: true
    },
    
    {
      id: "conversation-api",
      title: "Unified Conversations API",
      description: "Single API for SMS, WhatsApp, and chat channels",
      emoji: "💬",
      category: "whatsapp-features", 
      featureType: "conversation-management",
      channel: "whatsapp",
      demoConfig: {
        mockBehavior: "Routes messages through unified conversation thread",
        virtualPhoneEffect: "Conversation context maintained across channels",
        timeDelay: 1500,
        persistEffect: false
      },
      technicalDetails: {
        twilioFeature: "Conversations API",
        documentation: "https://www.twilio.com/docs/conversations"
      },
      messageContent: "💬 Conversations API: This message is routed through {{brandName}}'s unified conversation thread, maintaining context across SMS, WhatsApp, and web chat.",
      variables: {},
      apiAction: "conversation-api",
      buttonText: "Demo Conversations",
      enabled: true
    },
    
    {
      id: "voice-intelligence",
      title: "Voice Intelligence & Analytics",
      description: "AI-powered call analysis and insights",
      emoji: "🧠",
      category: "voice-features",
      featureType: "voice-analytics",
      channel: "voice",
      demoConfig: {
        mockBehavior: "Analyzes call sentiment and extracts key insights",
        virtualPhoneEffect: "AI analyzes call content in real-time",
        timeDelay: 3000,
        persistEffect: true
      },
      technicalDetails: {
        twilioFeature: "Voice Intelligence",
        documentation: "https://www.twilio.com/docs/voice/intelligence"
      },
      messageContent: "🧠 Voice Intelligence analyzing call... Detecting sentiment, extracting topics, and generating insights for {{brandName}} customer success team.",
      variables: {},
      apiAction: "voice-intelligence",
      buttonText: "Demo Voice AI",
      enabled: true
    }
  ],
  
  // ====== VIRTUAL PHONE CONFIGURATION ======
  virtualPhone: {
    deviceName: "CloudFlow Mobile",
    carrierName: "SaaS-Fi",
    signalStrength: 4,
    batteryLevel: 95,
    currentTime: "9:41 AM",
    defaultApp: "messages",
    phoneNumber: "+1 (555) SAAS-DEMO",
    contactName: "CloudFlow Support",
    messageTheme: "saas-theme",
    apps: [
      {
        id: "messages",
        name: "Messages",
        icon: "💬",
        backgroundColor: "#4F46E5",
        textColor: "#FFFFFF"
      },
      {
        id: "whatsapp", 
        name: "WhatsApp",
        icon: "📱",
        backgroundColor: "#25D366",
        textColor: "#FFFFFF"
      },
      {
        id: "phone",
        name: "Phone", 
        icon: "📞",
        backgroundColor: "#06B6D4",
        textColor: "#FFFFFF"
      }
    ],
    voiceSettings: {
      autoEndCalls: false,
      callDurationSeconds: undefined,
      showCallHistory: true,
      maxCallHistoryItems: 15,
      enableMockContacts: true,
      mockContacts: [
        {
          id: "cto",
          name: "Sarah Chen", 
          number: "+1 (555) CTO-CALL",
          avatar: "👩‍💻",
          company: "CloudFlow CTO"
        },
        {
          id: "support",
          name: "Tech Support",
          number: "+1 (555) SUPPORT",
          avatar: "🎧", 
          company: "Customer Success"
        },
        {
          id: "sales",
          name: "Sales Team",
          number: "+1 (555) UPGRADE",
          avatar: "📈",
          company: "Business Development"
        }
      ]
    }
  },
  
  // ====== MESSAGE THEMES ======
  messageThemes: [
    {
      id: "saas-theme",
      name: "SaaS Professional",
      type: "sms",
      bubbleColor: "#4F46E5",
      textColor: "#FFFFFF", 
      backgroundColor: "#F8FAFC",
      borderRadius: "18px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      showTimestamp: true,
      showDeliveryStatus: true
    }
  ]
};