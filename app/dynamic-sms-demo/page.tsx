"use client";

import { useState, useEffect } from "react";
import { defaultDemoConfig, DemoConfig, MessageTemplate, processMessageTemplate } from "@/config/demo-config";
import VirtualPhone from "@/components/VirtualPhone";
import DynamicMessageCard from "@/components/DynamicMessageCard";
import ConfigPanel from "@/components/ConfigPanel";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    virtualPhoneReceiveMessage?: (content: string, messageId?: string, channel?: 'sms' | 'rcs' | 'whatsapp', template?: MessageTemplate) => void;
    virtualPhoneSwitchApp?: (channel: 'sms' | 'rcs' | 'whatsapp') => void;
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
    const [selectedChannel, setSelectedChannel] = useState<'sms' | 'rcs' | 'whatsapp'>(config.features.defaultChannel);
    const [selectedContentType, setSelectedContentType] = useState<'text' | 'media' | 'richCard' | 'carousel' | 'listMessage'>('text');

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

    const clearResults = () => {
        setResults([]);
    };

    // Function to switch virtual phone app based on channel
    const switchVirtualPhoneApp = (channel: 'sms' | 'rcs' | 'whatsapp') => {
        if (window.virtualPhoneSwitchApp) {
            window.virtualPhoneSwitchApp(channel);
        }
    };

    // Handle channel selection with app switching
    const handleChannelChange = (channel: 'sms' | 'rcs' | 'whatsapp') => {
        setSelectedChannel(channel);
        
        // Reset content type to the first available option for this channel
        const availableTypes = Object.values(config.richMessageTypes).filter(type => 
            type.available.includes(channel)
        );
        if (availableTypes.length > 0) {
            setSelectedContentType(availableTypes[0].id as 'text' | 'media' | 'richCard' | 'carousel' | 'listMessage');
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

    const sendMessage = async (template: MessageTemplate) => {
        setIsRunning(true);
        addResult(`🚀 Sending ${template.title}...`);

        // Process the message template
        const processedMessage = processMessageTemplate(template, { 
            brandName: config.brandName,
            timestamp: Date.now()
        });

        // Send to Twilio (real SMS) - only for SMS channel and only if phone number is provided
        let result = { success: true, demo: true, sid: 'MOCK', error: undefined };
        if (selectedChannel === 'sms' && phoneNumber) {
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

        // Always send to virtual phone (mock message) regardless of real SMS result
        if (window.virtualPhoneReceiveMessage) {
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

        // Log detailed response
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
        if (activeCategory === 'all') {
            return config.messageTemplates;
        }
        return config.messageTemplates.filter(template => template.category === activeCategory);
    };

    const categories = ['all', ...Array.from(new Set(config.messageTemplates.map(t => t.category)))];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'marketing': return config.brandColors.primary;
            case 'transactional': return config.brandColors.accent;
            case 'notification': return '#00C758';
            case 'authentication': return '#DC2626';
            case 'all': return config.brandColors.primary;
            default: return config.brandColors.primary;
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
                                            onClick={() => setSelectedContentType(contentType.id as 'text' | 'media' | 'richCard' | 'carousel' | 'listMessage')}
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

                    {/* Middle Column - Message Templates */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Category Filter */}
                        {config.layout.showCategoryFilter && (
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
                                                {category}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Message Templates Grid */}
                        <div className={`grid grid-cols-1 ${config.layout.gridColumns === 1 ? '' : 'md:grid-cols-' + config.layout.gridColumns} gap-4 auto-rows-fr`}>
                            {getFilteredTemplates().map((template) => (
                                <div key={template.id}>
                                    <DynamicMessageCard
                                        template={template}
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
                                        onMessageReceived={(message) => {
                                            addResult(`📱 Virtual phone received: "${message.content}"`);
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