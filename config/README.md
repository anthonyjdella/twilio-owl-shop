# Dynamic SMS Demo Configuration System

This configuration system allows users to easily customize all aspects of the SMS demo experience without touching code.

## Quick Start

1. **Visit the Dynamic Demo**: Navigate to `/dynamic-sms-demo`
2. **Open Configuration Panel**: Click the ⚙️ button in the bottom-right corner
3. **Customize Your Demo**: Modify colors, messages, phone settings, and more
4. **Test Your Changes**: See changes reflected immediately in the demo

## Configuration Files

### `demo-config.ts`
The main configuration file that defines:
- **Message Templates**: Customizable SMS messages with variables
- **Virtual Phone Settings**: Device appearance, carrier, battery, etc.
- **Message Themes**: How messages appear (SMS, iMessage, WhatsApp, RCS styles)
- **Brand Colors**: Primary, secondary, accent colors throughout the demo
- **Journey Steps**: Customer journey flow configuration

## Key Features

### 🎨 **Fully Customizable Branding**
- Change demo title, subtitle, and brand name
- Customize all colors (primary, secondary, accent, background, text)
- Brand colors automatically apply throughout the entire demo

### 📱 **Interactive Virtual Phone**
- Realistic phone interface with status bar, apps, and navigation
- Switch between Messages, Phone, and WhatsApp apps
- Customizable device name, carrier, signal strength, battery level
- Messages appear in real-time when demo tests are run

### 💬 **Message Theming System**
Choose how messages appear in the virtual phone:
- **iMessage**: Blue bubbles with delivery status
- **SMS/Android**: Gray bubbles, simple styling
- **WhatsApp**: Green bubbles with avatars
- **RCS Business**: Professional branded messaging

### 📝 **Dynamic Message Templates**
Each message template includes:
- **Title & Description**: What the message does
- **Category**: marketing, transactional, notification, authentication
- **Message Content**: Template with variables like `{{brandName}}`, `{{customerName}}`
- **Variables**: Default values for template substitution
- **API Action**: Which Twilio API endpoint to call
- **Custom Styling**: Button colors and emoji

### 🔄 **Real-Time Configuration**
- Changes apply immediately without page refresh
- Live preview of colors and styling
- Interactive phone responds to configuration changes
- Reset to defaults option available

## Message Template Variables

Templates support these variable types:

### **Standard Variables**
- `{{brandName}}` - From config.brandName
- `{{customerName}}` - Default: "Demo User"
- `{{phoneNumber}}` - User's input phone number
- `{{orderNumber}}` - Generated: "OWL" + timestamp
- `{{cartTotal}}` - Default: "$247.50"
- `{{itemCount}}` - Default: 3

### **Dynamic Variables**
- `{{timestamp}}` - Current timestamp
- `{{randomOTP}}` - 6-digit OTP code
- Custom variables can be added per template

## Phone Apps Configuration

The virtual phone supports multiple apps:

### **Messages App** (Default)
- Shows SMS conversation thread
- Displays messages with chosen theme styling
- Realistic message bubbles and timestamps
- Delivery status indicators

### **Phone App**
- Basic phone interface placeholder
- Can be extended for call demonstrations
- Shows concept for voice call integration

### **WhatsApp App**
- WhatsApp-style interface
- Demonstrates RCS/business messaging concepts
- Green theme with business messaging styling

## Customization Examples

### **E-commerce Store**
```typescript
const ecommerceConfig = {
  title: "SHOPIFY SMS MARKETING DEMO",
  brandName: "Fashion Forward",
  brandColors: {
    primary: "#6366F1", // Indigo
    secondary: "#1F2937", // Dark gray
    accent: "#10B981", // Green
    background: "#F8FAFC", // Light gray
    text: "#64748B" // Slate
  }
}
```

### **Restaurant Chain**
```typescript
const restaurantConfig = {
  title: "RESTAURANT NOTIFICATION SYSTEM",
  brandName: "Tasty Bites",
  virtualPhone: {
    contactName: "Tasty Bites",
    messageTheme: "rcs" // Professional messaging
  },
  messageTemplates: [
    {
      id: "order-ready",
      title: "Order Ready",
      messageContent: "🍕 Your {{brandName}} order #{{orderNumber}} is ready for pickup! Location: {{location}}"
    }
  ]
}
```

### **Healthcare Provider**
```typescript
const healthcareConfig = {
  title: "PATIENT COMMUNICATION PLATFORM",
  brandName: "MedConnect",
  messageTemplates: [
    {
      id: "appointment-reminder",
      category: "notification",
      messageContent: "📅 Reminder: You have an appointment with {{doctorName}} tomorrow at {{time}}. Reply YES to confirm."
    }
  ]
}
```

## Integration with Twilio APIs

The system automatically maps message templates to Twilio API calls:

- **Real SMS**: Sent via Twilio to actual phone numbers
- **Virtual Phone**: Mock messages displayed in the phone interface
- **API Features**: Risk Check, Message Intent, Consent API, Contact API
- **Demo Mode**: Works without Twilio credentials (console logging)

## Extensibility

The configuration system is designed to be easily extended:

### **Adding New Message Types**
1. Add template to `messageTemplates` array
2. Implement API handler in `/api/sms/route.ts`
3. Template automatically appears in demo interface

### **Adding New Phone Apps**
1. Add app to `virtualPhone.apps` array
2. Implement app interface in `VirtualPhone.tsx`
3. App becomes available in phone navigation

### **Adding New Message Themes**
1. Add theme to `messageThemes` array
2. Define colors, fonts, and styling properties
3. Theme becomes selectable in configuration panel

## Best Practices

### **Message Content**
- Keep messages under 160 characters when possible
- Include clear opt-out instructions for marketing messages
- Use variables for personalization
- Test with various template variable values

### **Brand Consistency**
- Choose colors that work well together
- Ensure sufficient contrast for readability
- Test color combinations on different screens
- Consider accessibility requirements

### **Demo Flow**
- Arrange message templates in logical customer journey order
- Use appropriate categories for filtering
- Test complete sequences before presentations
- Have fallback content for demo mode

## Configuration Panel Guide

### **General Tab**
- Demo title and subtitle
- Brand name (appears in all message templates)
- Brand color palette with color picker and hex inputs

### **Phone Tab**
- Virtual phone device settings
- Carrier name, signal strength, battery level
- Contact information and default app selection
- Message theme selection

### **Themes Tab**
- Customize message bubble appearance
- Colors for different messaging platforms
- Typography and spacing options

### **Messages Tab**
- Overview of all message templates
- Quick preview of message content
- Category and emoji assignments

## Troubleshooting

### **Colors Not Applying**
- Check if hex color codes are valid
- Some colors may need browser refresh
- Reset to defaults if styling breaks

### **Virtual Phone Not Receiving Messages**
- Ensure phone is "awake" (screen on)
- Check if Messages app is accessible
- Try switching to different phone app and back

### **Template Variables Not Working**
- Verify variable names match exactly (case-sensitive)
- Check for typos in curly braces: `{{variableName}}`
- Some variables require additional data input

### **Configuration Panel Not Opening**
- Look for ⚙️ button in bottom-right corner
- Try refreshing the page
- Check browser console for JavaScript errors

## Advanced Usage

For developers wanting to extend the system further, see:
- `config/demo-config.ts` - Main configuration schema
- `components/VirtualPhone.tsx` - Phone interface component
- `components/DynamicMessageCard.tsx` - Message template cards
- `components/ConfigPanel.tsx` - Configuration interface

The system is built with TypeScript for type safety and uses React hooks for state management.