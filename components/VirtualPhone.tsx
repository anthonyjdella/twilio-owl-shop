"use client";

import { useState, useEffect, useCallback } from "react";
import { DemoConfig, getMessageTheme } from "@/config/demo-config";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    virtualPhoneReceiveMessage?: (content: string, messageId?: string) => void;
  }
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'contact';
  delivered: boolean;
  read: boolean;
}

interface VirtualPhoneProps {
  config: DemoConfig;
  onMessageReceived?: (message: Message) => void;
}

export default function VirtualPhone({ config, onMessageReceived }: VirtualPhoneProps) {
  const [currentApp, setCurrentApp] = useState(config.virtualPhone.defaultApp);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isScreenOn, setIsScreenOn] = useState(true);
  const [currentTime, setCurrentTime] = useState(config.virtualPhone.currentTime);
  const [showContactProfile, setShowContactProfile] = useState(false);

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
  const receiveMessage = useCallback((content: string, messageId?: string) => {
    const newMessage: Message = {
      id: messageId || `msg_${Date.now()}`,
      content,
      timestamp: new Date(),
      sender: 'contact',
      delivered: true,
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Notify parent component
    if (onMessageReceived) {
      onMessageReceived(newMessage);
    }

    // Auto-switch to messages app when receiving a message
    if (currentApp !== 'messages') {
      setCurrentApp('messages');
    }

    // Simulate phone notification
    if (!isScreenOn) {
      setIsScreenOn(true);
    }
  }, [currentApp, isScreenOn, onMessageReceived]);

  // Expose receiveMessage function globally for the demo to use
  useEffect(() => {
    window.virtualPhoneReceiveMessage = receiveMessage;
    
    return () => {
      delete window.virtualPhoneReceiveMessage;
    };
  }, [receiveMessage]);

  const currentTheme = getMessageTheme(config, config.virtualPhone.messageTheme);

  const renderStatusBar = () => (
    <div className="flex justify-between items-center px-6 py-2 text-white text-sm font-medium">
      <div className="flex items-center space-x-1">
        <span>{currentTime}</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          {[...Array(config.virtualPhone.signalStrength)].map((_, i) => (
            <div key={i} className="w-1 bg-white rounded-full" style={{ height: `${4 + i * 2}px` }} />
          ))}
        </div>
        <span className="text-xs ml-2">{config.virtualPhone.carrierName}</span>
        <div className="flex items-center ml-3">
          <div className="w-6 h-3 border border-white rounded-sm relative">
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
          className="flex-1 p-2 overflow-y-auto min-h-0"
          style={{ backgroundColor: currentTheme.backgroundColor }}
        >
          <div className="space-y-2 h-full">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-xs h-full flex flex-col justify-center">
                <p>No messages yet</p>
                <p className="text-xs mt-1">Messages from demo will appear here</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div 
                    className={`max-w-[75%] px-3 py-2 ${
                      message.sender === 'user' ? 'self-end' : 'self-start'
                    }`}
                    style={{
                      backgroundColor: message.sender === 'user' ? '#007AFF' : currentTheme.bubbleColor,
                      color: message.sender === 'user' ? '#FFFFFF' : currentTheme.textColor,
                      borderRadius: currentTheme.borderRadius,
                      fontFamily: currentTheme.fontFamily
                    }}
                  >
                    <p className="text-xs leading-tight break-words">{message.content}</p>
                  </div>
                  {currentTheme.showTimestamp && (
                    <div className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'user' ? 'self-end' : 'self-start'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                      {currentTheme.showDeliveryStatus && message.sender === 'user' && (
                        <span className="ml-1">
                          {message.delivered ? (message.read ? '✓✓' : '✓') : '⏱'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
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
    const [whatsAppView, setWhatsAppView] = useState<'chats' | 'chat'>('chats');
    const [selectedChat, setSelectedChat] = useState<string>('business');

    // Sample WhatsApp messages with rich content
    const whatsAppMessages = [
      {
        id: '1',
        type: 'text',
        content: 'Welcome to Owl Shop! 🦉 How can we help you today?',
        sender: 'business',
        timestamp: new Date(Date.now() - 300000),
        delivered: true,
        read: true
      },
      {
        id: '2',
        type: 'quick_replies',
        content: 'What would you like to do?',
        sender: 'business',
        timestamp: new Date(Date.now() - 240000),
        delivered: true,
        read: true,
        quickReplies: [
          { id: '1', title: '🛍️ Shop Now' },
          { id: '2', title: '📦 Track Order' },
          { id: '3', title: '💬 Support' }
        ]
      },
      {
        id: '3',
        type: 'text',
        content: 'Shop Now',
        sender: 'user',
        timestamp: new Date(Date.now() - 180000),
        delivered: true,
        read: true
      },
      {
        id: '4',
        type: 'carousel',
        content: 'Here are our featured products:',
        sender: 'business',
        timestamp: new Date(Date.now() - 120000),
        delivered: true,
        read: true,
        carousel: [
          {
            id: '1',
            image: '🦉',
            title: 'Owl Hoodie',
            subtitle: 'Comfortable premium hoodie',
            price: '$49.99',
            buttons: [{ title: 'Buy Now', type: 'url' }]
          },
          {
            id: '2', 
            image: '👔',
            title: 'Dev T-Shirt',
            subtitle: 'Perfect for coding sessions',
            price: '$29.99',
            buttons: [{ title: 'Buy Now', type: 'url' }]
          },
          {
            id: '3',
            image: '☕',
            title: 'Code & Coffee Mug',
            subtitle: 'Fuel your programming',
            price: '$19.99',
            buttons: [{ title: 'Buy Now', type: 'url' }]
          }
        ]
      },
      {
        id: '5',
        type: 'card',
        content: 'Special offer just for you!',
        sender: 'business',
        timestamp: new Date(Date.now() - 60000),
        delivered: true,
        read: false,
        card: {
          image: '🎉',
          title: '25% OFF Everything',
          subtitle: 'Limited time offer - Use code: TWILIO25',
          buttons: [
            { title: 'Shop Now', type: 'url' },
            { title: 'Copy Code', type: 'action' }
          ]
        }
      }
    ];

    const chats = [
      {
        id: 'business',
        name: 'Owl Shop',
        avatar: '🏪',
        lastMessage: 'Special offer just for you!',
        timestamp: new Date(Date.now() - 60000),
        unread: 1,
        online: true
      },
      {
        id: 'support',
        name: 'Owl Support',
        avatar: '🦉',
        lastMessage: 'How can we help you?',
        timestamp: new Date(Date.now() - 3600000),
        unread: 0,
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
                ← Back
              </button>
              <h3 className="font-semibold">WhatsApp</h3>
              <div className="flex items-center space-x-2">
                <button className="text-white">🔍</button>
                <button className="text-white">⋮</button>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => setWhatsAppView('chats')}
                className="text-white text-sm"
              >
                ← Back
              </button>
              <div className="flex items-center space-x-2 flex-1 ml-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  🏪
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Owl Shop</h3>
                  <p className="text-xs opacity-75">Online</p>
                </div>
              </div>
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
      <div className="flex-1 bg-white overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => {
              setSelectedChat(chat.id);
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
            <div className="flex-1 text-left">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-sm text-gray-900">{chat.name}</h4>
                <span className="text-xs text-gray-500">
                  {chat.timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                {chat.unread > 0 && (
                  <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    );

    const renderMessage = (message: any) => {
      const isUser = message.sender === 'user';
      
      return (
        <div key={message.id} className={`flex mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] ${isUser ? 'bg-green-500 text-white' : 'bg-white text-gray-900'} rounded-lg p-2 shadow-sm relative`}>
            {message.type === 'text' && (
              <p className="text-sm">{message.content}</p>
            )}
            
            {message.type === 'quick_replies' && (
              <div>
                <p className="text-sm mb-2">{message.content}</p>
                <div className="flex flex-wrap gap-1">
                  {message.quickReplies.map((reply: any) => (
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
                <p className="text-sm mb-2">{message.content}</p>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {message.carousel.map((item: any) => (
                    <div key={item.id} className="min-w-[140px] bg-gray-50 rounded-lg p-2 border">
                      <div className="text-2xl text-center mb-1">{item.image}</div>
                      <h5 className="font-semibold text-xs mb-1">{item.title}</h5>
                      <p className="text-xs text-gray-600 mb-1">{item.subtitle}</p>
                      <p className="font-bold text-sm text-green-600 mb-2">{item.price}</p>
                      {item.buttons.map((button: any, idx: number) => (
                        <button
                          key={idx}
                          className="w-full bg-green-500 text-white text-xs py-1 rounded hover:bg-green-600"
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
                <p className="text-sm mb-2">{message.content}</p>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <div className="text-3xl text-center mb-2">{message.card.image}</div>
                  <h5 className="font-semibold text-sm mb-1">{message.card.title}</h5>
                  <p className="text-xs text-gray-600 mb-3">{message.card.subtitle}</p>
                  <div className="flex space-x-1">
                    {message.card.buttons.map((button: any, idx: number) => (
                      <button
                        key={idx}
                        className="flex-1 bg-green-500 text-white text-xs py-2 rounded hover:bg-green-600"
                      >
                        {button.title}
                      </button>
                    ))}
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

    const renderChatView = () => (
      <div className="flex-1 flex flex-col bg-green-50">
        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-b from-green-50 to-green-100">
          {whatsAppMessages.map(renderMessage)}
        </div>
        
        {/* Input Bar */}
        <div className="bg-white p-2 flex items-center space-x-2 border-t">
          <button className="text-gray-500">😊</button>
          <button className="text-gray-500">📎</button>
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            disabled
          />
          <button className="text-green-500">🎤</button>
        </div>
      </div>
    );

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {renderWhatsAppHeader()}
        {whatsAppView === 'chats' ? renderChatsList() : renderChatView()}
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