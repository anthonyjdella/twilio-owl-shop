"use client";

import { useState, useEffect, useCallback } from "react";
import { DemoConfig, getMessageTheme, MessageTemplate } from "@/config/demo-config";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    virtualPhoneReceiveMessage?: (content: string, messageId?: string, channel?: 'sms' | 'rcs' | 'whatsapp', template?: MessageTemplate) => void;
    virtualPhoneSwitchApp?: (channel: 'sms' | 'rcs' | 'whatsapp') => void;
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
  type?: 'text' | 'quick_replies' | 'carousel' | 'card' | 'media' | 'listMessage';
  template?: MessageTemplate;
  quickReplies?: Array<{ id: string; title: string }>;
  carousel?: Array<{ id: string; image: string; title: string; subtitle: string; buttons: Array<{ title: string; type: string }> }>;
  card?: { image: string; title: string; subtitle: string; body?: string; buttons?: Array<{ title: string; type: string; url?: string; payload?: string }>; quickReplies?: Array<{ title: string; payload?: string }> };
  media?: { url: string; type: 'image' | 'video' | 'audio' | 'document'; caption?: string };
  listMessage?: { header: string; footer: string; buttonText: string; sections: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }> };
}

interface VirtualPhoneProps {
  config: DemoConfig;
  onMessageReceived?: (message: Message) => void;
}

