# Owl Shop - Premium E-commerce Platform

A professional, modern e-commerce web application built with Next.js 15, featuring comprehensive Twilio SMS integration for enhanced customer engagement.

## 🚀 Live Demo

**Production**: [https://your-vercel-url.vercel.app](https://your-vercel-url.vercel.app)  
**Local Development**: `http://localhost:3000`

## ✨ Features

### 🛍️ Core E-commerce Functionality

-   **Product Catalog**: 8 premium clothing items with professional imagery
-   **Advanced Filtering**: Filter by category, brand, price range, size, and color
-   **Search Functionality**: Real-time product search
-   **Product Details**: High-quality image galleries, size/color selection, reviews
-   **Shopping Cart**: Persistent cart with quantity controls and promo codes
-   **Guest & Authenticated Checkout**: Multi-step checkout process
-   **Order Management**: Real-time order tracking with live updates

### 📱 Twilio SMS Integration

-   **Marketing Messages**: Welcome SMS and promotional campaigns
-   **Cart Abandonment**: Automated reminders for incomplete purchases
-   **Order Confirmations**: Instant SMS notifications upon successful orders
-   **Shipping Updates**: Real-time tracking notifications via SMS
-   **Post-Purchase Surveys**: Customer feedback collection
-   **SMS Consent Management**: TCPA-compliant opt-in/opt-out system

### 🎛️ Dynamic SMS Demo (New!)

-   **Fully Configurable Demo**: Customize everything via config files
-   **Virtual Phone Preview**: See how messages appear on mobile devices
-   **Rich Messaging Support**: RCS and WhatsApp interactive content
-   **Brand Customization**: Colors, text, and layouts
-   **No-Code Setup**: Clone and customize in minutes
-   **📖 [Configuration Guide](config/CONFIG-GUIDE.md)** | **⚡ [Quick Start](config/QUICK-START.md)**

### 🎨 Professional Design

-   **Modern UI/UX**: High-end luxury retail aesthetic
-   **Responsive Design**: Optimized for desktop, tablet, and mobile
-   **Professional Typography**: Clean, elegant font choices
-   **Premium Color Scheme**: Sophisticated navy, gold, and neutral tones
-   **Smooth Animations**: Subtle transitions and hover effects
-   **Mobile-First**: Responsive navigation with hamburger menu

### 🔧 Technical Features

-   **TypeScript**: Full type safety throughout the application
-   **Next.js 15**: Latest App Router with server-side rendering
-   **Tailwind CSS**: Utility-first styling with custom components
-   **Local Storage**: Persistent cart and user data
-   **Demo Authentication**: Simulated user accounts for testing
-   **Mock Payments**: Demo checkout flow without real payment processing

## 🏗️ Project Structure

```
twilio-owl-shop/
├── app/                          # Next.js App Router pages
│   ├── account/                  # User authentication & profile
│   ├── cart/                     # Shopping cart management
│   ├── checkout/                 # Multi-step checkout flow
│   │   └── success/              # Order confirmation
│   ├── orders/                   # Order tracking
│   │   └── [id]/                 # Individual order tracking
│   ├── products/                 # Product catalog
│   │   └── [id]/                 # Product detail pages
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with header/footer
│   └── page.tsx                  # Homepage
├── components/                   # Reusable UI components
│   ├── layout/                   # Header, Footer, Navigation
│   └── ui/                       # ProductCard, Filters, etc.
├── data/                         # Static data
│   └── products.ts               # Product catalog
├── lib/                          # Business logic
│   ├── cart.ts                   # Cart management utilities
│   └── twilio.ts                 # SMS notification functions
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Core application types
└── public/                       # Static assets
```

## 🛒 User Journey

### 1. **Browse Products** (`/`)

-   Hero section with featured categories
-   Featured product grid
-   Newsletter signup with SMS consent

### 2. **Product Discovery** (`/products`)

-   Complete product catalog
-   Advanced filtering and search
-   Sort by price, name, or newest

### 3. **Product Details** (`/products/[id]`)

-   High-quality product images
-   Size and color selection
-   Add to cart functionality
-   Product reviews and ratings

### 4. **Shopping Cart** (`/cart`)

-   Cart items with quantity controls
-   Promo code application
-   Order summary with tax and shipping
-   Proceed to checkout

### 5. **Authentication** (`/account`)

-   Login/Register forms
-   SMS marketing preferences
-   Profile management

### 6. **Checkout Process** (`/checkout`)

-   **Step 1**: Shipping information with SMS consent
-   **Step 2**: Payment details (demo mode)
-   **Step 3**: Order review and confirmation
-   Automatic SMS notifications upon completion

### 7. **Order Confirmation** (`/checkout/success`)

-   Order summary with tracking number
-   SMS confirmation sent automatically
-   Next steps guidance

### 8. **Order Tracking** (`/orders/[id]`)

-   Real-time tracking timeline
-   SMS notifications for shipping updates
-   Delivery status with location details

## 📱 SMS Notification Types

### Marketing & Engagement

-   Welcome messages for new users
-   Promotional campaigns and sales alerts
-   Newsletter content via SMS

### Transactional

-   Order confirmation with order details
-   Payment processing notifications
-   Shipping confirmations with tracking

### Customer Service

-   Cart abandonment reminders
-   Delivery notifications and updates
-   Post-purchase satisfaction surveys

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+ installed
-   Twilio account (for SMS functionality)

### Installation

1. **Clone the repository**

    ```bash
    cd /path/to/twilio-owl-shop
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
   Create a `.env.local` file:

    ```
    TWILIO_ACCOUNT_SID=your_account_sid_here
    TWILIO_AUTH_TOKEN=your_auth_token_here
    TWILIO_PHONE_NUMBER=your_twilio_phone_number
    ```

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

### 🎛️ Try the Dynamic SMS Demo

Visit `/dynamic-sms-demo` to explore the fully configurable SMS demo:
- **Live Demo**: `http://localhost:3000/dynamic-sms-demo`  
- **Customize**: Copy `config/sample-config.ts` to `config/my-demo.ts` and modify
- **Full Guide**: See `config/QUICK-START.md` for 5-minute setup

## 🌐 Production Deployment

### Deploy to Vercel (Recommended)

Vercel provides the best hosting experience for Next.js applications with proper CSS processing and serverless API support.

#### Quick Deploy

1. **Sign up at [vercel.com](https://vercel.com)** with your GitHub account
2. **Click "New Project"** and import your repository
3. **Use default settings** - Vercel auto-detects Next.js configuration
4. **Click "Deploy"** - your app will be live in minutes!

#### Configure Twilio SMS (Optional)

For SMS functionality to work in production:

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add these variables:**
   ```
   TWILIO_ACCOUNT_SID = your_account_sid_here
   TWILIO_AUTH_TOKEN = your_auth_token_here
   TWILIO_PHONE_NUMBER = your_twilio_phone_number
   ```
4. **Redeploy** your application

> **Note**: Without Twilio credentials, the app runs in demo mode (SMS messages are logged to console instead of being sent).

#### Get Your Twilio Credentials

1. **Sign up at [twilio.com](https://twilio.com)**
2. **Get a free phone number** from the Twilio Console
3. **Find your credentials** in Account → Keys & Credentials:
   - Account SID
   - Auth Token
   - Your Twilio phone number

### Alternative Deployment Options

#### GitHub Pages (Static Only)
*Note: SMS functionality won't work on GitHub Pages as it doesn't support serverless functions*

```bash
npm run build:static
# Files will be in 'out' directory for manual upload
```

#### Other Platforms
The app can be deployed to any platform supporting Next.js:
- **Netlify**: Use `npm run build`
- **Railway**: Auto-detects Next.js
- **Render**: Use `npm run build && npm start`

## 🧪 Demo Features

### Test Accounts

-   **Email**: demo@owlshop.com
-   **Password**: demo123

### Test Credit Cards (Demo Mode)

-   **Card Number**: 4242 4242 4242 4242
-   **Expiry**: Any future date
-   **CVC**: Any 3 digits

### Promo Codes

-   `WELCOME10`: 10% off first order
-   `SAVE20`: 20% off orders over $100
-   `FREESHIP`: Free shipping

## 🛠️ Technology Stack

-   **Frontend**: Next.js 15.5.2, React 19, TypeScript
-   **Styling**: Tailwind CSS 3.4.1
-   **Icons**: Heroicons
-   **SMS**: Twilio SDK
-   **State Management**: React hooks + localStorage
-   **Build Tool**: Turbopack (Next.js)
-   **Deployment**: Vercel (recommended), GitHub Pages (static), or any Next.js host

## 📋 Features Checklist

-   ✅ Professional, high-end design aesthetic
-   ✅ Complete product catalog with filtering
-   ✅ Shopping cart with persistence
-   ✅ Guest and authenticated checkout
-   ✅ Twilio SMS integration for all touchpoints
-   ✅ Order tracking with real-time updates
-   ✅ Responsive design for all devices
-   ✅ TypeScript for type safety
-   ✅ SEO-optimized structure
-   ✅ Demo authentication and payments

## 🔮 Future Enhancements

-   **Real Payment Integration**: Stripe or PayPal integration
-   **User Reviews**: Customer review and rating system
-   **Inventory Management**: Real-time stock tracking
-   **Wishlist Feature**: Save products for later
-   **Advanced Analytics**: Customer behavior tracking
-   **Multi-language Support**: Internationalization
-   **Email Integration**: Combined email + SMS notifications
-   **Admin Dashboard**: Order and inventory management

## 📞 SMS Compliance

This application includes TCPA-compliant SMS features:

-   Explicit opt-in consent collection
-   Clear opt-out instructions in every message
-   Frequency and charges disclosure
-   Easy unsubscribe mechanism

## 🎯 Business Impact

The Owl Shop platform demonstrates how modern e-commerce can leverage SMS marketing to:

-   Increase conversion rates through cart abandonment recovery
-   Enhance customer experience with real-time order updates
-   Build customer loyalty through personalized messaging
-   Reduce support inquiries with proactive notifications
-   Drive repeat purchases through targeted promotions

---

**Built with ❤️ using Next.js, Tailwind CSS, and Twilio**
