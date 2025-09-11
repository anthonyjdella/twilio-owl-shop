# Voice Channel Configuration Guide

All Voice channel functionality is now fully configurable through the config files. Here's a comprehensive guide to all available Voice configuration options:

## 🔧 Main Configuration (demo-config.ts)

### **features.voiceTemplateIds**
```typescript
voiceTemplateIds: [
  'interactive-ivr', 
  'appointment-reminder-voice', 
  'delivery-notification-voice', 
  'voice-survey-interactive', 
  'payment-reminder-voice', 
  'emergency-alert-voice', 
  'conference-call-voice', 
  'voice-authentication'
]
```
- **Purpose**: Defines which message templates appear when Voice channel is selected
- **Customizable**: Add/remove template IDs to control available voice demos

### **features.phoneSettings**
```typescript
phoneSettings: {
  defaultPhoneNumber: '+1 (555) 123-4567',
  enableRealCalls: true,
  callAutoEndTime: undefined // undefined = manual hang up only
}
```
- **defaultPhoneNumber**: Fallback number used when no number is provided
- **enableRealCalls**: Controls whether real Twilio calls are made
- **callAutoEndTime**: Auto-hang up time (undefined = manual only)

## 📱 Virtual Phone Configuration

### **virtualPhone.voiceSettings**
```typescript
voiceSettings: {
  autoEndCalls: false,           // Manual hang up only
  callDurationSeconds: undefined, // Unlimited duration
  showCallHistory: true,         // Show Recent tab
  maxCallHistoryItems: 10,       // Limit call history
  enableMockContacts: true,      // Show demo contacts
  mockContacts: [...]            // Configurable contact list
}
```

#### **Voice Settings Details:**

**autoEndCalls**: `boolean`
- `true`: Calls end automatically after `callDurationSeconds`
- `false`: Manual hang up required

**callDurationSeconds**: `number | undefined`
- Number of seconds before auto-hang up
- `undefined`: No auto-hang up (manual only)

**showCallHistory**: `boolean`
- `true`: Shows "Recent" tab in phone app
- `false`: Hides call history tab

**maxCallHistoryItems**: `number`
- Maximum number of calls to keep in history
- Older calls are automatically removed

**enableMockContacts**: `boolean`
- `true`: Shows configured demo contacts
- `false`: Empty contacts list

**mockContacts**: `Array<Contact>`
- Fully customizable contact list
- Each contact has: `id`, `name`, `number`, `avatar`, `company`

## 🎤 Voice Message Templates

All 8 voice templates are fully configurable in `messageTemplates` array:

### Template Structure:
```typescript
{
  id: "interactive-ivr",
  title: "Interactive Voice Response (IVR)",
  description: "Smart phone menus with voice prompts and keypad input",
  emoji: "🎤",
  category: "transactional",
  messageContent: "Thank you for calling {{brandName}}! For Sales, press 1...",
  variables: {},
  apiAction: "ivr-demo",
  buttonText: "Demo IVR System"
}
```

### Available Voice Templates:
1. **Interactive IVR** - Phone menu systems
2. **Voice Appointment Reminder** - Automated appointment calls
3. **Delivery Status Call** - Order/delivery notifications
4. **Interactive Voice Survey** - Customer feedback collection
5. **Payment Due Notification** - Billing reminders
6. **Emergency Voice Alert** - Mass notification system
7. **Conference Call Invitation** - Multi-party calls
8. **Voice Security Verification** - Two-factor authentication

## 🌍 Environment Variables

### **Voice API Configuration (.env.local)**
```bash
# Twilio Credentials (for real calls)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Voice Settings
ENABLE_REAL_VOICE_CALLS=true  # Set to 'false' to disable real calls
```

## 🎯 Customization Examples

### **Disable Real Calls (Demo Only)**
```typescript
features: {
  phoneSettings: {
    enableRealCalls: false,
    defaultPhoneNumber: '+1 (555) DEMO-CALL'
  }
}
```

### **Auto-End Calls After 30 Seconds**
```typescript
virtualPhone: {
  voiceSettings: {
    autoEndCalls: true,
    callDurationSeconds: 30
  }
}
```

### **Custom Voice Templates Only**
```typescript
features: {
  voiceTemplateIds: [
    'my-custom-voice-template',
    'another-custom-template'
  ]
}
```

### **Hide Call History**
```typescript
virtualPhone: {
  voiceSettings: {
    showCallHistory: false,
    maxCallHistoryItems: 0
  }
}
```

### **Custom Contacts**
```typescript
virtualPhone: {
  voiceSettings: {
    enableMockContacts: true,
    mockContacts: [
      {
        id: 'ceo',
        name: 'Company CEO',
        number: '+1 (555) CEO-CALL',
        avatar: '👔',
        company: 'Executive Team'
      }
    ]
  }
}
```

## 🚀 Key Benefits

✅ **Fully Configurable** - Every aspect can be customized
✅ **Environment-Based** - Different settings for dev/prod
✅ **Real Integration** - Works with actual Twilio Voice API
✅ **Demo-Friendly** - Can run entirely in demo mode
✅ **Business-Ready** - Professional voice use cases
✅ **Scalable** - Easy to add new voice templates

## 🔄 Making Changes

1. **Add New Voice Template**: Add to `messageTemplates` array and include ID in `voiceTemplateIds`
2. **Change Phone Behavior**: Modify `virtualPhone.voiceSettings`
3. **Control Real Calls**: Set `ENABLE_REAL_VOICE_CALLS` environment variable
4. **Update Contacts**: Modify `mockContacts` array
5. **Customize UI**: All phone interface elements use configuration values

Everything is now configurable - no hardcoded values remain in the Voice channel implementation!