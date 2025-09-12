"use client";

import { useState, useEffect, useCallback } from "react";
import { DemoConfig, getMessageTheme, MessageTemplate } from "@/config/demo-config";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    virtualPhoneReceiveMessage?: (content: string, messageId?: string, channel?: 'sms' | 'rcs' | 'whatsapp' | 'voice', template?: MessageTemplate) => void;
    virtualPhoneSwitchApp?: (channel: 'sms' | 'rcs' | 'whatsapp' | 'voice') => void;
    virtualPhoneInitiateCall?: (number: string, name?: string) => void;
    virtualPhoneStartTTSCall?: (number: string, message: string, voice?: string) => void;
    virtualPhoneUpdateMessageStatus?: (messageId: string, status: { delivered?: boolean; read?: boolean }) => void;
    virtualPhoneShowBrandedProfile?: (brandInfo: {
      businessName: string;
      logo: string;
      verified: boolean;
      description: string;
      website: string;
      phoneNumber: string;
    }) => void;
  }
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'contact';
  delivered: boolean;
  read: boolean;
  channel?: 'sms' | 'rcs' | 'whatsapp';
  type?: 'text' | 'quick_replies' | 'carousel' | 'card' | 'media' | 'listMessage' | 'location' | 'catalog' | 'authentication';
  template?: MessageTemplate;
  quickReplies?: Array<{ id: string; title: string }>;
  carousel?: Array<{ id: string; image: string; title: string; subtitle: string; buttons: Array<{ title: string; type: string }> }>;
  card?: { image: string; title: string; subtitle: string; body?: string; buttons?: Array<{ title: string; type: string; url?: string; payload?: string }>; quickReplies?: Array<{ title: string; payload?: string }> };
  media?: { url: string; type: 'image' | 'video' | 'audio' | 'document'; caption?: string };
  listMessage?: { header: string; footer: string; buttonText: string; sections: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }> };
  location?: { latitude: number; longitude: number; label?: string };
  catalog?: { catalogId: string; title?: string; body?: string; thumbnailItemId?: string };
  authentication?: { otpCode: string; addSecurityRecommendation?: boolean; codeExpirationMinutes?: number; copyCodeText?: string };
}

interface CallRecord {
  id: string;
  number: string;
  name?: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
  duration?: number;
}

interface Contact {
  id: string;
  name: string;
  number: string;
  avatar?: string;
  company?: string;
}

interface VirtualPhoneProps {
  config: DemoConfig;
  onMessageReceived?: (message: Message) => void;
  onLogMessage?: (message: string) => void;
  selectedChannel?: 'sms' | 'rcs' | 'whatsapp' | 'voice';
}

