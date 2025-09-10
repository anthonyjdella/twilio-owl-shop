"use client";

import { useState, useEffect } from "react";
import { MessageTemplate, processMessageTemplate } from "@/config/demo-config";

interface DynamicMessageCardProps {
  template: MessageTemplate;
  onSend: (template: MessageTemplate) => void;
  onUpdate?: (template: MessageTemplate) => void;
  isLoading: boolean;
  disabled: boolean;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  uiText?: {
    buttons: {
      editMessage: string;
      cancelEdit: string;
      saveChanges: string;
      addVariable: string;
      cancel: string;
      add: string;
    };
    forms: {
      messageContentLabel: string;
      messagePreviewLabel: string;
      variablesLabel: string;
      variableNamePlaceholder: string;
      variableValuePlaceholder: string;
      noVariablesText: string;
    };
  };
}

export default function DynamicMessageCard({ 
  template, 
  onSend, 
  onUpdate,
  isLoading, 
  disabled,
  brandColors,
  uiText
}: DynamicMessageCardProps) {
  // Default fallback values for UI text
  const defaultUIText = {
    buttons: {
      editMessage: "Edit Message",
      cancelEdit: "Cancel Edit",
      saveChanges: "Save Changes",
      addVariable: "+ Add",
      cancel: "Cancel",
      add: "Add"
    },
    forms: {
      messageContentLabel: "Content:",
      messagePreviewLabel: "Preview:",
      variablesLabel: "Variables:",
      variableNamePlaceholder: "Name",
      variableValuePlaceholder: "Value",
      noVariablesText: "No variables. Click \"Add\" to create one."
    }
  };
  
  const ui = uiText || defaultUIText;
  const [processedMessage, setProcessedMessage] = useState(template.messageContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate>(template);
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [newVariableKey, setNewVariableKey] = useState("");
  const [newVariableValue, setNewVariableValue] = useState("");
  
  useEffect(() => {
    setProcessedMessage(processMessageTemplate(template));
    setEditingTemplate(template);
  }, [template]);

  const handleSaveEdit = () => {
    if (onUpdate) {
      onUpdate(editingTemplate);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingTemplate(template);
    setIsEditing(false);
  };

  const updateVariable = (key: string, value: string) => {
    setEditingTemplate(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        [key]: value
      }
    }));
  };

  const startAddingVariable = () => {
    setIsAddingVariable(true);
    setNewVariableKey("");
    setNewVariableValue("");
  };

  const cancelAddingVariable = () => {
    setIsAddingVariable(false);
    setNewVariableKey("");
    setNewVariableValue("");
  };

  const confirmAddVariable = () => {
    if (newVariableKey.trim() && newVariableValue.trim()) {
      setEditingTemplate(prev => ({
        ...prev,
        variables: {
          ...prev.variables,
          [newVariableKey.trim()]: newVariableValue.trim()
        }
      }));
      setIsAddingVariable(false);
      setNewVariableKey("");
      setNewVariableValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newVariableKey.trim() && newVariableValue.trim()) {
      confirmAddVariable();
    } else if (e.key === 'Escape') {
      cancelAddingVariable();
    }
  };

  const removeVariable = (key: string) => {
    setEditingTemplate(prev => {
      const newVars = { ...prev.variables };
      delete newVars[key];
      return {
        ...prev,
        variables: newVars
      };
    });
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'marketing': return brandColors.primary;
      case 'transactional': return brandColors.accent;
      case 'notification': return '#00C758';
      case 'authentication': return '#DC2626';
      default: return brandColors.primary;
    }
  };

  const categoryColor = getCategoryColor(template.category);

  return (
    <div className="bg-white rounded-lg shadow-lg p-3 border-l-4 flex flex-col overflow-hidden w-full" style={{ borderLeftColor: categoryColor }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ backgroundColor: categoryColor, color: 'white' }}
          >
            {template.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm break-words" style={{ color: brandColors.secondary }}>
              {template.title}
            </h3>
            <p className="text-xs break-words leading-tight" style={{ color: brandColors.text }}>
              {template.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <span 
            className="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
            style={{ 
              backgroundColor: categoryColor + '20', 
              color: categoryColor 
            }}
          >
            {template.category}
          </span>
          {onUpdate && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 text-sm rounded-full flex-shrink-0 transition-all duration-200 ${
                isEditing 
                  ? 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-300' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300 hover:shadow-md'
              }`}
              title={isEditing ? ui.buttons.cancelEdit : ui.buttons.editMessage}
            >
              {isEditing ? "✕" : "✏️"}
            </button>
          )}
        </div>
      </div>

      {/* Message Preview/Edit */}
      <div className="mb-3 flex-shrink-0">
        <label className="block text-xs font-medium mb-1" style={{ color: brandColors.secondary }}>
          Message {isEditing ? ui.forms.messageContentLabel : ui.forms.messagePreviewLabel}
        </label>
        {isEditing ? (
          <textarea
            value={editingTemplate.messageContent}
            onChange={(e) => setEditingTemplate(prev => ({ ...prev, messageContent: e.target.value }))}
            className="w-full p-2 rounded-lg border text-xs resize-none"
            style={{ 
              borderColor: brandColors.text + '30',
              height: '80px'
            }}
            placeholder="Enter message content with variables like {{brandName}}"
          />
        ) : (
          <div 
            className="p-2 rounded-lg border text-xs break-words overflow-hidden"
            style={{ 
              backgroundColor: brandColors.background + '40',
              borderColor: brandColors.text + '30',
              height: '80px'
            }}
          >
            <div 
              className="overflow-hidden h-full"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.3em'
              }}
            >
              {processedMessage}
            </div>
          </div>
        )}
      </div>

      {/* Variables Display/Edit */}
      {((template.variables && Object.keys(template.variables).length > 0) || isEditing) && (
        <div className="mb-3 flex-1 min-h-32 overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium" style={{ color: brandColors.secondary }}>
              {ui.forms.variablesLabel}
            </label>
            {isEditing && !isAddingVariable && (
              <button
                onClick={startAddingVariable}
                className="text-xs px-2 py-1 rounded hover:bg-gray-100 flex-shrink-0"
                style={{ color: brandColors.primary }}
                title="Add Variable"
              >
                {ui.buttons.addVariable}
              </button>
            )}
          </div>
          <div className="space-y-1">
            {Object.entries(editingTemplate.variables || {}).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-1 min-h-0">
                {isEditing ? (
                  <>
                    <span className="text-xs font-mono flex-shrink-0 truncate w-16" style={{ color: brandColors.text }}>
                      {key}:
                    </span>
                    <input
                      type="text"
                      value={String(value)}
                      onChange={(e) => updateVariable(key, e.target.value)}
                      className="flex-1 text-xs px-1 py-1 border rounded min-w-0"
                      style={{ borderColor: brandColors.text + '30' }}
                    />
                    <button
                      onClick={() => removeVariable(key)}
                      className="text-xs text-red-500 hover:text-red-700 flex-shrink-0 p-1"
                      title="Remove Variable"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="text-xs truncate w-full">
                    <span className="font-mono" style={{ color: brandColors.text }}>
                      {key}: <span className="font-semibold">{String(value)}</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Variable Form */}
            {isAddingVariable && (
              <div className="p-2 border-2 border-dashed rounded-lg bg-gray-50 w-full" style={{ borderColor: brandColors.primary + '40' }}>
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      value={newVariableKey}
                      onChange={(e) => setNewVariableKey(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={ui.forms.variableNamePlaceholder}
                      className="flex-1 text-xs px-2 py-1 border rounded min-w-0"
                      style={{ borderColor: brandColors.text + '30' }}
                      autoFocus
                    />
                    <input
                      type="text"
                      value={newVariableValue}
                      onChange={(e) => setNewVariableValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={ui.forms.variableValuePlaceholder}
                      className="flex-1 text-xs px-2 py-1 border rounded min-w-0"
                      style={{ borderColor: brandColors.text + '30' }}
                    />
                  </div>
                  <div className="flex justify-end space-x-1">
                    <button
                      onClick={cancelAddingVariable}
                      className="text-xs px-2 py-1 rounded border hover:bg-gray-100"
                      style={{ 
                        borderColor: brandColors.text + '30',
                        color: brandColors.text 
                      }}
                    >
                      {ui.buttons.cancel}
                    </button>
                    <button
                      onClick={confirmAddVariable}
                      disabled={!newVariableKey.trim() || !newVariableValue.trim()}
                      className="text-xs px-2 py-1 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: brandColors.primary }}
                    >
                      {ui.buttons.add}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isEditing && !isAddingVariable && (!editingTemplate.variables || Object.keys(editingTemplate.variables).length === 0) && (
              <p className="text-xs text-gray-500 py-2">{ui.forms.noVariablesText}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex-shrink-0 mt-3">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md"
              style={{ 
                backgroundColor: brandColors.primary,
                color: 'white'
              }}
            >
              {ui.buttons.saveChanges}
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 border hover:shadow-md"
              style={{ 
                borderColor: brandColors.text + '30',
                color: brandColors.text,
                backgroundColor: 'white'
              }}
            >
              {ui.buttons.cancel}
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSend(template)}
            disabled={disabled || isLoading}
            className="w-full py-2 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            style={{ 
              backgroundColor: categoryColor,
              color: 'white'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </div>
            ) : (
              template.buttonText
            )}
          </button>
        )}
      </div>
    </div>
  );
}