"use client";

import { useState } from "react";
import { DemoConfig, MessageTheme, PhoneAppConfig } from "@/config/demo-config";

interface ConfigPanelProps {
  config: DemoConfig;
  onConfigChange: (newConfig: DemoConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ConfigPanel({ config, onConfigChange, isOpen, onToggle }: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'phone' | 'themes' | 'messages'>('general');

  const updateConfig = (updates: Partial<DemoConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const updateVirtualPhone = (updates: Partial<DemoConfig['virtualPhone']>) => {
    updateConfig({
      virtualPhone: { ...config.virtualPhone, ...updates }
    });
  };

  const updateBrandColors = (updates: Partial<DemoConfig['brandColors']>) => {
    updateConfig({
      brandColors: { ...config.brandColors, ...updates }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Demo Configuration</h2>
        <button
          onClick={onToggle}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {[
            { id: 'general', label: 'General', icon: '🎨' },
            { id: 'phone', label: 'Phone', icon: '📱' },
            { id: 'themes', label: 'Themes', icon: '💬' },
            { id: 'messages', label: 'Messages', icon: '📝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo Title
              </label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => updateConfig({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <textarea
                value={config.subtitle}
                onChange={(e) => updateConfig({ subtitle: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={config.brandName}
                onChange={(e) => updateConfig({ brandName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Brand Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(config.brandColors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key}
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => updateBrandColors({ [key]: e.target.value } as any)}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateBrandColors({ [key]: e.target.value } as any)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'phone' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Name
              </label>
              <input
                type="text"
                value={config.virtualPhone.deviceName}
                onChange={(e) => updateVirtualPhone({ deviceName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier Name
              </label>
              <input
                type="text"
                value={config.virtualPhone.carrierName}
                onChange={(e) => updateVirtualPhone({ carrierName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name
              </label>
              <input
                type="text"
                value={config.virtualPhone.contactName}
                onChange={(e) => updateVirtualPhone({ contactName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={config.virtualPhone.phoneNumber}
                onChange={(e) => updateVirtualPhone({ phoneNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signal Strength (1-4)
                </label>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={config.virtualPhone.signalStrength}
                  onChange={(e) => updateVirtualPhone({ signalStrength: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{config.virtualPhone.signalStrength}/4</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Battery Level (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.virtualPhone.batteryLevel}
                  onChange={(e) => updateVirtualPhone({ batteryLevel: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{config.virtualPhone.batteryLevel}%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default App
              </label>
              <select
                value={config.virtualPhone.defaultApp}
                onChange={(e) => updateVirtualPhone({ defaultApp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {config.virtualPhone.apps.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.icon} {app.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Theme
              </label>
              <select
                value={config.virtualPhone.messageTheme}
                onChange={(e) => updateVirtualPhone({ messageTheme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {config.messageThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name} ({theme.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === 'themes' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Configure how messages appear in the virtual phone
            </p>
            {config.messageThemes.map((theme, index) => (
              <div key={theme.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  {theme.name} ({theme.type})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Bubble Color
                    </label>
                    <input
                      type="color"
                      value={theme.bubbleColor}
                      onChange={(e) => {
                        const newThemes = [...config.messageThemes];
                        newThemes[index] = { ...theme, bubbleColor: e.target.value };
                        updateConfig({ messageThemes: newThemes });
                      }}
                      className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={theme.textColor}
                      onChange={(e) => {
                        const newThemes = [...config.messageThemes];
                        newThemes[index] = { ...theme, textColor: e.target.value };
                        updateConfig({ messageThemes: newThemes });
                      }}
                      className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Message templates will be editable in the next update
            </p>
            {config.messageTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{template.emoji}</span>
                  <span className="font-medium text-sm">{template.title}</span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate">
                  {template.messageContent}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => {
            // Reset to defaults
            window.location.reload();
          }}
          className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}