export default function VirtualPhone({ config, onMessageReceived, onLogMessage, selectedChannel = 'sms' }: VirtualPhoneProps) {
  const [currentApp, setCurrentApp] = useState(config.virtualPhone.defaultApp);
  const [messages, setMessages] = useState<Message[]>([]);
  const [whatsAppMessages, setWhatsAppMessages] = useState<Message[]>([]);
  const [isScreenOn, setIsScreenOn] = useState(true);
  const [currentTime, setCurrentTime] = useState(config.virtualPhone.currentTime);
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [whatsAppView, setWhatsAppView] = useState<'chats' | 'chat' | 'profile'>('chats');
  const [showBrandedProfile, setShowBrandedProfile] = useState(false);
  const [brandedProfileData, setBrandedProfileData] = useState<{
    businessName: string;
    logo: string;
    verified: boolean;
    description: string;
    website: string;
    phoneNumber: string;
  } | null>(null);
  
  // Phone app state
  const [phoneView, setPhoneView] = useState<'dialer' | 'contacts' | 'recent' | 'favorites'>('dialer');
  const [dialedNumber, setDialedNumber] = useState('');
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallRecord | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [showInCallKeypad, setShowInCallKeypad] = useState(false);
  const [currentIVRPrompt, setCurrentIVRPrompt] = useState<string | null>(null);
  const [ivrResponses, setIvrResponses] = useState<Record<string, string>>({});
  const [isTTSCall, setIsTTSCall] = useState(false);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([
    {
      id: '1',
      number: '+1 (555) 123-4567',
      name: 'Demo Contact',
      type: 'incoming',
      timestamp: new Date(Date.now() - 3600000),
      duration: 245
    },
    {
      id: '2', 
      number: '+1 (555) 987-6543',
      name: 'Support Team',
      type: 'outgoing',
      timestamp: new Date(Date.now() - 7200000),
      duration: 120
    },
    {
      id: '3',
      number: '+1 (555) 246-8101',
      type: 'missed',
      timestamp: new Date(Date.now() - 10800000),
    }
  ]);
  const [contacts] = useState<Contact[]>(
    config.virtualPhone.voiceSettings.enableMockContacts 
      ? config.virtualPhone.voiceSettings.mockContacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          number: contact.number,
          avatar: contact.avatar,
          company: contact.company
        }))
      : []
  );

  // Handler for button clicks in rich messages
  const handleButtonClick = (button: { title: string; type: string; url?: string; payload?: string }, messageId: string) => {
    console.log('🎯 Button clicked:', button.title, button.type, button.payload || button.url);
    
    // Determine which channel/app we're in based on current app state
    const currentChannel = currentApp === 'whatsapp' ? 'whatsapp' : 'rcs';
    
    switch (button.type) {
      case 'url':
        if (onLogMessage) {
          onLogMessage(`🎯 Button clicked: "${button.title}" → Opening URL: ${button.url}`);
        }
        // In a real app, this would open the URL
        break;
      case 'phone':
        if (onLogMessage) {
          onLogMessage(`🎯 Button clicked: "${button.title}" → Initiating call to: ${button.payload}`);
        }
        // In a real app, this would make a phone call
        break;
      case 'reply':
        if (onLogMessage) {
          onLogMessage(`🎯 Button clicked: "${button.title}" → Sending reply: ${button.payload}`);
        }
        // Simulate user reply
        const userReply: Message = {
          id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: button.title,
          timestamp: new Date(),
          sender: 'user',
          delivered: true,
          read: true,
          channel: currentChannel,
          type: 'text'
        };
        
        // Add to appropriate message state based on current app
        if (currentApp === 'whatsapp') {
          setWhatsAppMessages(prev => [...prev, userReply]);
        } else {
          setMessages(prev => [...prev, userReply]);
        }
        break;
      default:
        if (onLogMessage) {
          onLogMessage(`🎯 Button clicked: "${button.title}" → Action: ${button.payload}`);
        }
    }
  };

  // Handler for quick reply clicks
  const handleQuickReplyClick = (reply: { title: string; payload?: string }, messageId: string) => {
    console.log('💬 Quick reply clicked:', reply.title, reply.payload);
    
    // Determine which channel/app we're in based on current app state
    const currentChannel = currentApp === 'whatsapp' ? 'whatsapp' : 'rcs';
    
    if (onLogMessage) {
      onLogMessage(`💬 Quick reply selected: "${reply.title}" → ${reply.payload}`);
    }
    
    // Simulate user quick reply
    const userReply: Message = {
      id: `quick_reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: reply.title,
      timestamp: new Date(),
      sender: 'user',
      delivered: true,
      read: true,
      channel: currentChannel,
      type: 'text'
    };
    
    // Add to appropriate message state based on current app
    if (currentApp === 'whatsapp') {
      setWhatsAppMessages(prev => [...prev, userReply]);
    } else {
      setMessages(prev => [...prev, userReply]);
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-mark messages as read when the Messages app is visible (simulates user reading)
  useEffect(() => {
    if (currentApp === 'messages' && isScreenOn) {
      const timer = setTimeout(() => {
        // Mark unread messages as read after 2 seconds of being in the Messages app
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            !msg.read && msg.sender === 'contact' 
              ? { ...msg, read: true }
              : msg
          )
        );
        
        // Also trigger read receipt callbacks for RCS messages
        const unreadRcsMessages = messages.filter(msg => 
          !msg.read && msg.sender === 'contact' && msg.channel === 'rcs'
        );
        
        if (unreadRcsMessages.length > 0 && onLogMessage) {
          onLogMessage(`📱 Auto-read: ${unreadRcsMessages.length} RCS message(s) marked as read`);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentApp, isScreenOn, messages, onLogMessage]);

  // Auto-mark WhatsApp messages as read when the WhatsApp chat is visible
  useEffect(() => {
    if (currentApp === 'whatsapp' && whatsAppView === 'chat' && isScreenOn) {
      const timer = setTimeout(() => {
        // Mark unread WhatsApp messages as read after 2 seconds of being in the chat view
        setWhatsAppMessages(prevMessages => 
          prevMessages.map(msg => 
            !msg.read && msg.sender === 'contact' 
              ? { ...msg, read: true }
              : msg
          )
        );
        
        const unreadWhatsAppMessages = whatsAppMessages.filter(msg => 
          !msg.read && msg.sender === 'contact'
        );
        
        if (unreadWhatsAppMessages.length > 0 && onLogMessage) {
          onLogMessage(`📱 Auto-read: ${unreadWhatsAppMessages.length} WhatsApp message(s) marked as read`);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentApp, whatsAppView, isScreenOn, whatsAppMessages, onLogMessage]);

  // Handle call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInCall && currentCall) {
      setCallDuration(0); // Reset duration when call starts
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCall, currentCall]);

  // Function to receive a new message from the demo
  const receiveMessage = useCallback((content: string, messageId?: string, channel: 'sms' | 'rcs' | 'whatsapp' | 'voice' = 'sms', template?: MessageTemplate) => {
    console.log('📱 receiveMessage called with:', { content, messageId, channel, template: template?.id });
    // Create rich message based on template and channel
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      timestamp: new Date(),
      sender: 'contact',
      delivered: true, // Messages from demo are automatically "delivered"
      read: false,     // Start as unread, will be marked as read when user views them
      channel,
    };

    // Add rich content for RCS, WhatsApp, and SMS (MMS) channels based on selected content type
    if (channel === 'rcs' || channel === 'whatsapp' || (channel === 'sms' && template?.selectedContentType === 'media')) {
      if (template && template.selectedContentType && (template.richMessageConfig || template.contentTypeConfig)) {
        // Configure rich content based on the selected type
        switch (template.selectedContentType) {
          case 'richCard':
            newMessage.type = 'card';
            // Determine which interactive type to use - either buttons OR quick replies
            const useButtons = template.contentTypeConfig?.interactiveType !== 'quickReplies';
            newMessage.card = {
              image: template.contentTypeConfig?.cardImage || (template.richMessageConfig?.cardImage as string) || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
              title: template.contentTypeConfig?.cardTitle || (template.richMessageConfig?.cardTitle as string) || 'Special Offer!',
              subtitle: template.contentTypeConfig?.cardSubtitle || (template.richMessageConfig?.cardSubtitle as string) || 'Limited time deal - Don\'t miss out!',
              body: template.contentTypeConfig?.cardBody || (template.richMessageConfig?.cardBody as string),
              buttons: useButtons ? (
                (template.contentTypeConfig?.buttons && template.contentTypeConfig.buttons.length > 0)
                  ? template.contentTypeConfig.buttons.map(b => ({ 
                      title: b.title, 
                      type: b.type, 
                      url: b.type === 'url' ? b.payload : undefined,
                      payload: b.type !== 'url' ? b.payload : undefined 
                    }))
                  : (template.richMessageConfig?.buttons as Array<{ title: string; type: string; url?: string; payload?: string }>) || [
                      { title: 'Shop Now', type: 'url', url: 'https://owlshop.com' },
                      { title: 'Call Us', type: 'phone', payload: '+1-833-365-9260' },
                      { title: 'More Info', type: 'reply', payload: 'more_info' }
                    ]
              ) : undefined,
              quickReplies: !useButtons ? (
                (template.contentTypeConfig?.quickReplies && template.contentTypeConfig.quickReplies.length > 0)
                  ? template.contentTypeConfig.quickReplies
                  : (template.richMessageConfig?.quickReplies as Array<{ title: string; payload?: string }>) || [
                      { title: 'Yes, I\'m interested', payload: 'interested' },
                      { title: 'Not now', payload: 'not_now' },
                      { title: 'Tell me more', payload: 'more_info' }
                    ]
              ) : undefined
            };
            break;
            
          case 'carousel':
            newMessage.type = 'carousel';
            // Use user-defined carousel items if available, otherwise fallback to defaults
            newMessage.carousel = (template.contentTypeConfig?.carouselItems && template.contentTypeConfig.carouselItems.length > 0)
              ? template.contentTypeConfig.carouselItems
              : (template.richMessageConfig?.items as Array<{ id: string; image: string; title: string; subtitle: string; buttons: Array<{ title: string; type: string }> }>) || [
                  {
                    id: '1',
                    image: '🦉',
                    title: 'Owl Hoodie',
                    subtitle: 'Premium comfort hoodie',
                    buttons: [{ title: 'Buy Now', type: 'url' }]
                  },
                  {
                    id: '2',
                    image: '👔',
                    title: 'Dev T-Shirt',
                    subtitle: 'Perfect for coding',
                    buttons: [{ title: 'Buy Now', type: 'url' }]
                  },
                  {
                    id: '3',
                    image: '☕',
                    title: 'Code Mug',
                    subtitle: 'Fuel your coding',
                    buttons: [{ title: 'Buy Now', type: 'url' }]
                  }
                ];
            break;
            
          case 'media':
            newMessage.type = 'media';
            newMessage.media = {
              url: template.contentTypeConfig?.mediaUrl || (template.richMessageConfig?.mediaUrl as string) || '',
              type: template.contentTypeConfig?.mediaType || (template.richMessageConfig?.mediaType as 'image' | 'video' | 'audio' | 'document') || 'image',
              caption: template.contentTypeConfig?.caption || (template.richMessageConfig?.caption as string) || ''
            };
            break;
            
          case 'listMessage':
            newMessage.type = 'listMessage';
            newMessage.listMessage = {
              header: template.contentTypeConfig?.listHeader || (template.richMessageConfig?.header as string) || 'Choose Your Product Category',
              footer: template.contentTypeConfig?.listFooter || (template.richMessageConfig?.footer as string) || 'Select an option to continue',
              buttonText: template.contentTypeConfig?.buttonText || (template.richMessageConfig?.buttonText as string) || 'View Products',
              sections: (template.contentTypeConfig?.listSections && template.contentTypeConfig.listSections.length > 0)
                ? template.contentTypeConfig.listSections
                : (template.richMessageConfig?.sections as Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>) || [
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
            };
            break;
            
          case 'location':
            newMessage.type = 'location';
            newMessage.location = {
              latitude: template.contentTypeConfig?.latitude || (template.richMessageConfig?.latitude as number) || 37.7749,
              longitude: template.contentTypeConfig?.longitude || (template.richMessageConfig?.longitude as number) || -122.4194,
              label: template.contentTypeConfig?.label || (template.richMessageConfig?.label as string) || 'Location'
            };
            break;
            
          case 'catalog':
            newMessage.type = 'catalog';
            newMessage.catalog = {
              catalogId: template.contentTypeConfig?.catalogId || (template.richMessageConfig?.catalogId as string) || 'CATALOG_ID_123',
              title: template.contentTypeConfig?.title || (template.richMessageConfig?.title as string) || 'Shop Our Collection',
              body: template.contentTypeConfig?.body || (template.richMessageConfig?.body as string) || 'Browse our premium products',
              thumbnailItemId: template.contentTypeConfig?.thumbnailItemId || (template.richMessageConfig?.thumbnailItemId as string)
            };
            break;
            
          case 'authentication':
            newMessage.type = 'authentication';
            newMessage.authentication = {
              otpCode: template.contentTypeConfig?.otpCode || (template.richMessageConfig?.otpCode as string) || '123456',
              addSecurityRecommendation: template.contentTypeConfig?.addSecurityRecommendation !== undefined 
                ? template.contentTypeConfig.addSecurityRecommendation 
                : (template.richMessageConfig?.addSecurityRecommendation as boolean) ?? true,
              codeExpirationMinutes: template.contentTypeConfig?.codeExpirationMinutes || (template.richMessageConfig?.codeExpirationMinutes as number) || 10,
              copyCodeText: template.contentTypeConfig?.copyCodeText || (template.richMessageConfig?.copyCodeText as string) || 'Copy Code'
            };
            break;
            
          case 'text':
          default:
            newMessage.type = 'text';
            break;
        }
      } else {
        // Fallback to text if no content type is specified
        newMessage.type = 'text';
      }
    } else {
      newMessage.type = 'text';
    }
    
    // Route to appropriate app based on channel
    if (channel === 'whatsapp') {
      // Add to WhatsApp messages (separate state)
      setWhatsAppMessages(prev => [...prev, newMessage]);
      
      // Switch to WhatsApp app
      if (currentApp !== 'whatsapp') {
        setCurrentApp('whatsapp');
      }
    } else if (channel === 'voice') {
      // Voice channel should initiate a call instead of sending a message
      const number = config.features.phoneSettings.defaultPhoneNumber;
      const name = 'Demo Call';
      initiateCall(number, template);
      
      // Switch to Phone app
      if (currentApp !== 'phone') {
        setCurrentApp('phone');
      }
      return; // Don't process as message
    } else {
      // SMS and RCS go to Messages app
      setMessages(prev => [...prev, newMessage]);
      
      // Switch to Messages app
      if (currentApp !== 'messages') {
        setCurrentApp('messages');
      }
    }
    
    // Notify parent component
    if (onMessageReceived) {
      onMessageReceived(newMessage);
    }

    // Simulate phone notification
    if (!isScreenOn) {
      setIsScreenOn(true);
    }
  }, [currentApp, isScreenOn, onMessageReceived]);

  // Function to switch apps based on channel
  const switchApp = useCallback((channel: 'sms' | 'rcs' | 'whatsapp' | 'voice') => {
    // Turn on screen if it's off
    if (!isScreenOn) {
      setIsScreenOn(true);
    }
    
    // Switch to appropriate app
    if (channel === 'whatsapp') {
      setCurrentApp('whatsapp');
      // If there are messages, go directly to chat view
      if (whatsAppMessages.length > 0) {
        setWhatsAppView('chat');
      } else {
        setWhatsAppView('chats');
      }
    } else if (channel === 'voice') {
      // Voice channel goes to phone app
      setCurrentApp('phone');
    } else {
      // SMS and RCS both go to messages app
      setCurrentApp('messages');
    }
  }, [isScreenOn, whatsAppMessages.length]);

  // Function to update message status (for read receipts, delivery confirmations, etc.)
  const updateMessageStatus = useCallback((messageId: string, status: { delivered?: boolean; read?: boolean }) => {
    console.log('📱 updateMessageStatus called with:', { messageId, status });
    
    // Update messages in the SMS/RCS app
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId || msg.id.includes(messageId)
          ? { ...msg, ...status }
          : msg
      )
    );
    
    // Update messages in the WhatsApp app
    setWhatsAppMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId || msg.id.includes(messageId)
          ? { ...msg, ...status }
          : msg
      )
    );
    
    // Log the status update
    if (onLogMessage) {
      const statusText = status.read ? 'read (✓✓)' : status.delivered ? 'delivered (✓)' : 'updated';
      onLogMessage(`📱 Message status updated: ${statusText}`);
    }
  }, [onLogMessage]);

  // Function to show branded business profile
  const showBrandedProfileInfo = useCallback((brandInfo: {
    businessName: string;
    logo: string;
    verified: boolean;
    description: string;
    website: string;
    phoneNumber: string;
  }) => {
    console.log('🏢 showBrandedProfile called with:', brandInfo);
    setBrandedProfileData(brandInfo);
    setShowBrandedProfile(true);
    setShowContactProfile(false); // Hide regular contact profile
    
    // Ensure we're in the Messages app
    if (currentApp !== 'messages') {
      setCurrentApp('messages');
    }
    
    if (onLogMessage) {
      onLogMessage(`🏢 Branded profile displayed: ${brandInfo.businessName} ${brandInfo.verified ? '✅' : '❌'}`);
    }
  }, [currentApp, onLogMessage]);

  // Expose functions globally for the demo to use
  useEffect(() => {
    window.virtualPhoneReceiveMessage = receiveMessage;
    window.virtualPhoneSwitchApp = switchApp;
    window.virtualPhoneInitiateCall = (number: string, name?: string) => {
      initiateCall(number);
      setCurrentApp('phone');
    };
    window.virtualPhoneStartTTSCall = (number: string, message: string, voice?: string) => {
      startTTSCall(number, message, voice);
      setCurrentApp('phone');
    };
    window.virtualPhoneUpdateMessageStatus = updateMessageStatus;
    window.virtualPhoneShowBrandedProfile = showBrandedProfileInfo;
    
    return () => {
      delete window.virtualPhoneReceiveMessage;
      delete window.virtualPhoneSwitchApp;
      delete window.virtualPhoneInitiateCall;
      delete window.virtualPhoneStartTTSCall;
      delete window.virtualPhoneUpdateMessageStatus;
      delete window.virtualPhoneShowBrandedProfile;
    };
  }, [receiveMessage, switchApp, updateMessageStatus, showBrandedProfileInfo]);

  const currentTheme = getMessageTheme(config, config.virtualPhone.messageTheme);

  const renderStatusBar = () => (
    <div className="flex justify-between items-center px-3 py-1 text-white text-xs font-medium">
      <div className="flex items-center space-x-1">
        <span>{currentTime}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          {[...Array(config.virtualPhone.signalStrength)].map((_, i) => (
            <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${4 + i * 2}px` }} />
          ))}
        </div>
        <span className="text-xs ml-1">{config.virtualPhone.carrierName}</span>
        <div className="flex items-center ml-2">
          <div className="w-5 h-2 border border-white rounded-sm relative">
            <div 
              className="h-full bg-white rounded-sm" 
              style={{ width: `${config.virtualPhone.batteryLevel}%` }}
            />
          </div>
          <span className="text-xs ml-1">{config.virtualPhone.batteryLevel}%</span>
        </div>
      </div>
    </div>
  );

  const renderContactProfile = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Contact Profile Header */}
      <div className="bg-gray-100 border-b border-gray-200 p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowContactProfile(false)}
            className="text-blue-500 text-sm"
          >
            {config.uiText.virtualPhone.back}
          </button>
          <h3 className="font-semibold text-sm text-gray-900">{config.uiText.virtualPhone.contactInfo}</h3>
          <div className="w-8" />
        </div>
      </div>

      {/* Contact Profile Content */}
      <div className="flex-1 p-4 bg-white overflow-y-auto">
        <div className="text-center mb-6">
          {/* Profile Avatar */}
          <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl ${
            selectedChannel === 'rcs' ? 'bg-blue-100' : 'bg-gray-300'
          }`}>
            🏪
          </div>
          
          {/* Contact Name with Verification Badge for RCS */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-900">{config.virtualPhone.contactName}</h2>
            {selectedChannel === 'rcs' && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500">{config.virtualPhone.phoneNumber}</p>
          
          {/* RCS Business Status */}
          {selectedChannel === 'rcs' && (
            <p className="text-xs text-blue-600 font-medium mt-1">✅ Verified Business</p>
          )}
        </div>

        {/* Contact Actions */}
        <div className="space-y-3">
          <button className="w-full flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">📞</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Call</p>
              <p className="text-xs text-gray-500">{config.virtualPhone.phoneNumber}</p>
            </div>
          </button>

          <button 
            className="w-full flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            onClick={() => setShowContactProfile(false)}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">💬</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Message</p>
              <p className="text-xs text-gray-500">Send a text message</p>
            </div>
          </button>

          <button className="w-full flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm">📧</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-xs text-gray-500">support@owlshop.com</p>
            </div>
          </button>
        </div>

        {/* Contact Details */}
        <div className="mt-6 space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Notes</h3>
            <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
              Twilio SMS Demo contact for testing message delivery and customer journey flows.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {messages.slice(-3).map((message, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                  <p className="text-gray-600 truncate">{message.content}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {message.timestamp.toLocaleDateString()} at {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-xs text-gray-500">No recent messages</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHomeScreen = () => (
    <div className="flex-1 p-4 grid grid-cols-3 gap-3 content-start overflow-hidden">
      {config.virtualPhone.apps.map((app) => (
        <div key={app.id} className="flex flex-col items-center">
          <button
            onClick={() => setCurrentApp(app.id)}
            className="flex flex-col items-center space-y-1 p-2 rounded-2xl transition-transform hover:scale-105 w-full"
            style={{ backgroundColor: app.backgroundColor + '20' }}
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg"
              style={{ backgroundColor: app.backgroundColor, color: app.textColor }}
            >
              {app.icon}
            </div>
          </button>
          <span className="text-xs font-medium text-gray-700 text-center mt-1 leading-tight px-1 break-words">
            {app.name}
          </span>
        </div>
      ))}
    </div>
  );

  const renderMessagesApp = () => {
    if (!currentTheme) return null;

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Header */}
        <div className="bg-gray-100 border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentApp('home')}
              className="text-blue-500 text-sm"
            >
              ← Back
            </button>
            <button 
              className="text-center flex-1 mx-2 hover:bg-gray-200 rounded-lg p-1 transition-colors"
              onClick={() => setShowContactProfile(true)}
            >
              <div className="flex items-center justify-center space-x-2">
                {/* Show contact image and verified badge for RCS channel */}
                {selectedChannel === 'rcs' && (
                  <>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🏢</span>
                    </div>
                    <div className="text-center min-w-0">
                      <div className="flex items-center justify-center space-x-1">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{config.virtualPhone.contactName}</h3>
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{config.virtualPhone.phoneNumber}</p>
                    </div>
                  </>
                )}
                {/* Show regular header for non-RCS channels */}
                {selectedChannel !== 'rcs' && (
                  <div className="text-center">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">{config.virtualPhone.contactName}</h3>
                    <p className="text-xs text-gray-500 truncate">{config.virtualPhone.phoneNumber}</p>
                  </div>
                )}
              </div>
            </button>
            <div className="w-8" />
          </div>
        </div>

        {/* Messages Container */}
        <div 
          className="flex-1 p-2 overflow-y-auto overflow-x-hidden min-h-0"
          style={{ backgroundColor: currentTheme.backgroundColor }}
        >
          <div className="space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-xs h-full flex flex-col justify-center">
                <p>No messages yet</p>
                <p className="text-xs mt-1">Messages from demo will appear here</p>
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.sender === 'user';
                const isRichMessage = (message.channel === 'rcs' && message.type !== 'text') || 
                                     (message.channel === 'sms' && message.type === 'media');
                
                return (
                  <div key={message.id} className="flex flex-col">
                    <div 
                      className={`max-w-[95%] ${
                        isUser ? 'self-end' : 'self-start'
                      } ${isRichMessage ? 'min-w-0' : 'px-3 py-2'}`}
                      style={!isRichMessage ? {
                        backgroundColor: isUser ? '#007AFF' : currentTheme.bubbleColor,
                        color: isUser ? '#FFFFFF' : currentTheme.textColor,
                        borderRadius: currentTheme.borderRadius,
                        fontFamily: currentTheme.fontFamily
                      } : {}}
                    >
                      {/* Regular text message */}
                      {(!isRichMessage || message.type === 'text') && (
                        <p className="text-xs leading-tight break-words">{message.content}</p>
                      )}
                      
                      {/* Media Message */}
                      {message.type === 'media' && message.media && (
                        <div className="bg-white rounded-lg p-2 shadow-sm border max-w-full">
                          {message.media?.caption && (
                            <p className="text-xs text-gray-900 mb-2 break-words">{message.content}</p>
                          )}
                          {message.media?.type === 'image' && message.media?.url && (
                            <div className="relative">
                              <img 
                                src={message.media?.url} 
                                alt="Media content"
                                className="max-w-full h-auto rounded border"
                                style={{ maxHeight: '200px' }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                                }}
                              />
                              <div className="hidden bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                                🖼️ Image not available<br />
                                <span className="text-xs break-all">{message.media?.url}</span>
                              </div>
                            </div>
                          )}
                          {message.media?.type === 'video' && message.media?.url && (
                            <div className="bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                              🎥 Video: {message.media?.url}
                            </div>
                          )}
                          {message.media?.type === 'audio' && message.media?.url && (
                            <div className="bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                              🎵 Audio: {message.media?.url}
                            </div>
                          )}
                          {message.media?.type === 'document' && message.media?.url && (
                            <div className="bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                              📄 Document: {message.media?.url}
                            </div>
                          )}
                          {message.media?.caption && (
                            <p className="text-xs text-gray-600 mt-2 break-words">{message.media?.caption}</p>
                          )}
                        </div>
                      )}
                      
                      {/* Quick Replies (RCS only) */}
                      {message.type === 'quick_replies' && message.quickReplies && (
                        <div className="bg-white rounded-lg p-2 shadow-sm border">
                          <p className="text-xs text-gray-900 mb-2 break-words">{message.content}</p>
                          <div className="flex flex-wrap gap-1">
                            {message.quickReplies?.map((reply) => (
                              <button
                                key={reply.id}
                                onClick={() => handleQuickReplyClick(reply, message.id)}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200"
                              >
                                {reply.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Card (RCS only) */}
                      {message.type === 'card' && message.card && (
                        <div className="bg-white rounded-lg p-3 shadow-sm border">
                          <p className="text-xs text-gray-900 mb-2 break-words">{message.content}</p>
                          <div className="bg-gray-50 rounded-lg p-3 border">
                            {/* Card Image */}
                            {message.card?.image && message.card?.image.startsWith('http') ? (
                              <div className="mb-2">
                                <img 
                                  src={message.card?.image} 
                                  alt="Card image"
                                  className="w-full h-32 object-cover rounded border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                                  }}
                                />
                                <div className="hidden text-3xl text-center py-4">🖼️</div>
                              </div>
                            ) : (
                              <div className="text-3xl text-center mb-2">{message.card?.image || '🛒'}</div>
                            )}
                            <h5 className="font-semibold text-sm mb-1">{message.card?.title}</h5>
                            <p className="text-xs text-gray-600 mb-2">{message.card?.subtitle}</p>
                            {message.card?.body && (
                              <p className="text-xs text-gray-700 mb-3 leading-relaxed">{message.card?.body}</p>
                            )}
                            
                            {/* Action Buttons */}
                            {message.card?.buttons && message.card?.buttons.length > 0 && (
                              <div className="flex space-x-1 mb-2">
                                {message.card?.buttons.map((button, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleButtonClick(button, message.id)}
                                    className={`flex-1 text-white text-xs py-2 rounded hover:opacity-80 ${
                                      button.type === 'url' ? 'bg-blue-500' : 
                                      button.type === 'phone' ? 'bg-green-500' : 'bg-gray-500'
                                    }`}
                                    title={button.type === 'url' ? button.url : button.payload}
                                  >
                                    {button.type === 'url' && '🔗 '}
                                    {button.type === 'phone' && '📞 '}
                                    {button.type === 'reply' && '💬 '}
                                    {button.title}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {/* Quick Replies */}
                            {message.card?.quickReplies && message.card?.quickReplies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {message.card?.quickReplies.map((reply, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleQuickReplyClick(reply, message.id)}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                                    title={reply.payload}
                                  >
                                    {reply.title}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Carousel (RCS only) */}
                      {message.type === 'carousel' && message.carousel && (
                        <div className="bg-white rounded-lg p-2 shadow-sm border">
                          <p className="text-xs text-gray-900 mb-2 break-words">{message.content}</p>
                          {message.template?.contentTypeConfig?.carouselBody && (
                            <p className="text-xs text-gray-700 mb-2 leading-relaxed italic">{message.template.contentTypeConfig.carouselBody}</p>
                          )}
                          <div className="flex space-x-1 overflow-x-auto pb-2 max-w-full">
                            {message.carousel?.map((item) => (
                              <div key={item.id} className="min-w-[120px] flex-shrink-0 bg-gray-50 rounded-lg p-2 border">
                                {/* Carousel Item Image */}
                                {item.image && item.image.startsWith('http') ? (
                                  <div className="mb-1">
                                    <img 
                                      src={item.image} 
                                      alt={item.title}
                                      className="w-full h-16 object-cover rounded border"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                                      }}
                                    />
                                    <div className="hidden text-lg text-center py-2">🖼️</div>
                                  </div>
                                ) : (
                                  <div className="text-lg text-center mb-1">{item.image || '📦'}</div>
                                )}
                                <h5 className="font-semibold text-xs mb-1 truncate">{item.title}</h5>
                                <p className="text-xs text-gray-600 mb-2 truncate">{item.subtitle}</p>
                                {item.buttons.map((button, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleButtonClick(button, message.id)}
                                    className="w-full bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 mb-1"
                                  >
                                    {button.title}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Channel indicator for RCS messages */}
                    {message.channel === 'rcs' && (
                      <div className={`text-xs text-gray-400 mt-1 ${
                        isUser ? 'self-end' : 'self-start'
                      }`}>
                        💬 RCS
                      </div>
                    )}
                    
                    {currentTheme.showTimestamp && (
                      <div className={`text-xs text-gray-500 mt-1 ${
                        isUser ? 'self-end' : 'self-start'
                      }`}>
                        {message.timestamp.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                        {currentTheme.showDeliveryStatus && isUser && (
                          <span className="ml-1">
                            {message.delivered ? (message.read ? '✓✓' : '✓') : '⏱'}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Read Receipt Status for RCS/WhatsApp messages from contacts */}
                    {!isUser && (message.channel === 'rcs' || message.channel === 'whatsapp') && (
                      <div className={`text-xs mt-1 ${
                        isUser ? 'self-end' : 'self-start'
                      }`}>
                        {message.delivered && message.read ? (
                          <span className="text-blue-600 font-medium">
                            ✓✓ Read
                          </span>
                        ) : message.delivered ? (
                          <span className="text-gray-500">
                            ✓ Delivered
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            ⏱ Sending...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-2 flex-shrink-0 bg-white">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
            <input
              type="text"
              placeholder="Text Message"
              className="flex-1 bg-transparent text-xs outline-none min-w-0"
              disabled
            />
            <button className="text-blue-500 font-semibold text-xs flex-shrink-0" disabled>
              Send
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-1">
            Demo mode
          </p>
        </div>
      </div>
    );
  };

  // Phone app helper functions
  const formatPhoneNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return number;
  };

  const handleDialerInput = (digit: string) => {
    if (digit === 'delete') {
      setDialedNumber(prev => prev.slice(0, -1));
    } else if (digit === 'call') {
      if (dialedNumber) {
        initiateCall(dialedNumber);
      }
    } else {
      setDialedNumber(prev => prev + digit);
    }
  };

  const initiateCall = (number: string, template?: MessageTemplate) => {
    console.log('📞 Initiating call with template:', template?.id, template?.title);
    const call: CallRecord = {
      id: Date.now().toString(),
      number: formatPhoneNumber(number),
      type: 'outgoing',
      timestamp: new Date()
    };
    setCurrentCall(call);
    setIsInCall(true);
    setShowInCallKeypad(false);
    setIsTTSCall(false); // Reset TTS state for regular calls
    
    // Set up IVR prompts based on the voice template
    if (template) {
      console.log('📞 Setting up IVR with template ID:', template.id);
      setupIVRPrompts(template);
    } else {
      console.log('📞 No template provided for IVR setup');
    }
  };

  const startTTSCall = (number: string, message: string, voice: string = 'Alice') => {
    console.log('🗣️ Starting TTS call:', { number, message, voice });
    const call: CallRecord = {
      id: Date.now().toString(),
      number: formatPhoneNumber(number),
      name: `🗣️ TTS Demo - ${voice}`,
      type: 'outgoing',
      timestamp: new Date()
    };
    setCurrentCall(call);
    setIsInCall(true);
    setShowInCallKeypad(false);
    setIsTTSCall(true); // Enable TTS visual mode
    setCurrentIVRPrompt(`🎙️ Converting to speech: "${message}"`);
  };

  const setupIVRPrompts = (template: MessageTemplate) => {
    console.log('📞 Setting up IVR prompts for template:', template.id, template.title);
    // Define IVR responses based on template type
    const ivrPrompts: Record<string, Record<string, string>> = {
      'interactive-ivr': {
        '1': '📞 Connecting to Sales Department...',
        '2': '🎧 Connecting to Customer Support...',
        '3': '💳 Connecting to Billing Department...',
        '4': '📋 Playing company directory...',
        '9': '🔄 Returning to main menu...',
        '0': '👨‍💼 Connecting to operator...'
      },
      'voice-survey-interactive': {
        '1': '⭐ Rating: 1 - Thank you for your feedback. We\'ll work to improve.',
        '2': '⭐⭐ Rating: 2 - We appreciate your input and will address your concerns.',
        '3': '⭐⭐⭐ Rating: 3 - Thank you! We\'ll continue to enhance our service.',
        '4': '⭐⭐⭐⭐ Rating: 4 - Great! We\'re glad you had a positive experience.',
        '5': '⭐⭐⭐⭐⭐ Rating: 5 - Excellent! Thank you for being a valued customer.',
        '9': '🎤 Recording your voice message now... Press # when finished.'
      },
      'appointment-reminder-voice': {
        '1': '✅ Appointment confirmed. Thank you!',
        '2': '📅 Connecting to reschedule your appointment...',
        '3': '❌ Appointment cancelled. We\'ll send confirmation.',
        '0': '🏥 Connecting to our office...'
      },
      'payment-reminder-voice': {
        '1': '💳 Processing payment now...',
        '2': '📞 Connecting to billing department...',
        '3': '📧 Email payment options sent to your account.',
        '9': '🔄 Repeating payment information...'
      }
    };

    const responses = ivrPrompts[template.id] || {
      '1': '✅ Option 1 selected',
      '2': '✅ Option 2 selected', 
      '3': '✅ Option 3 selected',
      '0': '👨‍💼 Connecting to operator...'
    };
    
    setIvrResponses(responses);
    setCurrentIVRPrompt(template.messageContent);
    console.log('📞 IVR setup complete. Responses:', Object.keys(responses), 'Prompt:', template.messageContent);
  };

  const handleDialerKeypadInput = (digit: string) => {
    if (digit === 'delete') {
      setDialedNumber(prev => prev.slice(0, -1));
    } else if (digit === 'call') {
      if (dialedNumber) {
        initiateCall(dialedNumber);
      }
    } else {
      setDialedNumber(prev => prev + digit);
    }
  };

  const handleInCallKeypadInput = (digit: string) => {
    console.log('🎯 IVR Keypad pressed:', digit);
    // Handle DTMF tones during call
    const response = ivrResponses[digit];
    if (response) {
      console.log('🎯 IVR Response:', response);
      
      // Log to activity feed directly
      if (onLogMessage) {
        onLogMessage(`🎯 IVR Input: Pressed ${digit} → ${response}`);
      }
      
      // Also send as virtual phone message
      if (onMessageReceived) {
        const ivrMessage: Message = {
          id: `ivr_${Date.now()}`,
          content: `🎯 IVR Input: Pressed ${digit} - ${response}`,
          timestamp: new Date(),
          sender: 'contact',
          delivered: true,
          read: false,
          channel: 'voice',
          type: 'text'
        };
        onMessageReceived(ivrMessage);
      }
      
      // Update current prompt to show response
      setCurrentIVRPrompt(response);
      
      // Auto-hide keypad after successful selection (but not immediately)
      setTimeout(() => {
        console.log('🎯 Hiding keypad after response');
      }, 3000);
    } else {
      console.log('❌ Invalid IVR key:', digit);
      // Invalid key pressed
      setCurrentIVRPrompt(`❌ Invalid selection: ${digit}. Please try again.`);
      if (onLogMessage) {
        onLogMessage(`❌ IVR Error: Invalid key "${digit}" pressed`);
      }
    }
  };

  const endCall = (duration?: number) => {
    if (currentCall) {
      const completedCall = { ...currentCall, duration };
      setCallHistory(prev => {
        const newHistory = [completedCall, ...prev];
        // Limit call history based on config
        return newHistory.slice(0, config.virtualPhone.voiceSettings.maxCallHistoryItems);
      });
    }
    setCurrentCall(null);
    setIsInCall(false);
    setDialedNumber('');
    setShowInCallKeypad(false);
    setCurrentIVRPrompt(null);
    setIvrResponses({});
    setIsTTSCall(false); // Reset TTS state
  };

  const renderPhoneApp = () => {
    if (isInCall && currentCall) {
      return renderInCallScreen();
    }

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Phone Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentApp(config.virtualPhone.defaultApp)}
              className="text-blue-500 text-sm"
            >
              ← Back
            </button>
            <h3 className="font-semibold text-gray-900 text-sm">Phone</h3>
            <div className="w-8" />
          </div>
        </div>

        {/* Phone Navigation */}
        <div className="bg-white border-b border-gray-200 px-1 py-1 flex-shrink-0">
          <div className="flex justify-around">
            {[
              { key: 'favorites', label: '⭐', title: 'Favorites' },
              ...(config.virtualPhone.voiceSettings.showCallHistory ? [{ key: 'recent', label: '🕒', title: 'Recent' }] : []),
              { key: 'contacts', label: '👤', title: 'Contacts' },
              { key: 'dialer', label: '⌨️', title: 'Keypad' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setPhoneView(tab.key as any)}
                className={`flex-1 flex flex-col items-center py-1 px-1 ${
                  phoneView === tab.key ? 'text-blue-500' : 'text-gray-500'
                }`}
                title={tab.title}
              >
                <span className="text-sm">{tab.label}</span>
                <span className="text-xs mt-0.5">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Content */}
        <div className="flex-1 overflow-hidden">
          {phoneView === 'dialer' && renderDialer()}
          {phoneView === 'recent' && renderCallHistory()}
          {phoneView === 'contacts' && renderContacts()}
          {phoneView === 'favorites' && renderFavorites()}
        </div>
      </div>
    );
  };

  const renderDialer = () => (
    <div className="flex-1 flex flex-col bg-white">
      {/* Dialed Number Display */}
      <div className="px-2 py-1 text-center border-b border-gray-100">
        <div className="text-xs font-light text-gray-900 min-h-[1rem] flex items-center justify-center">
          {dialedNumber || <span className="text-gray-400 text-xs">Enter number</span>}
        </div>
        {dialedNumber && (
          <div className="text-xs text-gray-500">
            {formatPhoneNumber(dialedNumber)}
          </div>
        )}
      </div>

      {/* Number Pad */}
      <div className="flex-1 px-2 py-1">
        <div className="grid grid-cols-3 gap-1 max-w-[140px] mx-auto">
          {[
            ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
            ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
            ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
            ['*', ''], ['0', '+'], ['#', '']
          ].map(([digit, letters]) => (
            <button
              key={digit}
              onClick={() => handleDialerKeypadInput(digit)}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex flex-col items-center justify-center"
            >
              <span className="text-xs font-semibold text-gray-900">{digit}</span>
              {letters && <span className="text-xs text-gray-500 -mt-1 leading-none text-center" style={{fontSize: '8px'}}>{letters}</span>}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center mt-2 space-x-3">
          {dialedNumber ? (
            <button
              onClick={() => handleDialerKeypadInput('delete')}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <span className="text-xs">⌫</span>
            </button>
          ) : (
            <div className="w-7 h-7" />
          )}
          
          <button
            onClick={() => handleDialerKeypadInput('call')}
            disabled={!dialedNumber}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              dialedNumber 
                ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-lg' 
                : 'bg-gray-300 text-gray-500 border border-gray-400'
            }`}
          >
            <span className="text-sm">📞</span>
          </button>
          
          <div className="w-7 h-7" />
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {contacts.map((contact) => (
          <div key={contact.id} className="px-3 py-2 hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">{contact.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs text-gray-500 truncate">{contact.company}</p>
                    <p className="text-xs text-gray-400 truncate">{contact.number}</p>
                  </div>
                  <button
                    onClick={() => initiateCall(contact.number)}
                    className="ml-2 w-7 h-7 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-white text-xs">📞</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="px-3 py-6 text-center">
            <div className="text-2xl mb-2">👤</div>
            <p className="text-xs text-gray-500">No contacts</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCallHistory = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {callHistory.map((call) => (
          <div key={call.id} className="px-3 py-2 hover:bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                {call.type === 'incoming' && <span className="text-green-500 text-sm">📞</span>}
                {call.type === 'outgoing' && <span className="text-blue-500 text-sm">📞</span>}
                {call.type === 'missed' && <span className="text-red-500 text-sm">📞</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {call.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{call.number}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <p className="text-xs text-gray-400">
                        {call.timestamp.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                      {call.duration && (
                        <p className="text-xs text-gray-400">
                          • {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => initiateCall(call.number)}
                    className="ml-2 w-7 h-7 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-white text-xs">📞</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {callHistory.length === 0 && (
          <div className="px-3 py-6 text-center">
            <div className="text-2xl mb-2">🕒</div>
            <p className="text-xs text-gray-500">No recent calls</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="px-3 py-6 text-center">
        <div className="text-2xl mb-2">⭐</div>
        <p className="text-xs text-gray-500">No favorites</p>
        <p className="text-xs text-gray-400 mt-1">Add contacts to favorites for quick access</p>
      </div>
    </div>
  );

  const renderInCallScreen = () => {
    if (!currentCall) return null;

    const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="flex-1 flex flex-col bg-gradient-to-b from-green-400 to-green-600 text-white overflow-hidden">
        {/* Call Info */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto">
          <div className="text-center mb-4">
            {/* Enhanced avatar for TTS calls */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 mx-auto relative ${
              isTTSCall ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse shadow-lg' : 'bg-white bg-opacity-20'
            }`}>
              <span className="text-4xl">
                {isTTSCall ? '🗣️' : currentIVRPrompt ? '🎙️' : '👤'}
              </span>
              {/* TTS Visual Indicator */}
              {isTTSCall && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-sm">🔊</span>
                </div>
              )}
            </div>
            
            <h2 className="text-lg font-light mb-1">
              {isTTSCall ? '🎙️ Text-to-Speech Demo' : currentCall.name || 'Demo Voice Call'}
            </h2>
            <p className="text-sm opacity-90 mb-1">{currentCall.number}</p>
            <p className="text-xs opacity-75">
              {isTTSCall ? '🔊 VOICE SYNTHESIS ACTIVE' : 
               currentCall.type === 'incoming' ? 'Incoming call' : 'Connected'}
            </p>
            <p className="text-lg font-mono mt-2">{formatDuration(callDuration)}</p>
            
            {/* TTS Status Display */}
            {isTTSCall && (
              <div className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-30 rounded-xl p-4 max-w-xs border-2 border-white border-opacity-50">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-2xl animate-pulse">🎵</span>
                  <p className="text-lg font-bold text-yellow-200">VOICE SYNTHESIS</p>
                  <span className="text-2xl animate-pulse">🎵</span>
                </div>
                <p className="text-sm opacity-90 mb-3 text-center font-medium">🎙️ Converting text to natural speech...</p>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-yellow-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <div className="text-center bg-white bg-opacity-20 rounded-lg p-2">
                  <p className="text-xs font-bold text-yellow-200">🗣️ Voice: Alice</p>
                  <p className="text-xs font-bold text-yellow-200">🌍 Language: en-US</p>
                </div>
              </div>
            )}
            
            {/* IVR Prompt Display */}
            {currentIVRPrompt && (
              <div className="mt-3 bg-white bg-opacity-20 rounded-lg p-2 max-w-xs">
                <p className="text-xs font-medium mb-1">🎯 IVR Prompt:</p>
                <p className="text-sm leading-relaxed">{currentIVRPrompt}</p>
              </div>
            )}

            {/* IVR Keypad - Always visible when IVR active */}
            {Object.keys(ivrResponses).length > 0 && (
              <div className="mt-3 bg-white bg-opacity-10 rounded-lg p-2">
                <p className="text-xs text-center mb-2 opacity-75">Press a key to respond:</p>
                <div className="grid grid-cols-3 gap-1 max-w-[90px] mx-auto">
                  {Object.keys(ivrResponses).map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handleInCallKeypadInput(digit)}
                      className="w-6 h-6 rounded bg-white bg-opacity-30 hover:bg-opacity-50 active:bg-opacity-70 transition-colors flex items-center justify-center"
                    >
                      <span className="text-xs font-semibold text-white">{digit}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center mt-1 opacity-50">
                  Available: {Object.keys(ivrResponses).join(', ')}
                </p>
              </div>
            )}
            
            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs opacity-50">
                IVR: {currentIVRPrompt ? 'Yes' : 'No'} | Responses: {Object.keys(ivrResponses).length}
              </div>
            )}
          </div>
        </div>

        {/* Call Controls - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 bg-gradient-to-t from-black from-opacity-10">
          <div className="flex justify-center items-center">
            {/* End Call */}
            <button
              onClick={() => endCall(callDuration)}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-full flex items-center justify-center transition-colors shadow-lg"
              title="Hang Up"
            >
              <span className="text-2xl">📞</span>
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex justify-center items-center space-x-4 mt-3">
            <button className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors">
              <span className="text-sm">🎤</span>
            </button>
            <button className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors">
              <span className="text-sm">➕</span>
            </button>
            <button className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors">
              <span className="text-sm">📱</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderWhatsAppApp = () => {

    // WhatsApp messages now come from dynamic whatsAppMessages state

    // Get the latest WhatsApp message for the chat preview
    const latestMessage = whatsAppMessages.length > 0 ? whatsAppMessages[whatsAppMessages.length - 1] : null;
    
    const chats = [
      {
        id: 'business',
        name: config.virtualPhone.contactName,
        avatar: '🏪',
        lastMessage: latestMessage ? latestMessage.content : 'No messages yet',
        timestamp: latestMessage ? latestMessage.timestamp : new Date(),
        unread: whatsAppMessages.filter(msg => !msg.read && msg.sender === 'contact').length,
        online: true
      }
    ];

    const renderWhatsAppHeader = () => (
      <div className="bg-green-600 text-white p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          {whatsAppView === 'chats' ? (
            <>
              <button 
                onClick={() => setCurrentApp(config.virtualPhone.defaultApp)}
                className="text-white text-sm"
              >
                {config.uiText.virtualPhone.back}
              </button>
              <h3 className="font-semibold">{config.uiText.whatsapp.headerTitle}</h3>
              <div className="flex items-center space-x-2">
                <button className="text-white">🔍</button>
                <button className="text-white">⋮</button>
              </div>
            </>
          ) : whatsAppView === 'profile' ? (
            <>
              <button 
                onClick={() => setWhatsAppView('chat')}
                className="text-white text-sm"
              >
                {config.uiText.virtualPhone.back}
              </button>
              <h3 className="font-semibold">{config.uiText.whatsapp.contactInfoTitle}</h3>
              <div className="w-8" />
            </>
          ) : (
            <>
              <button 
                onClick={() => setWhatsAppView('chats')}
                className="text-white text-sm"
              >
                {config.uiText.virtualPhone.back}
              </button>
              <button
                className="flex items-center space-x-2 flex-1 ml-3 text-left"
                onClick={() => setWhatsAppView('profile')}
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  🏪
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{config.virtualPhone.contactName}</h3>
                  <p className="text-xs opacity-75">{config.uiText.whatsapp.online}</p>
                </div>
              </button>
              <div className="flex items-center space-x-2">
                <button className="text-white">📞</button>
                <button className="text-white">📹</button>
                <button className="text-white">⋮</button>
              </div>
            </>
          )}
        </div>
      </div>
    );

    const renderChatsList = () => (
      <div className="flex-1 bg-white overflow-y-auto overflow-x-hidden min-h-0">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => {
              setWhatsAppView('chat');
            }}
            className="w-full p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-sm text-gray-900 truncate flex-1 pr-2">{chat.name}</h4>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {chat.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600 truncate flex-1 pr-2">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );

    const renderMessage = (message: Message) => {
      const isUser = message.sender === 'user';
      
      return (
        <div key={message.id} className={`flex mb-2 ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
          <div className={`max-w-[95%] min-w-0 ${isUser ? 'bg-green-500 text-white' : 'bg-white text-gray-900'} rounded-lg p-2 shadow-sm relative overflow-hidden`}>
            {message.type === 'text' && (
              <p className="text-sm break-words">{message.content}</p>
            )}
            
            {message.type === 'media' && message.media && (
              <div className="max-w-full">
                {message.media?.caption && (
                  <p className="text-sm mb-2 break-words">{message.content}</p>
                )}
                {message.media?.type === 'image' && message.media?.url && (
                  <div className="relative">
                    <img 
                      src={message.media?.url} 
                      alt="Media content"
                      className="max-w-full h-auto rounded border"
                      style={{ maxHeight: '200px' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                      }}
                    />
                    <div className="hidden bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                      🖼️ Image not available<br />
                      <span className="text-xs break-all">{message.media?.url}</span>
                    </div>
                  </div>
                )}
                {message.media?.type === 'video' && message.media?.url && (
                  <div className="bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                    🎥 Video: {message.media?.url}
                  </div>
                )}
                {message.media?.type === 'audio' && message.media?.url && (
                  <div className="bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                    🎵 Audio: {message.media?.url}
                  </div>
                )}
                {message.media?.type === 'document' && message.media?.url && (
                  <div className="bg-gray-100 p-4 rounded text-center text-xs text-gray-600">
                    📄 Document: {message.media?.url}
                  </div>
                )}
                {message.media?.caption && (
                  <p className="text-sm text-gray-600 mt-2 break-words">{message.media?.caption}</p>
                )}
              </div>
            )}
            
            {message.type === 'quick_replies' && (
              <div>
                <p className="text-sm mb-2 break-words">{message.content}</p>
                <div className="flex flex-wrap gap-1">
                  {message.quickReplies?.map((reply: { id: string; title: string }) => (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReplyClick(reply, message.id)}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs hover:bg-green-200"
                    >
                      {reply.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {message.type === 'carousel' && (
              <div>
                <p className="text-sm mb-2 break-words">{message.content}</p>
                {message.template?.contentTypeConfig?.carouselBody && (
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed italic">{message.template.contentTypeConfig.carouselBody}</p>
                )}
                <div className="flex space-x-1 overflow-x-auto pb-2 max-w-full">
                  {message.carousel?.map((item: { id: string; image: string; title: string; subtitle: string; buttons: Array<{ title: string; type: string }> }) => (
                    <div key={item.id} className="min-w-[120px] flex-shrink-0 bg-gray-50 rounded-lg p-2 border">
                      {/* Carousel Item Image */}
                      {item.image && item.image.startsWith('http') ? (
                        <div className="mb-1">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-16 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                            }}
                          />
                          <div className="hidden text-lg text-center py-2">🖼️</div>
                        </div>
                      ) : (
                        <div className="text-lg text-center mb-1">{item.image || '📦'}</div>
                      )}
                      <h5 className="font-semibold text-xs mb-1 truncate">{item.title}</h5>
                      <p className="text-xs text-gray-600 mb-2 truncate">{item.subtitle}</p>
                      {item.buttons.map((button: { title: string; type: string }, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleButtonClick(button, message.id)}
                          className="w-full bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600 mb-1"
                        >
                          {button.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message.type === 'card' && (
              <div>
                <p className="text-sm mb-2 break-words">{message.content}</p>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  {/* Card Image */}
                  {message.card?.image && message.card?.image.startsWith('http') ? (
                    <div className="mb-2">
                      <img 
                        src={message.card?.image} 
                        alt="Card image"
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                        }}
                      />
                      <div className="hidden text-3xl text-center py-4">🖼️</div>
                    </div>
                  ) : (
                    <div className="text-3xl text-center mb-2">{message.card?.image || '🛒'}</div>
                  )}
                  <h5 className="font-semibold text-sm mb-1">{message.card?.title}</h5>
                  <p className="text-xs text-gray-600 mb-2">{message.card?.subtitle}</p>
                  {message.card?.body && (
                    <p className="text-xs text-gray-700 mb-3 leading-relaxed">{message.card?.body}</p>
                  )}
                  
                  {/* Action Buttons */}
                  {message.card?.buttons && message.card?.buttons.length > 0 && (
                    <div className="flex space-x-1 mb-2">
                      {message.card?.buttons.map((button: { title: string; type: string; url?: string; payload?: string }, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleButtonClick(button, message.id)}
                          className={`flex-1 text-white text-xs py-2 rounded hover:opacity-80 ${
                            button.type === 'url' ? 'bg-blue-500' : 
                            button.type === 'phone' ? 'bg-green-600' : 'bg-green-500'
                          }`}
                          title={button.type === 'url' ? button.url : button.payload}
                        >
                          {button.type === 'url' && '🔗 '}
                          {button.type === 'phone' && '📞 '}
                          {button.type === 'reply' && '💬 '}
                          {button.title}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick Replies */}
                  {message.card?.quickReplies && message.card?.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {message.card?.quickReplies.map((reply: { title: string; payload?: string }, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReplyClick(reply, message.id)}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                          title={reply.payload}
                        >
                          {reply.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {message.type === 'listMessage' && (
              <div>
                <p className="text-sm mb-2 break-words">{message.content}</p>
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  {/* List Header */}
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-900">{message.listMessage?.header}</h4>
                  </div>
                  
                  {/* List Sections */}
                  <div className="max-h-64 overflow-y-auto">
                    {message.listMessage?.sections.map((section: { title: string; rows: Array<{ id: string; title: string; description?: string }> }, sectionIndex: number) => (
                      <div key={sectionIndex} className="border-b border-gray-100 last:border-b-0">
                        <div className="bg-gray-50 px-3 py-1 border-b border-gray-200">
                          <h5 className="font-medium text-xs text-gray-800">{section.title}</h5>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {section.rows.map((row: { id: string; title: string; description?: string }, rowIndex: number) => (
                            <button
                              key={rowIndex}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="text-gray-400 mr-2 text-xs">•</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{row.title}</p>
                                  {row.description && (
                                    <p className="text-xs text-gray-500 truncate">{row.description}</p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* List Footer */}
                  {message.listMessage?.footer && (
                    <div className="bg-gray-50 px-3 py-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">{message.listMessage?.footer}</p>
                    </div>
                  )}
                  
                  {/* List Button */}
                  <div className="bg-green-500 text-center">
                    <button className="w-full py-2 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                      {message.listMessage?.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {message.type === 'location' && message.location && (
              <div>
                <p className="text-sm mb-2 break-words">{message.content}</p>
                <div className="bg-white rounded-lg border border-gray-300 p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900">{message.location?.label || 'Location'}</h4>
                      <p className="text-xs text-gray-600">
                        {message.location?.latitude}, {message.location?.longitude}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600">
                    🗺️ Interactive map would display here
                  </div>
                  <button className="w-full mt-2 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
                    View in Maps
                  </button>
                </div>
              </div>
            )}

            {message.type === 'catalog' && message.catalog && (
              <div>
                <p className="text-sm mb-2 break-words">{message.content}</p>
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 border-b border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-900 flex items-center">
                      <span className="mr-2">🛍️</span>
                      {message.catalog?.title || 'Product Catalog'}
                    </h4>
                    {message.catalog?.body && (
                      <p className="text-xs text-gray-600 mt-1">{message.catalog?.body}</p>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {['Owl Hoodie', 'Dev T-Shirt', 'Code Mug', 'Stickers'].map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-lg mb-1">{['🦉', '👔', '☕', '💻'][idx]}</div>
                          <p className="text-xs font-medium">{item}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                      Browse Catalog
                    </button>
                  </div>
                </div>
              </div>
            )}

            {message.type === 'authentication' && message.authentication && (
              <div>
                <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                  <div className="bg-blue-50 px-3 py-2 border-b border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-900 flex items-center">
                      <span className="mr-2">🔐</span>
                      WhatsApp Authentication
                    </h4>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-700 mb-3">
                      Your verification code is:
                    </p>
                    <div className="bg-gray-100 rounded-lg p-3 text-center mb-3">
                      <span className="text-2xl font-mono font-bold text-gray-900">
                        {message.authentication?.otpCode}
                      </span>
                    </div>
                    <button className="w-full py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors mb-2">
                      {message.authentication?.copyCodeText || 'Copy Code'}
                    </button>
                    {message.authentication?.addSecurityRecommendation && (
                      <p className="text-xs text-gray-500 text-center">
                        For your security, do not share this code
                      </p>
                    )}
                    {message.authentication?.codeExpirationMinutes && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Code expires in {message.authentication.codeExpirationMinutes} minutes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={`text-xs mt-1 ${isUser ? 'text-green-100' : 'text-gray-500'} flex items-center justify-end`}>
              <span>
                {message.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
              {isUser && (
                <span className="ml-1">
                  {message.read ? '✓✓' : message.delivered ? '✓' : '⏱'}
                </span>
              )}
            </div>
            
            {/* Read Receipt Status for WhatsApp messages from contacts */}
            {!isUser && message.channel === 'whatsapp' && (
              <div className="text-xs mt-1 text-gray-500 flex items-center justify-start">
                {message.delivered && message.read ? (
                  <span className="text-blue-600 font-medium">
                    ✓✓ Read
                  </span>
                ) : message.delivered ? (
                  <span className="text-gray-500">
                    ✓ Delivered
                  </span>
                ) : (
                  <span className="text-gray-400">
                    ⏱ Sending...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

    const renderContactProfile = () => (
      <div className="flex-1 bg-white overflow-y-auto overflow-x-hidden">
        {/* Profile Header */}
        <div className="text-center p-2 bg-gray-50">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-1 flex items-center justify-center text-lg">
            🏪
          </div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1 truncate px-2">{config.virtualPhone.contactName}</h2>
          <p className="text-xs text-gray-500 mb-1 truncate px-2">{config.virtualPhone.phoneNumber}</p>
          <p className="text-xs text-green-600">{config.uiText.whatsapp.online}</p>
        </div>

        {/* Action Buttons */}
        <div className="p-1 border-b border-gray-200">
          <div className="flex justify-around">
            <button className="flex flex-col items-center p-1 hover:bg-gray-50 rounded-lg flex-1 max-w-[70px]">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-1">
                <span className="text-white text-xs">💬</span>
              </div>
              <span className="text-xs text-gray-600">{config.uiText.virtualPhone.message}</span>
            </button>
            <button className="flex flex-col items-center p-1 hover:bg-gray-50 rounded-lg flex-1 max-w-[70px]">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-1">
                <span className="text-white text-xs">📞</span>
              </div>
              <span className="text-xs text-gray-600">{config.uiText.virtualPhone.call}</span>
            </button>
            <button className="flex flex-col items-center p-1 hover:bg-gray-50 rounded-lg flex-1 max-w-[70px]">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mb-1">
                <span className="text-white text-xs">📹</span>
              </div>
              <span className="text-xs text-gray-600">{config.uiText.whatsapp.video}</span>
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="p-2">
          <div className="mb-3">
            <h3 className="text-xs font-medium text-gray-900 mb-1">{config.uiText.whatsapp.about}</h3>
            <p className="text-xs text-gray-600 bg-gray-50 p-1 rounded text-xs break-words">
              {config.uiText.whatsapp.aboutDescription}
            </p>
          </div>

          <div className="mb-3">
            <h3 className="text-xs font-medium text-gray-900 mb-1">{config.uiText.whatsapp.businessInfo}</h3>
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="text-gray-400 mr-1 flex-shrink-0 text-xs">🌐</span>
                <span className="text-xs text-gray-600 truncate">{config.uiText.whatsapp.website}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-1 flex-shrink-0 text-xs">📧</span>
                <span className="text-xs text-gray-600 truncate">{config.uiText.whatsapp.email}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-1 flex-shrink-0 text-xs">📍</span>
                <span className="text-xs text-gray-600 truncate">{config.uiText.whatsapp.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-gray-900 mb-1">{config.uiText.virtualPhone.recentActivity}</h3>
            <div className="space-y-1">
              {whatsAppMessages.length === 0 ? (
                <p className="text-xs text-gray-500">No recent messages</p>
              ) : (
                whatsAppMessages.slice(-1).map((message, index) => (
                  <div key={index} className="bg-gray-50 p-1 rounded">
                    <p className="text-xs text-gray-600 truncate break-words">{message.content}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {message.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );

    const renderChatView = () => (
      <div className="flex-1 flex flex-col bg-green-50 min-h-0">
        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-green-50 to-green-100 min-h-0">
          {whatsAppMessages.length === 0 ? (
            <div className="text-center text-gray-500 text-xs h-full flex flex-col justify-center">
              <p>No messages yet</p>
              <p className="text-xs mt-1">WhatsApp messages from demo will appear here</p>
            </div>
          ) : (
            whatsAppMessages.map(renderMessage)
          )}
        </div>
        
        {/* Input Bar */}
        <div className="bg-white p-2 flex items-center space-x-2 border-t">
          <button className="text-gray-500">😊</button>
          <button className="text-gray-500">📎</button>
          <input
            type="text"
            placeholder={config.uiText.whatsapp.typeMessage}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            disabled
          />
          <button className="text-green-500">🎤</button>
        </div>
      </div>
    );

    return (
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {renderWhatsAppHeader()}
        {whatsAppView === 'chats' ? renderChatsList() : 
         whatsAppView === 'profile' ? renderContactProfile() : 
         renderChatView()}
      </div>
    );
  };

  const renderBrandedProfile = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Branded Profile Header */}
      <div className="bg-gray-100 border-b border-gray-200 p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowBrandedProfile(false)}
            className="text-blue-500 text-sm"
          >
            {config.uiText.virtualPhone.back}
          </button>
          <h3 className="font-semibold text-sm text-gray-900">Business Profile</h3>
          <div className="w-8" />
        </div>
      </div>

      {/* Branded Profile Content */}
      <div className="flex-1 p-4 bg-white overflow-y-auto">
        {brandedProfileData && (
          <>
            {/* Business Header */}
            <div className="text-center mb-6">
              {/* Business Logo */}
              <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {brandedProfileData.logo.startsWith('http') ? (
                  <img 
                    src={brandedProfileData.logo} 
                    alt={brandedProfileData.businessName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                    }}
                  />
                ) : null}
                <div className={`text-2xl ${brandedProfileData.logo.startsWith('http') ? 'hidden' : 'block'}`}>
                  🏢
                </div>
              </div>
              
              {/* Business Name with Verification */}
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-900">{brandedProfileData.businessName}</h2>
                {brandedProfileData.verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-gray-500">{brandedProfileData.phoneNumber}</p>
              {brandedProfileData.verified && (
                <p className="text-xs text-blue-600 font-medium mt-1">✅ Verified Business</p>
              )}
            </div>

            {/* Business Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed">
                {brandedProfileData.description}
              </p>
            </div>

            {/* Contact Actions */}
            <div className="space-y-3 mb-6">
              <button 
                className="w-full flex items-center p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                onClick={() => setShowBrandedProfile(false)}
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">💬</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Message</p>
                  <p className="text-xs text-gray-500">Send a text message</p>
                </div>
              </button>

              <button className="w-full flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📞</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Call</p>
                  <p className="text-xs text-gray-500">{brandedProfileData.phoneNumber}</p>
                </div>
              </button>

              <button className="w-full flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🌐</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <p className="text-xs text-gray-500">{brandedProfileData.website}</p>
                </div>
              </button>
            </div>

            {/* Business Trust Indicators */}
            {brandedProfileData.verified && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Trust & Safety</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    <span className="text-xs text-gray-600">Verified Business Account</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">🛡️</span>
                    </span>
                    <span className="text-xs text-gray-600">Secure RCS Messaging</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderCurrentApp = () => {
    // Show branded profile overlay when requested
    if (showBrandedProfile && currentApp === 'messages') {
      return renderBrandedProfile();
    }
    
    // Show contact profile overlay when requested
    if (showContactProfile && currentApp === 'messages') {
      return renderContactProfile();
    }
    
    switch (currentApp) {
      case 'messages':
        return renderMessagesApp();
      case 'phone':
        return renderPhoneApp();
      case 'whatsapp':
        return renderWhatsAppApp();
      case 'home':
      default:
        return renderHomeScreen();
    }
  };

  if (!isScreenOn) {
    return (
      <div className="bg-black rounded-3xl p-2 shadow-2xl w-full max-w-sm mx-auto">
        <div 
          className="bg-black rounded-2xl overflow-hidden cursor-pointer hover:bg-gray-900 transition-colors w-full aspect-[1/2] max-w-[300px] max-h-[600px] mx-auto flex flex-col" 
          style={{ minHeight: '400px' }}
          onClick={() => setIsScreenOn(true)}
        >
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-4xl mb-4">📱</div>
              <div className="text-white text-sm opacity-50">
                {config.uiText.virtualPhone.tapToWake}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-3xl p-2 shadow-2xl w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden w-full aspect-[1/2] max-w-[300px] max-h-[600px] mx-auto flex flex-col"
           style={{ minHeight: '400px' }}>
        {/* Status Bar */}
        <div className="bg-gray-800 flex-shrink-0">
          {renderStatusBar()}
        </div>
        
        {/* Screen Content - Full Height */}
        <div className="bg-white flex-1 flex flex-col relative overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />
          
          {/* App Content - Fill remaining space */}
          <div className="flex-1 flex flex-col overflow-hidden pt-6 pb-2">
            {renderCurrentApp()}
          </div>
          
          {/* Home Indicator - Overlay */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setCurrentApp('home')}
              className="w-32 h-1 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"
              title="Home"
            />
          </div>
        </div>
      </div>
      
      {/* Phone Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setIsScreenOn(!isScreenOn)}
          className="px-3 py-1 bg-gray-700 text-white text-xs rounded-full hover:bg-gray-600 transition-colors"
        >
          {isScreenOn ? 'Sleep' : 'Wake'}
        </button>
        <button
          onClick={() => setCurrentApp('home')}
          className="px-3 py-1 bg-gray-700 text-white text-xs rounded-full hover:bg-gray-600 transition-colors"
        >
          Home
        </button>
      </div>
    </div>
  );
}