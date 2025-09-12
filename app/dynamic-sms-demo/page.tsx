"use client";

import { useState, useEffect } from "react";
import { defaultDemoConfig, DemoConfig, MessageTemplate, FeatureCard as FeatureCardType, processMessageTemplate } from "@/config/demo-config";
import VirtualPhone from "@/components/VirtualPhone";
import DynamicMessageCard from "@/components/DynamicMessageCard";
import FeatureCard from "@/components/FeatureCard";
import ConfigPanel from "@/components/ConfigPanel";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    virtualPhoneReceiveMessage?: (content: string, messageId?: string, channel?: 'sms' | 'rcs' | 'whatsapp' | 'voice', template?: MessageTemplate) => void;
    virtualPhoneSwitchApp?: (channel: 'sms' | 'rcs' | 'whatsapp' | 'voice') => void;
    virtualPhoneInitiateCall?: (number: string, name?: string) => void;
  }
}

interface TwilioStatus {
    configured: boolean;
    demo: boolean;
    accountSid?: string;
    phoneNumber?: string;
}

export default function DynamicSMSDemo() {
    const [config, setConfig] = useState<DemoConfig>(defaultDemoConfig);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [twilioStatus, setTwilioStatus] = useState<TwilioStatus>({
        configured: false,
        demo: true,
    });
    const [configPanelOpen, setConfigPanelOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [selectedChannel, setSelectedChannel] = useState<'sms' | 'rcs' | 'whatsapp' | 'voice'>(config.features.defaultChannel);
    const [selectedContentType, setSelectedContentType] = useState<'text' | 'media' | 'richCard' | 'carousel' | 'listMessage' | 'location' | 'catalog' | 'authentication'>('text');
    const [activeTab, setActiveTab] = useState<'use-cases' | 'features'>('use-cases');

    // Fetch Twilio status on component mount
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch("/api/sms");
                if (response.ok) {
                    const status = await response.json();
                    setTwilioStatus(status);
                }
            } catch (error) {
                console.error("Failed to fetch Twilio status:", error);
            }
        };

        fetchStatus();
    }, []);

    const addResult = (message: string) => {
        setResults((prev) => [
            ...prev,
            `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
    };

    const updateTemplate = (updatedTemplate: MessageTemplate) => {
        setConfig(prev => ({
            ...prev,
            messageTemplates: prev.messageTemplates.map(template => 
                template.id === updatedTemplate.id ? updatedTemplate : template
            )
        }));
        addResult(`📝 Updated template: ${updatedTemplate.title}`);
    };

    const updateFeature = (updatedFeature: FeatureCardType) => {
        setConfig(prev => ({
            ...prev,
            featureCards: prev.featureCards.map(feature => 
                feature.id === updatedFeature.id ? updatedFeature : feature
            )
        }));
        addResult(`⚙️ Updated feature: ${updatedFeature.title}`);
    };

    const clearResults = () => {
        setResults([]);
    };

    // Function to switch virtual phone app based on channel
    const switchVirtualPhoneApp = (channel: 'sms' | 'rcs' | 'whatsapp' | 'voice') => {
        if (window.virtualPhoneSwitchApp) {
            window.virtualPhoneSwitchApp(channel);
        }
    };

    // Handle channel selection with app switching
    const handleChannelChange = (channel: 'sms' | 'rcs' | 'whatsapp' | 'voice') => {
        setSelectedChannel(channel);
        
        // Reset content type to the first available option for this channel
        const availableTypes = Object.values(config.richMessageTypes).filter(type => 
            type.available.includes(channel)
        );
        if (availableTypes.length > 0) {
            setSelectedContentType(availableTypes[0].id as 'text' | 'media' | 'richCard' | 'carousel' | 'listMessage' | 'location' | 'catalog' | 'authentication');
        }
        
        switchVirtualPhoneApp(channel);
        addResult(`📱 Switched to ${channel.toUpperCase()} app`);
    };


    // Get available content types for the selected channel
    const getAvailableContentTypes = () => {
        if (!config.features.enableContentTypes) return [];
        
        // Use config-defined available content types, filtered by enabled templates and channel availability
        return config.features.availableContentTypes
            .filter(contentType => {
                const template = config.contentTypeTemplates[contentType];
                if (!template || !template.enabled) return false;
                
                const richType = config.richMessageTypes[contentType];
                return richType && richType.available.includes(selectedChannel);
            })
            .map(contentType => ({
                ...config.contentTypeTemplates[contentType],
                ...config.richMessageTypes[contentType]
            }));
    };

    // Helper function to call SMS API
    const callSMSAPI = async (
        action: string,
        params: Record<string, unknown> = {}
    ) => {
        try {
            const response = await fetch("/api/sms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    phoneNumber,
                    ...params,
                }),
            });

            return await response.json();
        } catch (error) {
            console.error("SMS API call failed:", error);
            return { success: false, error: "API call failed" };
        }
    };

    const callVoiceAPI = async (
        action: string,
        message: string,
        params: Record<string, unknown> = {}
    ) => {
        try {
            const response = await fetch("/api/voice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action,
                    phoneNumber,
                    message,
                    ...params,
                }),
            });

            return await response.json();
        } catch (error) {
            console.error("Voice API call failed:", error);
            return { success: false, error: "Voice API call failed" };
        }
    };

    const sendMessage = async (template: MessageTemplate) => {
        setIsRunning(true);
        addResult(`🚀 Sending ${template.title}...`);

        // Process the message template
        const processedMessage = processMessageTemplate(template, { 
            brandName: config.brandName,
            timestamp: Date.now()
        });

        // Handle different channels
        let result = { success: true, demo: true, sid: 'MOCK', error: undefined };
        if (selectedChannel === 'voice') {
            // Voice channel - make actual voice call and initiate virtual phone call
            result = await callVoiceAPI(template.apiAction, processedMessage, template.variables);
            addResult(
                result.success
                    ? `✅ ${template.title} - Voice call ${result.demo ? 'simulated' : 'initiated'}`
                    : `❌ Voice call failed: ${result.error || 'Unknown error'}`
            );
            
            // Also trigger virtual phone call for demo
            if (window.virtualPhoneInitiateCall) {
                window.virtualPhoneInitiateCall(phoneNumber || config.features.phoneSettings.defaultPhoneNumber, template.title);
            }
        } else if (selectedChannel === 'sms' && phoneNumber) {
            // Real SMS
            result = await callSMSAPI(template.apiAction, template.variables);
            addResult(
                result.success
                    ? `✅ ${template.title} sent successfully`
                    : `❌ Failed: ${result.error || 'Unknown error'}`
            );
        } else if (selectedChannel === 'sms' && !phoneNumber) {
            // SMS without phone number - show it's demo mode only
            addResult(`✅ ${template.title} sent successfully (SMS demo mode - no phone number)`);
        } else {
            addResult(`✅ ${template.title} sent successfully (${selectedChannel.toUpperCase()} mock)`);
        }

        // Send to virtual phone for non-voice channels
        if (selectedChannel !== 'voice' && window.virtualPhoneReceiveMessage) {
            setTimeout(() => {
                // Create template with selected content type for rich channels
                const enhancedTemplate = {
                    ...template,
                    selectedContentType,
                    richMessageConfig: config.richMessageTypes[selectedContentType]
                };
                window.virtualPhoneReceiveMessage!(processedMessage, template.id, selectedChannel, enhancedTemplate);
                addResult(`📱 Message delivered to virtual phone (${selectedChannel.toUpperCase()} - ${config.richMessageTypes[selectedContentType]?.name || 'Text'})`);
            }, 1000);
        }

        // Send to virtual phone for voice channels (to initiate call with IVR)
        if (selectedChannel === 'voice' && window.virtualPhoneReceiveMessage) {
            setTimeout(() => {
                window.virtualPhoneReceiveMessage!(processedMessage, template.id, selectedChannel, template);
                addResult(`📱 Voice call initiated on virtual phone`);
            }, 500);
        }

        // Log detailed response
        if (selectedChannel === 'voice') {
            addResult(`📋 Call Target: ${phoneNumber || config.features.phoneSettings.defaultPhoneNumber}`);
            addResult(`📋 Call Script: "${processedMessage}"`);
            if (phoneNumber && config.features.phoneSettings.enableRealCalls && !result.demo) {
                addResult(`📋 Call SID: ${result.sid || "N/A"}`);
                addResult(`📋 Status: ${result.status || "Unknown"}`);
                addResult(`📋 Real Call: Yes`);
            } else {
                const reason = !phoneNumber ? '(No phone number provided)' : 
                              !config.features.phoneSettings.enableRealCalls ? '(Real calls disabled in config)' : 
                              '(Twilio not configured)';
                addResult(`📋 Demo Mode: Yes ${reason}`);
            }
        } else {
            addResult(`📋 Message Content: "${processedMessage}"`);
            if (selectedChannel === 'sms') {
                if (phoneNumber) {
                    addResult(`📋 SID: ${result.sid || "N/A"}`);
                    addResult(`📋 Demo Mode: ${result.demo ? "Yes" : "No"}`);
                } else {
                    addResult(`📋 Demo Mode: Yes (No phone number provided)`);
                }
            } else {
                addResult(`📋 Channel: ${selectedChannel.toUpperCase()}`);
                addResult(`📋 Mock Mode: Yes`);
            }
        }

        setIsRunning(false);
    };

    const sendFeatureDemo = async (feature: FeatureCardType) => {
        setIsRunning(true);
        addResult(`🚀 Starting ${feature.title} demo...`);

        // Process the feature message template
        const processedMessage = processMessageTemplate(feature, { 
            brandName: config.brandName,
            timestamp: Date.now()
        });

        // Handle different channels for feature demos
        let result = { success: true, demo: true, sid: 'FEATURE_DEMO', error: undefined };
        
        if (feature.channel === 'voice') {
            // Voice feature demo
            result = await callVoiceAPI(feature.apiAction, processedMessage, feature.variables);
            addResult(
                result.success
                    ? `✅ ${feature.title} - Voice feature ${result.demo ? 'simulated' : 'demonstrated'}`
                    : `❌ Voice feature demo failed: ${result.error || 'Unknown error'}`
            );
            
            // Trigger virtual phone call for voice features
            if (window.virtualPhoneInitiateCall) {
                window.virtualPhoneInitiateCall(phoneNumber || config.features.phoneSettings.defaultPhoneNumber, feature.title);
            }
        } else if (feature.channel === 'sms' && phoneNumber) {
            // Real SMS feature demo
            result = await callSMSAPI(feature.apiAction, feature.variables);
            addResult(
                result.success
                    ? `✅ ${feature.title} feature demonstrated successfully`
                    : `❌ Failed: ${result.error || 'Unknown error'}`
            );
        } else if (feature.channel === 'sms' && !phoneNumber) {
            // SMS feature demo without phone number
            addResult(`✅ ${feature.title} feature demonstrated (SMS demo mode - no phone number)`);
        } else {
            addResult(`✅ ${feature.title} feature demonstrated (${feature.channel.toUpperCase()} mock)`);
        }

        // Send to virtual phone for non-voice channels with feature effects
        if (feature.channel !== 'voice' && window.virtualPhoneReceiveMessage) {
            // Special handling for specific features
            if (feature.id === 'sms-media-messages') {
                // Send actual MMS sample message to virtual phone
                setTimeout(() => {
                    const sampleMmsMessage = "📷 Check out our latest product! Special discount available now.";
                    const mediaUrl = feature.demoConfig.apiResponse?.mediaUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400";
                    
                    // Create a proper media message template for SMS MMS
                    const mediaTemplate = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'transactional' as const,
                        messageContent: sampleMmsMessage,
                        variables: {},
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText,
                        selectedContentType: 'media' as const,
                        contentTypeConfig: {
                            mediaUrl: mediaUrl,
                            mediaType: 'image' as const,
                            caption: sampleMmsMessage
                        }
                    };
                    
                    window.virtualPhoneReceiveMessage!(sampleMmsMessage, feature.id, feature.channel, mediaTemplate);
                    addResult(`📱 Sample MMS sent to virtual phone with image attachment`);
                    addResult(`📋 MMS Content: "${sampleMmsMessage}"`);
                    addResult(`📋 Media URL: ${mediaUrl}`);
                }, 1000);
            } else if (feature.id === 'sms-delivery-tracking') {
                // Delivery tracking with progressive status updates
                addResult(`📊 Message Status: Queued → Preparing for delivery...`);
                
                setTimeout(() => {
                    addResult(`📊 Message Status: Sent → Message transmitted to carrier network`);
                }, 2000);
                
                setTimeout(() => {
                    addResult(`📊 Message Status: Delivered → Message successfully delivered!`);
                    // Send the actual message to virtual phone after "delivery"
                    window.virtualPhoneReceiveMessage!(processedMessage, feature.id, feature.channel);
                    addResult(`📱 Message now appears on virtual phone (delivery confirmed)`);
                }, 4000);
            } else if (feature.id === 'rcs-rich-carousel') {
                // RCS Rich Carousel - show interactive carousel
                setTimeout(() => {
                    const carouselMessage = "🎠 Check out our featured products! Swipe through our collection:";
                    const carouselTemplate = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'marketing' as const,
                        messageContent: carouselMessage,
                        variables: {},
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText,
                        selectedContentType: 'carousel' as const,
                        contentTypeConfig: {
                            carouselBody: "Browse our premium product collection",
                            carouselItems: [
                                {
                                    id: '1',
                                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
                                    title: 'Owl Hoodie Premium',
                                    subtitle: '$79.99 - Premium comfort',
                                    buttons: [
                                        { title: 'Buy Now', type: 'url', url: 'https://owlshop.com/hoodie' },
                                        { title: 'Add to Cart', type: 'reply', payload: 'add_hoodie' }
                                    ]
                                },
                                {
                                    id: '2',
                                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
                                    title: 'Developer T-Shirt',
                                    subtitle: '$29.99 - Perfect for coding',
                                    buttons: [
                                        { title: 'Buy Now', type: 'url', url: 'https://owlshop.com/tshirt' },
                                        { title: 'Add to Cart', type: 'reply', payload: 'add_tshirt' }
                                    ]
                                },
                                {
                                    id: '3',
                                    image: 'https://images.unsplash.com/photo-1572313856066-c6c1f6b5d50e?w=200',
                                    title: 'Code & Coffee Mug',
                                    subtitle: '$19.99 - Fuel your coding',
                                    buttons: [
                                        { title: 'Buy Now', type: 'url', url: 'https://owlshop.com/mug' },
                                        { title: 'Add to Cart', type: 'reply', payload: 'add_mug' }
                                    ]
                                }
                            ]
                        }
                    };
                    
                    window.virtualPhoneReceiveMessage!(carouselMessage, feature.id, feature.channel, carouselTemplate);
                    addResult(`📱 Interactive carousel sent to virtual phone with ${carouselTemplate.contentTypeConfig.carouselItems.length} products`);
                    addResult(`📋 Carousel Content: "${carouselMessage}"`);
                    addResult(`🎯 RCS Rich Carousel - Users can swipe through products and tap buttons`);
                }, 1000);
            } else if (feature.id === 'rcs-suggested-actions') {
                // RCS Suggested Actions - show quick reply buttons
                setTimeout(() => {
                    const actionsMessage = "💬 Thanks for your interest in Owl Shop! How can we help you today?";
                    const actionsTemplate = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'marketing' as const,
                        messageContent: actionsMessage,
                        variables: {},
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText,
                        selectedContentType: 'richCard' as const,
                        contentTypeConfig: {
                            cardTitle: "Customer Support",
                            cardSubtitle: "We're here to help!",
                            cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                            cardBody: "Choose from the quick options below or type your question.",
                            interactiveType: "quickReplies",
                            quickReplies: [
                                { title: "🛍️ Browse Products", payload: "browse_products" },
                                { title: "📞 Call Sales", payload: "call_sales" },
                                { title: "❓ Get Support", payload: "get_support" },
                                { title: "📋 Track Order", payload: "track_order" }
                            ]
                        }
                    };
                    
                    window.virtualPhoneReceiveMessage!(actionsMessage, feature.id, feature.channel, actionsTemplate);
                    addResult(`📱 Interactive suggested actions sent to virtual phone`);
                    addResult(`📋 Actions Message: "${actionsMessage}"`);
                    addResult(`🎯 RCS Suggested Actions - ${actionsTemplate.contentTypeConfig.quickReplies.length} quick reply options available`);
                }, 1000);
            } else if (feature.id === 'rcs-read-receipts') {
                // RCS Read Receipts - show status progression with visual updates
                addResult(`📊 Message Status: Queued → Preparing to send...`);
                
                setTimeout(() => {
                    addResult(`📊 Message Status: Sent → Message transmitted successfully`);
                }, 1500);
                
                setTimeout(() => {
                    addResult(`📊 Message Status: Delivered → Message received by device`);
                    // Send the actual message to virtual phone
                    const readReceiptMessage = "✅ This message demonstrates RCS read receipts. You'll see the status change when 'read'.";
                    window.virtualPhoneReceiveMessage!(readReceiptMessage, feature.id, feature.channel);
                    addResult(`📱 Message now appears on virtual phone`);
                    
                    // Update delivery status in virtual phone
                    if (window.virtualPhoneUpdateMessageStatus) {
                        window.virtualPhoneUpdateMessageStatus(feature.id, { delivered: true, read: false });
                    }
                    addResult(`📱 Message status: Delivered (✓) - waiting for read receipt...`);
                }, 3000);
                
                setTimeout(() => {
                    addResult(`📊 Message Status: Read → Customer opened and read the message! 🎉`);
                    addResult(`📋 Read Receipt: ${new Date().toLocaleTimeString()} - Message confirmed as read`);
                    
                    // Update the message status in the virtual phone to show as "read"
                    if (window.virtualPhoneUpdateMessageStatus) {
                        window.virtualPhoneUpdateMessageStatus(feature.id, { delivered: true, read: true });
                    }
                    addResult(`📱 Message status updated in virtual phone (✓✓ read receipt)`);
                    addResult(`🎯 RCS Read Receipts - Complete delivery and read confirmation workflow demonstrated`);
                }, 6000);
            } else if (feature.id === 'rcs-branded-sender') {
                // RCS Branded Profiles - show branded contact profile instead of sending message
                addResult(`🏢 Activating branded business profile...`);
                addResult(`📋 Business Name: ${feature.demoConfig.apiResponse?.brandedSender?.businessName || 'Owl Shop'}`);
                addResult(`✅ Verification Status: ${feature.demoConfig.apiResponse?.brandedSender?.verified ? 'Verified Business' : 'Unverified'}`);
                
                setTimeout(() => {
                    // Switch to contact profile view with branded information
                    if (window.virtualPhoneSwitchApp) {
                        window.virtualPhoneSwitchApp('messages');
                    }
                    
                    // Show branded contact profile
                    if (window.virtualPhoneShowBrandedProfile) {
                        window.virtualPhoneShowBrandedProfile({
                            businessName: feature.demoConfig.apiResponse?.brandedSender?.businessName || 'Owl Shop',
                            logo: feature.demoConfig.apiResponse?.brandedSender?.logo || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100',
                            verified: feature.demoConfig.apiResponse?.brandedSender?.verified || true,
                            description: 'Premium clothing and accessories for the modern professional.',
                            website: 'https://owlshop.com',
                            phoneNumber: '+1 (833) 365-9260'
                        });
                    }
                    
                    addResult(`📱 Branded business profile displayed in virtual phone`);
                    addResult(`🎯 RCS Branded Profiles - Verified business identity with logo and trust indicators`);
                }, 1000);
            } else if (feature.id === 'whatsapp-message-templates') {
                // WhatsApp Message Templates - show template with variable placeholders
                setTimeout(() => {
                    const templateMessage = "✅ Your order #{{order_number}} has been confirmed! Expected delivery: {{delivery_date}}. Track your package: {{tracking_url}}";
                    const templateDemo = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'transactional' as const,
                        messageContent: templateMessage,
                        variables: {},
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText,
                        selectedContentType: 'text' as const
                    };
                    
                    window.virtualPhoneReceiveMessage!(templateMessage, feature.id, feature.channel, templateDemo);
                    addResult(`📱 WhatsApp message template sent with variable placeholders`);
                    addResult(`📋 Template Structure: Order confirmation with dynamic variables`);
                    addResult(`🎯 WhatsApp Templates - Pre-approved business message format with compliance`);
                }, 1000);
            } else if (feature.id === 'whatsapp-interactive-buttons') {
                // WhatsApp Interactive Buttons - show buttons with actions
                setTimeout(() => {
                    const buttonMessage = "💡 How can we help you today? Choose from the options below:";
                    const buttonTemplate = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'marketing' as const,
                        messageContent: buttonMessage,
                        variables: {},
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText,
                        selectedContentType: 'richCard' as const,
                        contentTypeConfig: {
                            cardTitle: "Customer Support",
                            cardSubtitle: "Choose an option to get started",
                            cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                            cardBody: "Our support team is ready to assist you with any questions.",
                            interactiveType: "buttons",
                            buttons: [
                                { title: "📞 Call Support", type: "phone", payload: "+1-833-365-9260" },
                                { title: "💬 Live Chat", type: "reply", payload: "start_chat" },
                                { title: "🌐 Visit Website", type: "url", url: "https://owlshop.com/support" }
                            ]
                        }
                    };
                    
                    window.virtualPhoneReceiveMessage!(buttonMessage, feature.id, feature.channel, buttonTemplate);
                    addResult(`📱 WhatsApp interactive buttons displayed with 3 action options`);
                    addResult(`📋 Button Types: Phone call, quick reply, and website URL`);
                    addResult(`🎯 WhatsApp Interactive Buttons - Seamless user interaction with instant actions`);
                }, 1000);
            } else if (feature.id === 'whatsapp-list-messages') {
                // WhatsApp List Messages - show expandable selection menu
                setTimeout(() => {
                    const listMessage = "🛍️ Browse our product categories to find what you're looking for:";
                    const listTemplate = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'marketing' as const,
                        messageContent: listMessage,
                        variables: {},
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText,
                        selectedContentType: 'listMessage' as const,
                        contentTypeConfig: {
                            listHeader: "Product Categories",
                            listFooter: "Select a category to browse products",
                            buttonText: "Browse Categories",
                            listSections: [
                                {
                                    title: "Clothing",
                                    rows: [
                                        { id: "hoodies", title: "Hoodies & Sweatshirts", description: "Comfortable and stylish hoodies" },
                                        { id: "tshirts", title: "T-Shirts", description: "Perfect for everyday wear" },
                                        { id: "jackets", title: "Jackets", description: "Lightweight and weather-resistant" }
                                    ]
                                },
                                {
                                    title: "Accessories",
                                    rows: [
                                        { id: "mugs", title: "Coffee Mugs", description: "Developer-themed drinkware" },
                                        { id: "stickers", title: "Laptop Stickers", description: "Tech stickers and decals" },
                                        { id: "bags", title: "Bags", description: "Backpacks and messenger bags" }
                                    ]
                                }
                            ]
                        }
                    };
                    
                    window.virtualPhoneReceiveMessage!(listMessage, feature.id, feature.channel, listTemplate);
                    addResult(`📱 WhatsApp list message displayed with expandable menu`);
                    addResult(`📋 List Structure: 2 categories with 6 total product options`);
                    addResult(`🎯 WhatsApp List Messages - Organized selection menus for complex choices`);
                }, 1000);
            } else if (feature.id === 'whatsapp-media-sharing') {
                // WhatsApp Media Sharing - show rich media with preview
                setTimeout(() => {
                    const mediaMessage = "📸 Check out our new Developer Collection! Perfect for the modern programmer.";
                    const mediaTemplate = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'marketing' as const,
                        messageContent: mediaMessage,
                        variables: {},
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText,
                        selectedContentType: 'media' as const,
                        contentTypeConfig: {
                            mediaUrl: feature.demoConfig.apiResponse?.mediaUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
                            mediaType: 'image' as const,
                            caption: mediaMessage
                        }
                    };
                    
                    window.virtualPhoneReceiveMessage!(mediaMessage, feature.id, feature.channel, mediaTemplate);
                    addResult(`📱 WhatsApp media message sent with high-quality image preview`);
                    addResult(`📋 Media Details: ${feature.demoConfig.apiResponse?.mediaSize || "1.2MB"} image with caption`);
                    addResult(`🎯 WhatsApp Media Sharing - Rich media support with native preview and download`);
                }, 1000);
            } else if (feature.id === 'voice-text-to-speech') {
                // Voice Text-to-Speech - enhanced visual demo with clear TTS indicators
                addResult(`🎙️ Initiating Text-to-Speech call with voice synthesis...`);
                addResult(`📋 TTS Voice: ${feature.demoConfig.apiResponse?.voice || 'Alice'} (${feature.demoConfig.apiResponse?.language || 'en-US'})`);
                addResult(`📋 TTS Message: "${feature.demoConfig.apiResponse?.message || processedMessage}"`);
                
                setTimeout(() => {
                    // Create enhanced TTS template with special indicators
                    const ttsTemplate = {
                        id: feature.id,
                        title: feature.title,
                        description: feature.description,
                        emoji: feature.emoji,
                        category: 'transactional' as const,
                        messageContent: `🎙️ TTS CALL: "${feature.demoConfig.apiResponse?.message || processedMessage}"`,
                        variables: {
                            voice: feature.demoConfig.apiResponse?.voice || 'Alice',
                            language: feature.demoConfig.apiResponse?.language || 'en-US',
                            ttsActive: true
                        },
                        apiAction: feature.apiAction,
                        buttonText: feature.buttonText
                    };
                    
                    // Initiate TTS call with special visual indicators
                    if (window.virtualPhoneStartTTSCall) {
                        const ttsMessage = feature.demoConfig.apiResponse?.message || "Hello from Owl Shop! Your order has been processed successfully.";
                        const ttsVoice = feature.demoConfig.apiResponse?.voice || "Alice";
                        window.virtualPhoneStartTTSCall(phoneNumber || config.features.phoneSettings.defaultPhoneNumber, ttsMessage, ttsVoice);
                    }
                    
                    addResult(`📞 TTS call initiated - Voice synthesis active`);
                    addResult(`🎯 Virtual Phone: Call screen showing TTS playback with voice indicators`);
                    
                    // Show TTS progress stages
                    setTimeout(() => {
                        addResult(`🔊 TTS Stage 1: Converting text to speech using ${feature.demoConfig.apiResponse?.voice || 'Alice'} voice`);
                    }, 2000);
                    
                    setTimeout(() => {
                        addResult(`🎵 TTS Stage 2: Playing synthesized audio - "${feature.demoConfig.apiResponse?.message || processedMessage}"`);
                    }, 4000);
                    
                    setTimeout(() => {
                        addResult(`✅ TTS Stage 3: Speech playback completed successfully`);
                        addResult(`🎯 Voice TTS - Natural speech synthesis with multiple voice options and languages`);
                    }, 7000);
                }, 1000);
            } else {
                // Default feature behavior
                setTimeout(() => {
                    window.virtualPhoneReceiveMessage!(processedMessage, feature.id, feature.channel);
                    addResult(`📱 Feature effect: ${feature.demoConfig.virtualPhoneEffect}`);
                    
                    // Apply additional feature-specific effects
                    if (feature.demoConfig.timeDelay && feature.demoConfig.persistEffect) {
                        setTimeout(() => {
                            addResult(`🎯 ${feature.technicalDetails.twilioFeature} - ${feature.demoConfig.mockBehavior}`);
                        }, feature.demoConfig.timeDelay);
                    }
                }, 1000);
            }
        }

        // Send to virtual phone for voice features (to initiate call with IVR)
        if (feature.channel === 'voice' && window.virtualPhoneReceiveMessage) {
            setTimeout(() => {
                window.virtualPhoneReceiveMessage!(processedMessage, feature.id, feature.channel, feature);
                addResult(`📱 Voice feature demonstrated on virtual phone`);
            }, 500);
        }

        // Log feature demo details
        addResult(`📋 Feature: ${feature.technicalDetails.twilioFeature}`);
        addResult(`📋 Message Content: "${processedMessage}"`);
        addResult(`📋 Channel: ${feature.channel.toUpperCase()}`);
        addResult(`📋 Demo Behavior: ${feature.demoConfig.mockBehavior}`);
        if (feature.technicalDetails.documentation) {
            addResult(`📋 Documentation: ${feature.technicalDetails.documentation}`);
        }

        setIsRunning(false);
    };

    const sendSequence = async (templates: MessageTemplate[], delay: number = 3000) => {
        setIsRunning(true);
        addResult(`🎭 Starting message sequence (${templates.length} messages)...`);

        for (let i = 0; i < templates.length; i++) {
            const template = templates[i];
            await sendMessage(template);
            
            if (i < templates.length - 1) {
                addResult(`⏳ Waiting ${delay/1000}s before next message...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        addResult(`✅ Sequence completed!`);
        setIsRunning(false);
    };

    const sendJourneyFlow = async () => {
        const allTemplates = config.journeySteps.flatMap(step => 
            step.messageIds.map(id => config.messageTemplates.find(t => t.id === id)).filter(Boolean)
        ) as MessageTemplate[];
        
        await sendSequence(allTemplates, 2000);
    };

    const getFilteredTemplates = () => {
        let templates = config.messageTemplates;
        
        // Filter by channel - show only voice templates for voice channel
        if (selectedChannel === 'voice') {
            // Use configurable voice template IDs
            templates = templates.filter(template => config.features.voiceTemplateIds.includes(template.id));
        } else {
            // For other channels, exclude voice-specific templates
            templates = templates.filter(template => !config.features.voiceTemplateIds.includes(template.id));
        }
        
        // Then filter by category
        if (activeCategory === 'all') {
            return templates;
        }
        return templates.filter(template => template.category === activeCategory);
    };

    // Get categories based on active tab
    const getCategories = () => {
        if (activeTab === 'use-cases') {
            return ['all', ...Array.from(new Set(config.messageTemplates.map(t => t.category)))];
        } else {
            return ['all', ...Array.from(new Set(config.featureCards.map(f => f.category)))];
        }
    };

    const categories = getCategories();

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'marketing': return config.brandColors.primary;
            case 'transactional': return config.brandColors.accent;
            case 'notification': return '#00C758';
            case 'authentication': return '#DC2626';
            case 'sms-features': return '#007AFF';
            case 'rcs-features': return '#FF6B00';
            case 'whatsapp-features': return '#25D366';
            case 'voice-features': return '#DC2626';
            case 'all': return config.brandColors.primary;
            default: return config.brandColors.primary;
        }
    };

    // Get filtered items based on active tab and category
    const getFilteredItems = () => {
        if (activeTab === 'use-cases') {
            let templates = config.messageTemplates;
            
            // Filter by channel - show appropriate templates for each channel
            if (selectedChannel === 'voice') {
                // Show only voice-specific templates
                templates = templates.filter(template => config.features.voiceTemplateIds.includes(template.id));
            } else {
                // For SMS, RCS, WhatsApp - exclude voice-specific templates
                templates = templates.filter(template => !config.features.voiceTemplateIds.includes(template.id));
            }
            
            if (activeCategory !== 'all') {
                templates = templates.filter(t => t.category === activeCategory);
            }
            return templates.map(t => ({ type: 'template' as const, item: t }));
        } else {
            let features = config.featureCards.filter(f => f.enabled);
            
            // Filter features by selected channel only - no category filtering for features
            features = features.filter(f => f.channel === selectedChannel);
            
            return features.map(f => ({ type: 'feature' as const, item: f }));
        }
    };

    return (
        <div className="min-h-screen py-12" style={{ backgroundColor: config.brandColors.background }}>
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 
                        className="buffalo-title text-4xl mb-4"
                        style={{ color: config.brandColors.secondary }}
                    >
                        {config.title}
                    </h1>
                    <p 
                        className="twilio-text text-lg"
                        style={{ color: config.brandColors.text }}
                    >
                        {config.subtitle}
                    </p>
                </div>

                {/* Twilio Status */}
                <div
                    className={`rounded-lg p-4 mb-8 ${
                        twilioStatus.configured
                            ? "bg-green-50 border border-green-200"
                            : "bg-yellow-50 border border-yellow-200"
                    }`}
                >
                    <h3 className="buffalo-title text-lg mb-2" style={{ color: config.brandColors.secondary }}>
                        {config.uiText.twilioStatus.title}
                    </h3>
                    <div className="twilio-mono text-sm space-y-1">
                        <p>
                            {config.uiText.twilioStatus.mode}{" "}
                            {twilioStatus.demo
                                ? config.uiText.twilioStatus.demoMode
                                : config.uiText.twilioStatus.liveMode}
                        </p>
                        <p>
                            {config.uiText.twilioStatus.accountSid}{" "}
                            {twilioStatus.accountSid || "Not configured"}
                        </p>
                        <p>
                            {config.uiText.twilioStatus.phoneNumber}{" "}
                            {twilioStatus.phoneNumber || "Not configured"}
                        </p>
                    </div>
                    {twilioStatus.demo && (
                        <p className="twilio-text text-sm mt-2" style={{ color: config.brandColors.text }}>
                            {config.uiText.twilioStatus.demoModeDescription}
                        </p>
                    )}
                </div>

                {/* Journey Steps Overview */}
                {config.features.enableJourneyFlow && (
                    <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="buffalo-title text-xl mb-4" style={{ color: config.brandColors.secondary }}>
                            {config.uiText.sections.customerJourney}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {config.journeySteps.map((step) => (
                                <div key={step.id} className="text-center">
                                    <div 
                                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                                        style={{ backgroundColor: config.brandColors.primary, color: 'white' }}
                                    >
                                        <span className="text-xl">{step.icon}</span>
                                    </div>
                                    <h4 className="twilio-text font-semibold text-sm" style={{ color: config.brandColors.secondary }}>
                                        {step.title}
                                    </h4>
                                    <p className="twilio-text text-xs" style={{ color: config.brandColors.text }}>
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Left Column - Controls */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl mb-4" style={{ color: config.brandColors.secondary }}>
                                {config.uiText.sections.phoneNumber}
                            </h2>
                            <input
                                type="password"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder={config.uiText.forms.phoneNumberPlaceholder}
                                className="twilio-text w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                                style={{ 
                                    borderColor: config.brandColors.text + '50',
                                    '--tw-ring-color': config.brandColors.primary
                                } as React.CSSProperties}
                            />
                            <p className="twilio-text text-xs mt-2" style={{ color: config.brandColors.text }}>
                                {selectedChannel === 'sms' 
                                    ? '📱 Optional for SMS (required for real Twilio messages, demo works without)'
                                    : selectedChannel === 'voice'
                                    ? '📞 Required for real Voice calls (will make actual phone calls with your Twilio credentials)'
                                    : '📱 Optional for RCS/WhatsApp (mock messages only)'
                                }
                            </p>
                        </div>

                        {config.features.enableChannelSelection && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="buffalo-title text-xl mb-4" style={{ color: config.brandColors.secondary }}>
                                    MESSAGING CHANNEL
                                </h2>
                                <div className="space-y-3">
                                    {config.features.availableChannels.map((channel) => (
                                        <button
                                            key={channel}
                                            onClick={() => handleChannelChange(channel)}
                                            className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
                                                selectedChannel === channel
                                                    ? 'text-white'
                                                    : 'hover:border-opacity-60'
                                            }`}
                                            style={{
                                                backgroundColor: selectedChannel === channel ? config.brandColors.primary : 'transparent',
                                                borderColor: config.brandColors.primary,
                                                color: selectedChannel === channel ? 'white' : config.brandColors.primary
                                            }}
                                        >
                                            {channel === 'sms' && '📱 SMS'}
                                            {channel === 'rcs' && '💬 RCS'}
                                            {channel === 'whatsapp' && '🟢 WhatsApp'}
                                            {channel === 'voice' && '📞 Voice'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content Type Selector - Only show for RCS/WhatsApp */}
                        {(selectedChannel === 'rcs' || selectedChannel === 'whatsapp') && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="buffalo-title text-xl mb-4" style={{ color: config.brandColors.secondary }}>
                                    MESSAGE CONTENT TYPE
                                </h2>
                                <div className="space-y-2">
                                    {getAvailableContentTypes().map((contentType) => (
                                        <button
                                            key={contentType.id}
                                            onClick={() => setSelectedContentType(contentType.id as 'text' | 'media' | 'richCard' | 'carousel' | 'listMessage' | 'location' | 'catalog' | 'authentication')}
                                            className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 border text-left ${
                                                selectedContentType === contentType.id
                                                    ? 'text-white border-transparent'
                                                    : 'hover:border-opacity-60'
                                            }`}
                                            style={{
                                                backgroundColor: selectedContentType === contentType.id ? config.brandColors.accent : 'transparent',
                                                borderColor: selectedContentType === contentType.id ? 'transparent' : config.brandColors.accent + '40',
                                                color: selectedContentType === contentType.id ? 'white' : config.brandColors.accent
                                            }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl">{contentType.icon}</span>
                                                <div>
                                                    <div className="font-semibold">{contentType.name}</div>
                                                    <div className="text-sm opacity-75">{contentType.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl mb-4" style={{ color: config.brandColors.secondary }}>
                                {config.uiText.sections.demoActions}
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={sendJourneyFlow}
                                    disabled={isRunning}
                                    className="w-full py-3 rounded-lg font-semibold disabled:opacity-50 text-white transition-all duration-200"
                                    style={{ backgroundColor: config.brandColors.primary }}
                                >
                                    {config.uiText.buttons.completeJourney}
                                </button>
                                <button
                                    onClick={clearResults}
                                    className="w-full py-2 rounded-lg font-medium transition-all duration-200 border"
                                    style={{ 
                                        borderColor: config.brandColors.text + '30',
                                        color: config.brandColors.text 
                                    }}
                                >
                                    {config.uiText.buttons.clearResults}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Message Templates & Features */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Tab Switcher */}
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => {
                                        setActiveTab('use-cases');
                                        setActiveCategory('all');
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                                        activeTab === 'use-cases'
                                            ? 'text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                    style={{
                                        backgroundColor: activeTab === 'use-cases' ? config.brandColors.primary : 'transparent'
                                    }}
                                >
                                    📋 Use Cases
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('features');
                                        setActiveCategory('all');
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                                        activeTab === 'features'
                                            ? 'text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                    }`}
                                    style={{
                                        backgroundColor: activeTab === 'features' ? config.brandColors.accent : 'transparent'
                                    }}
                                >
                                    ⚡ Features
                                </button>
                            </div>
                            <div className="mt-3 text-sm text-gray-600">
                                {activeTab === 'use-cases' 
                                    ? 'Business use cases and customer journey templates'
                                    : 'Technical Twilio features and capabilities demos'
                                }
                            </div>
                        </div>

                        {/* Category Filter - Only show for Use Cases tab */}
                        {config.layout.showCategoryFilter && activeTab === 'use-cases' && (
                            <div className="bg-white rounded-lg shadow-lg p-4">
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => {
                                        const categoryColor = getCategoryColor(category);
                                        return (
                                            <button
                                                key={category}
                                                onClick={() => setActiveCategory(category)}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                                                    activeCategory === category
                                                        ? 'text-white'
                                                        : 'hover:text-gray-800'
                                                }`}
                                                style={{
                                                    backgroundColor: activeCategory === category 
                                                        ? categoryColor 
                                                        : 'transparent',
                                                    border: `1px solid ${categoryColor}`,
                                                    color: activeCategory === category ? 'white' : categoryColor
                                                }}
                                            >
                                                {category.replace('-', ' ')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Templates & Features Grid */}
                        <div className={`grid grid-cols-1 ${config.layout.gridColumns === 1 ? '' : 'md:grid-cols-' + config.layout.gridColumns} gap-4 auto-rows-fr`}>
                            {getFilteredItems().map((item) => (
                                <div key={item.type === 'template' ? item.item.id : item.item.id}>
                                    {item.type === 'template' ? (
                                        <DynamicMessageCard
                                            template={item.item}
                                            onSend={sendMessage}
                                            onUpdate={updateTemplate}
                                            isLoading={isRunning}
                                            disabled={false}
                                            brandColors={config.brandColors}
                                            cardLayout={config.cardLayouts.default}
                                            selectedChannel={selectedChannel}
                                            selectedContentType={selectedContentType}
                                            uiText={{
                                                buttons: config.uiText.buttons,
                                                forms: config.uiText.forms
                                            }}
                                        />
                                    ) : (
                                        <FeatureCard
                                            feature={item.item}
                                            onDemo={sendFeatureDemo}
                                            onUpdate={updateFeature}
                                            isLoading={isRunning}
                                            brandColors={config.brandColors}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Virtual Phone & Results */}
                    <div className="space-y-6">
                        {/* Virtual Phone */}
                        {config.features.enableVirtualPhone && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="buffalo-title text-xl mb-4 text-center" style={{ color: config.brandColors.secondary }}>
                                    {config.uiText.sections.virtualPhone}
                                </h2>
                                <div className="flex justify-center">
                                    <VirtualPhone 
                                        config={config}
                                        selectedChannel={selectedChannel}
                                        onMessageReceived={(message) => {
                                            addResult(`📱 Virtual phone received: "${message.content}"`);
                                        }}
                                        onLogMessage={(message) => {
                                            addResult(message);
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Results Log */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="buffalo-title text-xl" style={{ color: config.brandColors.secondary }}>
                                    {config.uiText.sections.resultsLog}
                                </h2>
                                <button
                                    onClick={clearResults}
                                    className="text-sm hover:underline"
                                    style={{ color: config.brandColors.primary }}
                                >
                                    {config.uiText.buttons.clearLog}
                                </button>
                            </div>
                            <div 
                                className="rounded-lg p-4 h-64 overflow-y-auto"
                                style={{ backgroundColor: config.brandColors.secondary }}
                            >
                                <div className="space-y-2">
                                    {results.length === 0 ? (
                                        <p 
                                            className="twilio-mono text-sm"
                                            style={{ color: config.brandColors.background }}
                                        >
                                            No messages sent yet. Configure and test SMS functionality.
                                        </p>
                                    ) : (
                                        results.map((result, index) => (
                                            <div
                                                key={index}
                                                className="twilio-mono text-sm"
                                                style={{ color: config.brandColors.background }}
                                            >
                                                {result}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Panel */}
            {config.features.enableConfigPanel && (
                <ConfigPanel
                    config={config}
                    onConfigChange={setConfig}
                    isOpen={configPanelOpen}
                    onToggle={() => setConfigPanelOpen(!configPanelOpen)}
                />
            )}
        </div>
    );
}