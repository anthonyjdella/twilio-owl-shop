# 🚀 5-Minute Demo Customization

## Step 1: Copy Sample Config (30 seconds)
```bash
cp config/sample-config.ts config/my-demo.ts
```

## Step 2: Update Your Branding (2 minutes)
Edit `config/my-demo.ts`:

```typescript
export const myDemoConfig: DemoConfig = {
  // Change these 4 lines for instant branding
  title: "ACME CORP SMS DEMO",
  subtitle: "See how ACME Corp connects with customers",
  brandName: "ACME Corp",
  brandColors: {
    primary: "#FF6B35",    // Your brand color
    secondary: "#2C3E50",  // Dark color for headers
    accent: "#3498DB",     // Accent color
    background: "#ECF0F1", // Light background
    text: "#7F8C8D"        // Text color
  }
}
```

## Step 3: Use Your Config (30 seconds)
In `app/dynamic-sms-demo/page.tsx`:

```typescript
// Replace this line:
import { defaultDemoConfig } from "@/config/demo-config";

// With this:
import { myDemoConfig } from "@/config/my-demo";

// And change:
const [config, setConfig] = useState(myDemoConfig);
```

## Step 4: Test (2 minutes)
1. Run `npm run dev`
2. Visit `/dynamic-sms-demo`  
3. See your branded demo!

---

## 🎯 Quick Wins

### Hide Features You Don't Need
```typescript
features: {
  enableVirtualPhone: false,      // Hide phone preview
  enableJourneyFlow: false,       // Hide customer journey
  availableChannels: ['sms'],     // Only show SMS
}
```

### Change Phone Contact Info  
```typescript
virtualPhone: {
  contactName: "ACME Corp",
  phoneNumber: "+1 (555) ACME-123",
  carrierName: "ACME Mobile"
}
```

### Update Section Titles
```typescript
uiText: {
  sections: {
    phoneNumber: "CUSTOMER CONTACT",
    demoActions: "QUICK ACTIONS",
    virtualPhone: "MESSAGE PREVIEW"
  }
}
```

## 🎨 Color Schemes

### Blue Corporate
```typescript
brandColors: {
  primary: "#2563EB",    // Blue
  secondary: "#1E293B",  // Dark slate  
  accent: "#0891B2",     // Cyan
  background: "#F8FAFC", // Light blue-gray
  text: "#64748B"        // Medium gray
}
```

### Green Healthcare
```typescript
brandColors: {
  primary: "#059669",    // Medical green
  secondary: "#1F2937",  // Dark gray
  accent: "#0891B2",     // Blue accent
  background: "#F0FDF4", // Very light green
  text: "#6B7280"        // Gray text
}
```

### Purple Tech
```typescript
brandColors: {
  primary: "#7C3AED",    // Purple
  secondary: "#111827",  // Almost black
  accent: "#F59E0B",     // Orange accent
  background: "#FAF5FF", // Light purple
  text: "#6B7280"        // Gray
}
```

## ✅ Done!

Your demo is now branded and ready to show clients. 

Want more customization? Check `config/README.md` for advanced options.