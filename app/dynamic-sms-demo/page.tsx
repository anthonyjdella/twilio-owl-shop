"use client";

import { useState, useEffect } from "react";
import { defaultDemoConfig, DemoConfig, MessageTemplate, processMessageTemplate } from "@/config/demo-config";
import VirtualPhone from "@/components/VirtualPhone";
import DynamicMessageCard from "@/components/DynamicMessageCard";
import ConfigPanel from "@/components/ConfigPanel";

// Extend Window interface to include our custom property
declare global {
  interface Window {
    virtualPhoneReceiveMessage?: (content: string, messageId?: string) => void;
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

        // Send to Twilio (real SMS)
        const result = await callSMSAPI(template.apiAction, template.variables);

        addResult(
            result.success
                ? `✅ ${template.title} sent successfully`
                : `❌ Failed: ${result.error}`
        );

        // Send to virtual phone (mock message)
        if (window.virtualPhoneReceiveMessage) {
            setTimeout(() => {
                window.virtualPhoneReceiveMessage!(processedMessage, template.id);
                addResult(`📱 Message delivered to virtual phone`);
            }, 1000);
        }

        // Log detailed response
        if (result.success) {
            addResult(`📋 Message Content: "${processedMessage}"`);
            addResult(`📋 SID: ${result.sid || "N/A"}`);
            addResult(`📋 Demo Mode: ${result.demo ? "Yes" : "No"}`);
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
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="buffalo-title text-xl mb-4" style={{ color: config.brandColors.secondary }}>
                                {config.uiText.sections.demoActions}
                            </h2>
                            <div className="space-y-3">
                                <button
                                    onClick={sendJourneyFlow}
                                    disabled={!phoneNumber || isRunning}
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

                        {/* Message Templates Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                            {getFilteredTemplates().map((template) => (
                                <div key={template.id}>
                                    <DynamicMessageCard
                                        template={template}
                                        onSend={sendMessage}
                                        onUpdate={updateTemplate}
                                        isLoading={isRunning}
                                        disabled={!phoneNumber}
                                        brandColors={config.brandColors}
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
            <ConfigPanel
                config={config}
                onConfigChange={setConfig}
                isOpen={configPanelOpen}
                onToggle={() => setConfigPanelOpen(!configPanelOpen)}
            />
        </div>
    );
}