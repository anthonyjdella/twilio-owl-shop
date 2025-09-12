// Healthcare Configuration Template
// Perfect for hospitals, clinics, medical practices, and healthcare providers

import { DemoConfig } from '../demo-config';

export const healthcareConfig: DemoConfig = {
  // ====== BRAND IDENTITY ======
  title: "HEALTHCARE SMS PLATFORM",
  subtitle: "Improve patient communication and reduce no-shows with HIPAA-compliant messaging",
  brandName: "MedFlow",
  
  // ====== BRAND COLORS ======
  brandColors: {
    primary: "#3B82F6",    // Medical blue - trust and professionalism
    secondary: "#1E40AF",  // Dark blue - authority
    accent: "#059669",     // Medical green - health and healing
    background: "#F8FAFC", // Clean clinical white-blue
    text: "#475569"        // Professional gray
  },
  
  // ====== FEATURE CONFIGURATION ======
  features: {
    enableRichMessaging: true,
    enableVirtualPhone: true,
    enableConfigPanel: true,
    enableJourneyFlow: true,
    enableChannelSelection: true,
    availableChannels: ['sms', 'voice'], // Healthcare focuses on SMS and Voice
    defaultChannel: 'sms',
    enableContentTypes: true,
    availableContentTypes: ['text', 'richCard'], // Simple, HIPAA-compliant options
    voiceTemplateIds: [
      'appointment-reminder-voice',
      'voice-authentication',
      'emergency-alert-voice'
    ],
    phoneSettings: {
      defaultPhoneNumber: '+1 (555) MED-CARE',
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
  
  // ====== HEALTHCARE MESSAGE TEMPLATES ======
  messageTemplates: [
    {
      id: "appointment-reminder",
      title: "Appointment Reminder",
      description: "Reduce no-shows with timely reminders",
      emoji: "🏥",
      category: "notification",
      messageContent: "Reminder: Your appointment with Dr. {{doctorName}} at {{brandName}} is {{appointmentDate}} at {{appointmentTime}}. Reply C to confirm or R to reschedule.",
      variables: {
        doctorName: "Smith",
        appointmentDate: "tomorrow",
        appointmentTime: "2:30 PM"
      },
      apiAction: "appointment-reminder",
      buttonText: "Send Reminder"
    },
    
    {
      id: "lab-results",
      title: "Lab Results Ready",
      description: "Notify patients when test results are available",
      emoji: "🧪",
      category: "notification",
      messageContent: "Your lab results from {{testDate}} are ready for review at {{brandName}}. Please call {{phoneNumber}} or log into the patient portal to discuss with Dr. {{doctorName}}.",
      variables: {
        testDate: "Monday",
        phoneNumber: "(555) MED-CARE",
        doctorName: "Johnson"
      },
      apiAction: "lab-results",
      buttonText: "Notify Results Ready"
    },
    
    {
      id: "medication-reminder",
      title: "Medication Reminder",
      description: "Help patients stay compliant with prescriptions",
      emoji: "💊",
      category: "notification",
      messageContent: "💊 Medication Reminder: Time to take your {{medicationName}} ({{dosage}}). Remember to take with food. Questions? Call {{brandName}} at {{phoneNumber}}.",
      variables: {
        medicationName: "Blood Pressure Medication",
        dosage: "10mg",
        phoneNumber: "(555) MED-CARE"
      },
      apiAction: "medication-reminder",
      buttonText: "Send Med Reminder"
    },
    
    {
      id: "preventive-care",
      title: "Preventive Care Alert",
      description: "Remind patients about annual checkups and screenings",
      emoji: "🔍",
      category: "notification",
      messageContent: "🔍 It's time for your annual {{screeningType}} at {{brandName}}. Early detection saves lives. Schedule today: {{phoneNumber}} or {{portalUrl}}",
      variables: {
        screeningType: "mammogram",
        phoneNumber: "(555) MED-CARE",
        portalUrl: "https://medflow.com/schedule"
      },
      apiAction: "preventive-care",
      buttonText: "Send Screening Reminder"
    },
    
    {
      id: "insurance-verification",
      title: "Insurance Verification",
      description: "Verify patient insurance before appointments",
      emoji: "📋",
      category: "transactional",
      messageContent: "📋 Please verify your insurance info before your {{appointmentDate}} appointment at {{brandName}}. Call {{phoneNumber}} or update online: {{portalUrl}}",
      variables: {
        appointmentDate: "Friday",
        phoneNumber: "(555) MED-CARE",
        portalUrl: "https://medflow.com/insurance"
      },
      apiAction: "insurance-verification",
      buttonText: "Request Verification"
    },
    
    {
      id: "telehealth-link",
      title: "Telehealth Appointment",
      description: "Send secure video call links for virtual visits",
      emoji: "💻",
      category: "transactional",
      messageContent: "💻 Your telehealth appointment with Dr. {{doctorName}} starts in {{timeUntil}}. Join here: {{meetingLink}} Need help? Call {{phoneNumber}}",
      variables: {
        doctorName: "Wilson",
        timeUntil: "15 minutes",
        meetingLink: "https://medflow.com/meet/secure123",
        phoneNumber: "(555) MED-CARE"
      },
      apiAction: "telehealth-link",
      buttonText: "Send Meeting Link"
    }
  ],
  
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
      description: "HIPAA-compliant text messages",
      icon: "💬",
      enabled: true,
      defaultValues: {},
      customFields: []
    },
    richCard: {
      name: "Patient Information Card",
      description: "Structured patient communications",
      icon: "🏥",
      enabled: true,
      defaultValues: {
        cardTitle: "🏥 Important Health Information",
        cardSubtitle: "Please review this message carefully",
        cardBody: "Your healthcare team has important information to share with you.",
        cardImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
        interactiveType: "buttons"
      },
      customFields: [
        { name: "cardTitle", type: "text", label: "Health Alert Title", required: true },
        { name: "cardSubtitle", type: "text", label: "Alert Description" },
        { name: "cardBody", type: "textarea", label: "Detailed Information" },
        { name: "cardImage", type: "url", label: "Medical Image URL" }
      ]
    },
    media: {
      name: "Medical Document",
      description: "Secure document sharing",
      icon: "📄",
      enabled: false, // Disabled for HIPAA compliance
      defaultValues: {},
      customFields: []
    },
    carousel: {
      name: "Health Tips Carousel",
      description: "Multiple health education cards",
      icon: "📚",
      enabled: false, // Simplified for healthcare
      defaultValues: {},
      customFields: []
    },
    listMessage: {
      name: "Service Directory",
      description: "List of available services",
      icon: "📋",
      enabled: false,
      defaultValues: {},
      customFields: []
    }
  },
  
  // ====== UI TEXT CUSTOMIZATION ======
  uiText: {
    sections: {
      phoneNumber: "PATIENT PHONE",
      demoActions: "PATIENT COMMUNICATIONS",
      customerJourney: "PATIENT CARE JOURNEY",
      messageTemplates: "Healthcare Messages",
      virtualPhone: "PATIENT PHONE PREVIEW",
      resultsLog: "COMMUNICATION LOG"
    },
    
    buttons: {
      completeJourney: "🏥 Run Patient Journey",
      clearResults: "🗑️ Clear Log",
      clearLog: "Clear",
      editMessage: "Customize",
      cancelEdit: "Cancel",
      saveChanges: "Save Changes",
      addVariable: "+ Add Field",
      cancel: "Cancel",
      add: "Add"
    },
    
    forms: {
      phoneNumberPlaceholder: "+1 (555) 123-4567",
      messageContentLabel: "Message:",
      messagePreviewLabel: "Preview:",
      variablesLabel: "Patient Data:",
      variableNamePlaceholder: "Field name",
      variableValuePlaceholder: "Value",
      noVariablesText: "No patient data fields. Click 'Add' to create one."
    },
    
    twilioStatus: {
      title: "HEALTHCARE SMS STATUS",
      mode: "Mode:",
      accountSid: "Account:",
      phoneNumber: "Number:",
      demoMode: "🎭 DEMO MODE",
      liveMode: "📱 LIVE MODE",
      demoModeDescription: "💡 Demo mode - HIPAA-compliant messaging preview."
    },
    
    virtualPhone: {
      tapToWake: "Tap to view patient phone",
      demoModeDisabled: "Demo mode - patient view",
      noMessagesYet: "No messages yet",
      messagesWillAppearHere: "Patient messages will appear here",
      contactInfo: "Healthcare Provider",
      back: "← Back",
      call: "Call Clinic",
      message: "Text Clinic",
      email: "Email Clinic",
      notes: "Medical Notes",
      recentActivity: "Recent Communications",
      noRecentMessages: "No recent messages",
      sendTextMessage: "Message healthcare provider"
    },

    whatsapp: {
      headerTitle: "MedFlow Clinic",
      online: "Available now",
      offline: "Usually replies within 1 hour",
      about: "About Our Practice",
      businessInfo: "Healthcare Information",
      website: "medflow.com",
      email: "info@medflow.com",
      location: "Healthcare Practice",
      aboutDescription: "Welcome to MedFlow! 🏥 Your trusted healthcare partner providing quality care and communication.",
      typeMessage: "Type a message",
      chatsTitle: "WhatsApp",
      contactInfoTitle: "Clinic Info",
      video: "Video Call"
    },
    
    results: {
      noMessages: "No patient communications sent yet. Start your healthcare messaging.",
      messageReceived: "📱 Patient received:",
      sending: "🚀 Sending message",
      sentSuccessfully: "✅ delivered",
      failed: "❌ Failed:",
      messageDelivered: "📱 Message delivered to patient",
      messageContent: "📋 Message Content:",
      demoMode: "📋 Demo Mode:",
      sequenceStarting: "🏥 Starting patient journey",
      waiting: "⏳ Waiting",
      sequenceCompleted: "✅ Journey completed!",
      updated: "📝 Updated message:"
    }
  },
  
  // ====== VIRTUAL PHONE SETUP ======
  virtualPhone: {
    deviceName: "iPhone 15 Pro",
    carrierName: "MedFlow Health",
    signalStrength: 4,
    batteryLevel: 95,
    currentTime: "9:41 AM",
    defaultApp: "messages",
    phoneNumber: "+1 (555) MED-CARE",
    contactName: "MedFlow Clinic",
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
          name: 'Dr. Sarah Johnson',
          number: '+1 (555) 123-4567',
          avatar: '👩‍⚕️',
          company: 'Internal Medicine'
        },
        {
          id: '2',
          name: 'Pharmacy',
          number: '+1 (555) 987-6543',
          avatar: '💊',
          company: 'MedFlow Pharmacy'
        },
        {
          id: '3',
          name: 'Appointment Line',
          number: '+1 (555) MED-CARE',
          avatar: '📅',
          company: 'Scheduling'
        }
      ]
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
    }
  ],
  
  // ====== PATIENT CARE JOURNEY ======
  journeySteps: [
    {
      id: "appointment-management",
      title: "Appointments",
      description: "Scheduling and reminders",
      icon: "🏥",
      messageIds: ["appointment-reminder"]
    },
    {
      id: "test-results",
      title: "Lab Results",
      description: "Test result notifications",
      icon: "🧪",
      messageIds: ["lab-results"]
    },
    {
      id: "medication-management",
      title: "Medications",
      description: "Prescription reminders",
      icon: "💊",
      messageIds: ["medication-reminder"]
    },
    {
      id: "preventive-care",
      title: "Preventive Care",
      description: "Health screenings and checkups",
      icon: "🔍",
      messageIds: ["preventive-care"]
    },
    {
      id: "telehealth",
      title: "Virtual Visits",
      description: "Remote consultations",
      icon: "💻",
      messageIds: ["telehealth-link"]
    }
  ],
  
  // ====== RICH MESSAGE TYPES ======
  richMessageTypes: {
    text: {
      id: "text",
      name: "Text Message",
      description: "HIPAA-compliant text messages",
      icon: "💬",
      available: ["sms"],
      customizable: {
        variables: true
      }
    },
    media: {
      id: "media",
      name: "Medical Document",
      description: "Secure document sharing",
      icon: "📄",
      available: ["sms"],
      customizable: {
        variables: true,
        mediaUrl: true,
        mediaType: true,
        caption: true
      },
      mediaUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      mediaType: "image",
      caption: "Important health information"
    },
    richCard: {
      id: "richCard",
      name: "Patient Information Card",
      description: "Structured health communications",
      icon: "🏥",
      available: ["sms"],
      customizable: {
        variables: true,
        cardTitle: true,
        cardSubtitle: true,
        cardImage: true,
        buttons: true,
        quickReplies: true
      },
      cardTitle: "🏥 Important Health Information",
      cardSubtitle: "Please review this message carefully",
      cardImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
      buttons: [
        { title: "Schedule Appointment", type: "phone", payload: "+1-555-MED-CARE" },
        { title: "Patient Portal", type: "url", url: "https://medflow.com/portal" },
        { title: "Call Nurse Line", type: "phone", payload: "+1-555-NURSE" }
      ],
      quickReplies: [
        { title: "I understand", payload: "understood" },
        { title: "Need clarification", payload: "clarify" },
        { title: "Schedule follow-up", payload: "followup" }
      ]
    },
    carousel: {
      id: "carousel",
      name: "Health Tips",
      description: "Multiple health education cards",
      icon: "📚",
      available: ["sms"],
      customizable: {
        variables: true,
        items: true,
        cardCount: true
      },
      maxCards: 5, // Simplified for healthcare
      items: [
        {
          id: "1",
          title: "Take Medications",
          subtitle: "Follow your prescription schedule",
          image: "💊",
          buttons: [
            { title: "Set Reminder", type: "reply", payload: "med_reminder" }
          ]
        },
        {
          id: "2",
          title: "Exercise Regularly",
          subtitle: "Stay active for better health",
          image: "🏃‍♀️",
          buttons: [
            { title: "View Tips", type: "reply", payload: "exercise_tips" }
          ]
        }
      ]
    },
    listMessage: {
      id: "listMessage",
      name: "Service Directory",
      description: "Healthcare services list",
      icon: "📋",
      available: ["sms"],
      customizable: {
        variables: true,
        header: true,
        footer: true,
        sections: true,
        buttonText: true
      },
      header: "Available Healthcare Services",
      footer: "Call (555) MED-CARE for assistance",
      buttonText: "View Services",
      sections: [
        {
          title: "Primary Care",
          rows: [
            { id: "checkup", title: "Annual Checkup", description: "Comprehensive health examination" },
            { id: "sick_visit", title: "Sick Visit", description: "Treatment for acute conditions" }
          ]
        },
        {
          title: "Specialty Care",
          rows: [
            { id: "cardiology", title: "Cardiology", description: "Heart and cardiovascular health" },
            { id: "dermatology", title: "Dermatology", description: "Skin, hair, and nail conditions" }
          ]
        }
      ]
    }
  },
  
  // ====== API CONFIGURATION ======
  apiConfig: {
    enableRiskCheck: true,
    defaultMessageIntent: "notifications", // Healthcare-appropriate intent
    enableConsentAPI: true, // Important for HIPAA compliance
    enableContactAPI: true
  }
};