export default function VirtualPhone({ config, onMessageReceived }: VirtualPhoneProps) {
  const [currentApp, setCurrentApp] = useState(config.virtualPhone.defaultApp);
  const [messages, setMessages] = useState<Message[]>([]);
  const [whatsAppMessages, setWhatsAppMessages] = useState<Message[]>([]);
  const [isScreenOn, setIsScreenOn] = useState(true);
  const [currentTime, setCurrentTime] = useState(config.virtualPhone.currentTime);
  const [showContactProfile, setShowContactProfile] = useState(false);
  const [whatsAppView, setWhatsAppView] = useState<'chats' | 'chat' | 'profile'>('chats');

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

  // Function to receive a new message from the demo
  const receiveMessage = useCallback((content: string, messageId?: string, channel: 'sms' | 'rcs' | 'whatsapp' = 'sms', template?: MessageTemplate) => {
    // Create rich message based on template and channel
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      timestamp: new Date(),
      sender: 'contact',
      delivered: true,
      read: false,
      channel,
    };

    // Add rich content for RCS and WhatsApp channels based on selected content type
    if (channel === 'rcs' || channel === 'whatsapp') {
      if (template && template.selectedContentType && template.richMessageConfig) {
        // Configure rich content based on the selected type
        switch (template.selectedContentType) {
          case 'richCard':
            newMessage.type = 'card';
            // Determine which interactive type to use - either buttons OR quick replies
            const useButtons = template.contentTypeConfig?.interactiveType !== 'quickReplies';
            newMessage.card = {
              image: template.contentTypeConfig?.cardImage || (template.richMessageConfig.cardImage as string) || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
              title: template.contentTypeConfig?.cardTitle || (template.richMessageConfig.cardTitle as string) || 'Special Offer!',
              subtitle: template.contentTypeConfig?.cardSubtitle || (template.richMessageConfig.cardSubtitle as string) || 'Limited time deal - Don\'t miss out!',
              body: template.contentTypeConfig?.cardBody || (template.richMessageConfig.cardBody as string),
              buttons: useButtons ? (
                (template.contentTypeConfig?.buttons && template.contentTypeConfig.buttons.length > 0)
                  ? template.contentTypeConfig.buttons.map(b => ({ 
                      title: b.title, 
                      type: b.type, 
                      url: b.type === 'url' ? b.payload : undefined,
                      payload: b.type !== 'url' ? b.payload : undefined 
                    }))
                  : (template.richMessageConfig.buttons as Array<{ title: string; type: string; url?: string; payload?: string }>) || [
                      { title: 'Shop Now', type: 'url', url: 'https://owlshop.com' },
                      { title: 'Call Us', type: 'phone', payload: '+1-833-365-9260' },
                      { title: 'More Info', type: 'reply', payload: 'more_info' }
                    ]
              ) : undefined,
              quickReplies: !useButtons ? (
                (template.contentTypeConfig?.quickReplies && template.contentTypeConfig.quickReplies.length > 0)
                  ? template.contentTypeConfig.quickReplies
                  : (template.richMessageConfig.quickReplies as Array<{ title: string; payload?: string }>) || [
                      { title: 'Yes, I\'m interested', payload: 'interested' },
                      { title: 'Not now', payload: 'not_now' },
                      { title: 'Tell me more', payload: 'more_info' }
                    ]
              ) : undefined
            };
            break;
            
          case 'carousel':
            // Use user-defined carousel items if available, otherwise fallback to defaults
            newMessage.carousel = (template.contentTypeConfig?.carouselItems && template.contentTypeConfig.carouselItems.length > 0)
              ? template.contentTypeConfig.carouselItems
              : (template.richMessageConfig.items as Array<{ id: string; image: string; title: string; subtitle: string; buttons: Array<{ title: string; type: string }> }>) || [
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
            if (template.contentTypeConfig) {
              newMessage.media = {
                url: template.contentTypeConfig.mediaUrl || (template.richMessageConfig.mediaUrl as string) || '',
                type: template.contentTypeConfig.mediaType || (template.richMessageConfig.mediaType as 'image' | 'video' | 'audio' | 'document') || 'image',
                caption: template.contentTypeConfig.caption || (template.richMessageConfig.caption as string) || ''
              };
            }
            break;
            
          case 'listMessage':
            newMessage.type = 'listMessage';
            newMessage.listMessage = {
              header: template.contentTypeConfig?.listHeader || (template.richMessageConfig.header as string) || 'Choose Your Product Category',
              footer: template.contentTypeConfig?.listFooter || (template.richMessageConfig.footer as string) || 'Select an option to continue',
              buttonText: template.contentTypeConfig?.buttonText || (template.richMessageConfig.buttonText as string) || 'View Products',
              sections: (template.contentTypeConfig?.listSections && template.contentTypeConfig.listSections.length > 0)
                ? template.contentTypeConfig.listSections
                : (template.richMessageConfig.sections as Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>) || [
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
  const switchApp = useCallback((channel: 'sms' | 'rcs' | 'whatsapp') => {
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
    } else {
      // SMS and RCS both go to messages app
      setCurrentApp('messages');
    }
  }, [isScreenOn, whatsAppMessages.length]);

  // Expose functions globally for the demo to use
  useEffect(() => {
    window.virtualPhoneReceiveMessage = receiveMessage;
    window.virtualPhoneSwitchApp = switchApp;
    
    return () => {
      delete window.virtualPhoneReceiveMessage;
      delete window.virtualPhoneSwitchApp;
    };
  }, [receiveMessage, switchApp]);

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
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
            🏪
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{config.virtualPhone.contactName}</h2>
          <p className="text-sm text-gray-500">{config.virtualPhone.phoneNumber}</p>
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
              <h3 className="font-semibold text-sm text-gray-900 truncate">{config.virtualPhone.contactName}</h3>
              <p className="text-xs text-gray-500 truncate">{config.virtualPhone.phoneNumber}</p>
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
                const isRichMessage = message.channel === 'rcs' && message.type !== 'text';
                
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

  const renderPhoneApp = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Phone Header */}
      <div className="bg-gray-100 border-b border-gray-200 p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setCurrentApp(config.virtualPhone.defaultApp)}
            className="text-blue-500 text-sm"
          >
            ← Back
          </button>
          <h3 className="font-semibold text-gray-900">Phone</h3>
          <div className="w-8" />
        </div>
      </div>

      {/* Phone Interface */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="text-4xl mb-4">📞</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone App</h3>
        <p className="text-center text-gray-500 text-xs px-4">
          Demo phone interface<br />
          Call functionality not implemented
        </p>
      </div>
    </div>
  );

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

  const renderCurrentApp = () => {
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