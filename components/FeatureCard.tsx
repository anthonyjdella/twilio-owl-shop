"use client";

import { useState } from "react";
import { FeatureCard as FeatureCardType } from "@/config/demo-config";

interface FeatureCardProps {
    feature: FeatureCardType;
    onDemo: (feature: FeatureCardType) => void;
    onUpdate?: (feature: FeatureCardType) => void;
    isLoading: boolean;
    brandColors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
}

export default function FeatureCard({ feature, onDemo, onUpdate, isLoading, brandColors }: FeatureCardProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedFeature, setEditedFeature] = useState<FeatureCardType>(feature);

    const getChannelColor = (channel: string) => {
        switch (channel) {
            case 'sms': return '#007AFF';
            case 'rcs': return '#FF6B00';
            case 'whatsapp': return '#25D366';
            case 'voice': return '#DC2626';
            default: return brandColors.primary;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'sms-features': return '#007AFF';
            case 'rcs-features': return '#FF6B00';
            case 'whatsapp-features': return '#25D366';
            case 'voice-features': return '#DC2626';
            default: return brandColors.accent;
        }
    };

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(editedFeature);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedFeature(feature);
        setIsEditing(false);
    };

    const updateFeatureField = (path: string, value: any) => {
        const keys = path.split('.');
        const newFeature = { ...editedFeature };
        let current: any = newFeature;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        setEditedFeature(newFeature);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{isEditing ? editedFeature.emoji : feature.emoji}</span>
                        <div>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={editedFeature.title}
                                        onChange={(e) => updateFeatureField('title', e.target.value)}
                                        className="font-semibold text-gray-900 text-sm leading-tight border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 w-full"
                                    />
                                    <textarea
                                        value={editedFeature.description}
                                        onChange={(e) => updateFeatureField('description', e.target.value)}
                                        className="text-xs text-gray-600 mt-1 border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 w-full resize-none"
                                        rows={2}
                                    />
                                </>
                            ) : (
                                <>
                                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {feature.description}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    {onUpdate && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-gray-400 hover:text-gray-600 text-sm"
                            title={isEditing ? "Cancel edit" : "Edit feature"}
                        >
                            {isEditing ? '✕' : '✏️'}
                        </button>
                    )}
                </div>

                {/* Channel Badge */}
                <div className="flex items-center mt-3">
                    <span 
                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getChannelColor(feature.channel) }}
                    >
                        {feature.channel.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-grow">
                {isEditing ? (
                    <div className="space-y-4">
                        {/* Editable Basic Fields */}
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Emoji:</label>
                            <input
                                type="text"
                                value={editedFeature.emoji}
                                onChange={(e) => updateFeatureField('emoji', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                maxLength={2}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Message Content:</label>
                            <textarea
                                value={editedFeature.messageContent}
                                onChange={(e) => updateFeatureField('messageContent', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 resize-none"
                                rows={3}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Button Text:</label>
                            <input
                                type="text"
                                value={editedFeature.buttonText}
                                onChange={(e) => updateFeatureField('buttonText', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        
                        {/* Demo Configuration Fields */}
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Demo Behavior:</label>
                            <textarea
                                value={editedFeature.demoConfig.mockBehavior}
                                onChange={(e) => updateFeatureField('demoConfig.mockBehavior', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 resize-none"
                                rows={2}
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Virtual Phone Effect:</label>
                            <textarea
                                value={editedFeature.demoConfig.virtualPhoneEffect}
                                onChange={(e) => updateFeatureField('demoConfig.virtualPhoneEffect', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 resize-none"
                                rows={2}
                            />
                        </div>
                        
                        {/* Custom Message Field */}
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">Custom Demo Message:</label>
                            <textarea
                                value={editedFeature.demoConfig.customMessage || ''}
                                onChange={(e) => updateFeatureField('demoConfig.customMessage', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 resize-none"
                                rows={2}
                                placeholder="Custom message for demo (optional)"
                            />
                        </div>
                        
                        {/* Channel-specific configuration */}
                        {feature.channel === 'voice' && (
                            <div className="bg-red-50 rounded-lg p-3">
                                <div className="text-xs font-medium text-red-600 mb-2">🎙️ Voice Settings:</div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs text-gray-600">Voice:</label>
                                        <select
                                            value={editedFeature.demoConfig.voiceSettings?.voice || 'alice'}
                                            onChange={(e) => updateFeatureField('demoConfig.voiceSettings.voice', e.target.value)}
                                            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="alice">Alice</option>
                                            <option value="man">Man</option>
                                            <option value="woman">Woman</option>
                                            <option value="Polly.Joanna">Polly Joanna</option>
                                            <option value="Polly.Matthew">Polly Matthew</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Language:</label>
                                        <select
                                            value={editedFeature.demoConfig.voiceSettings?.language || 'en-US'}
                                            onChange={(e) => updateFeatureField('demoConfig.voiceSettings.language', e.target.value)}
                                            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="en-US">English (US)</option>
                                            <option value="en-GB">English (UK)</option>
                                            <option value="es-ES">Spanish</option>
                                            <option value="fr-FR">French</option>
                                            <option value="de-DE">German</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* WhatsApp/RCS Interactive Elements */}
                        {(feature.channel === 'whatsapp' || feature.channel === 'rcs') && (
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-xs font-medium text-green-600 mb-2">🔘 Interactive Elements:</div>
                                <div>
                                    <label className="text-xs text-gray-600">Button 1 Title:</label>
                                    <input
                                        type="text"
                                        value={editedFeature.demoConfig.interactiveElements?.buttons?.[0]?.title || ''}
                                        onChange={(e) => updateFeatureField('demoConfig.interactiveElements.buttons.0.title', e.target.value)}
                                        className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., Call Support"
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Media Configuration for SMS/WhatsApp */}
                        {(feature.channel === 'sms' || feature.channel === 'whatsapp') && feature.featureType?.includes('media') && (
                            <div className="bg-purple-50 rounded-lg p-3">
                                <div className="text-xs font-medium text-purple-600 mb-2">📸 Media Settings:</div>
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-xs text-gray-600">Media URL:</label>
                                        <input
                                            type="url"
                                            value={editedFeature.demoConfig.mediaUrl || ''}
                                            onChange={(e) => updateFeatureField('demoConfig.mediaUrl', e.target.value)}
                                            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600">Media Type:</label>
                                        <select
                                            value={editedFeature.demoConfig.mediaType || 'image'}
                                            onChange={(e) => updateFeatureField('demoConfig.mediaType', e.target.value)}
                                            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                            <option value="audio">Audio</option>
                                            <option value="document">Document</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="text-sm text-gray-700 mb-4">
                            <strong>Feature:</strong> {feature.technicalDetails.twilioFeature}
                        </div>
                        
                        {/* Demo Behavior Preview */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="text-xs font-medium text-gray-600 mb-1">Demo Behavior:</div>
                            <div className="text-xs text-gray-700">{feature.demoConfig.mockBehavior}</div>
                        </div>

                        {/* Virtual Phone Effect */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <div className="text-xs font-medium text-blue-600 mb-1">📱 Phone Effect:</div>
                            <div className="text-xs text-blue-700">{feature.demoConfig.virtualPhoneEffect}</div>
                        </div>
                    </>
                )}

                {/* Technical Details Toggle */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-gray-500 hover:text-gray-700 mb-2 flex items-center"
                >
                    {showDetails ? '▼' : '▶'} Technical Details
                </button>

                {showDetails && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs space-y-2">
                        {feature.technicalDetails.apiEndpoint && (
                            <div>
                                <strong>API:</strong> {feature.technicalDetails.apiEndpoint}
                            </div>
                        )}
                        {feature.technicalDetails.requiredParams && (
                            <div>
                                <strong>Params:</strong> {feature.technicalDetails.requiredParams.join(', ')}
                            </div>
                        )}
                        {feature.demoConfig.timeDelay && (
                            <div>
                                <strong>Demo Delay:</strong> {feature.demoConfig.timeDelay}ms
                            </div>
                        )}
                        <div>
                            <strong>Persistent Effect:</strong> {feature.demoConfig.persistEffect ? 'Yes' : 'No'}
                        </div>
                        {feature.technicalDetails.documentation && (
                            <div>
                                <strong>Docs:</strong>{' '}
                                <a 
                                    href={feature.technicalDetails.documentation}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    View Documentation
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="p-4 border-t border-gray-100">
                {isEditing ? (
                    <div className="space-y-2">
                        <button
                            onClick={handleSave}
                            className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 text-white bg-green-500 hover:bg-green-600"
                        >
                            💾 Save Changes
                        </button>
                        <button
                            onClick={handleCancel}
                            className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 text-gray-600 bg-gray-100 hover:bg-gray-200"
                        >
                            ❌ Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => onDemo(feature)}
                        disabled={isLoading || !feature.enabled}
                        className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                        style={{ 
                            backgroundColor: feature.enabled ? getChannelColor(feature.channel) : '#9CA3AF'
                        }}
                    >
                        {isLoading ? '⚡ Running Demo...' : feature.buttonText}
                    </button>
                )}
            </div>
        </div>
    );
}