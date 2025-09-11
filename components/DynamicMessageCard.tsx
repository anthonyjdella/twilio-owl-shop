"use client";

import { useState, useEffect } from "react";
import { MessageTemplate, processMessageTemplate } from "@/config/demo-config";

interface DynamicMessageCardProps {
  template: MessageTemplate;
  onSend: (template: MessageTemplate) => void;
  onUpdate?: (template: MessageTemplate) => void;
  isLoading: boolean;
  disabled: boolean;
  selectedChannel?: 'sms' | 'rcs' | 'whatsapp';
  selectedContentType?: 'text' | 'media' | 'richCard' | 'carousel' | 'listMessage';
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  cardLayout?: {
    showEmoji: boolean;
    showCategory: boolean;
    showChannel: boolean;
    showDescription: boolean;
    headerLayout: 'horizontal' | 'vertical';
    buttonStyle: 'filled' | 'outlined' | 'text';
    borderStyle: 'left' | 'top' | 'full' | 'none';
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
  selectedChannel = 'sms',
  selectedContentType = 'text',
  brandColors,
  cardLayout,
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
  
  // Default layout configuration
  const defaultLayout = {
    showEmoji: true,
    showCategory: true,
    showChannel: true,
    showDescription: true,
    headerLayout: 'horizontal' as const,
    buttonStyle: 'filled' as const,
    borderStyle: 'left' as const
  };
  
  const ui = uiText || defaultUIText;
  const layout = cardLayout || defaultLayout;
  const [processedMessage, setProcessedMessage] = useState(template.messageContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate>(template);
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [newVariableKey, setNewVariableKey] = useState("");
  const [newVariableValue, setNewVariableValue] = useState("");
  
  // Content type customization state
  const [contentTypeConfig, setContentTypeConfig] = useState({
    mediaUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    mediaType: "image" as "image" | "video" | "audio" | "document",
    caption: "Check out our latest products!",
    cardTitle: "Special Offer!",
    cardSubtitle: "Limited time deal - Don't miss out!",
    cardImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    cardBody: "Get exclusive access to premium items with amazing discounts.",
    carouselBody: "Browse our featured collection of developer merchandise.",
    listHeader: "Choose Your Product Category",
    listFooter: "Select an option to continue",
    buttonText: "View Products",
    cardCount: 3,
    interactiveType: "buttons" as "buttons" | "quickReplies"
  });
  
  // State for dynamic buttons and quick replies
  const [cardButtons, setCardButtons] = useState([
    { title: "Shop Now", type: "url" as "url" | "phone" | "reply", payload: "https://owlshop.com" },
    { title: "Call Us", type: "phone", payload: "+1-833-365-9260" }
  ]);
  const [cardQuickReplies, setCardQuickReplies] = useState([
    { title: "Yes, I'm interested", payload: "interested" },
    { title: "Not now", payload: "not_now" },
    { title: "Tell me more", payload: "more_info" }
  ]);
  
  // State for carousel items
  const [carouselItems, setCarouselItems] = useState([
    { id: "1", title: "Owl Hoodie", subtitle: "Premium comfort hoodie", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200", buttons: [{ title: "Buy Now", type: "url" as "url" | "phone" | "reply", payload: "https://owlshop.com/hoodie" }] },
    { id: "2", title: "Dev T-Shirt", subtitle: "Perfect for coding sessions", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200", buttons: [{ title: "Buy Now", type: "url", payload: "https://owlshop.com/tshirt" }] }
  ]);
  
  // State for list message items
  const [listSections, setListSections] = useState([
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
  ]);
  
  useEffect(() => {
    setProcessedMessage(processMessageTemplate(template));
    setEditingTemplate(template);
  }, [template]);

  // Update processed message when editing template changes
  useEffect(() => {
    if (isEditing) {
      setProcessedMessage(processMessageTemplate(editingTemplate));
    } else {
      setProcessedMessage(processMessageTemplate(template));
    }
  }, [editingTemplate, template, isEditing]);

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
  
  // Button management functions
  const addButton = () => {
    if (cardButtons.length < 3) {
      setCardButtons(prev => [...prev, { title: "", type: "url", payload: "" }]);
    }
  };
  
  const removeButton = (index: number) => {
    setCardButtons(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateButton = (index: number, field: string, value: string) => {
    setCardButtons(prev => prev.map((button, i) => 
      i === index ? { ...button, [field]: value } : button
    ));
  };
  
  // Quick reply management functions
  const addQuickReply = () => {
    if (cardQuickReplies.length < 11) {
      setCardQuickReplies(prev => [...prev, { title: "", payload: "" }]);
    }
  };
  
  const removeQuickReply = (index: number) => {
    setCardQuickReplies(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateQuickReply = (index: number, field: string, value: string) => {
    setCardQuickReplies(prev => prev.map((reply, i) => 
      i === index ? { ...reply, [field]: value } : reply
    ));
  };
  
  // Carousel item management functions
  const addCarouselItem = () => {
    if (carouselItems.length < 10) {
      const newId = (carouselItems.length + 1).toString();
      setCarouselItems(prev => [...prev, { 
        id: newId, 
        title: "", 
        subtitle: "", 
        image: "", 
        buttons: [{ title: "", type: "url", payload: "" }] 
      }]);
    }
  };
  
  const removeCarouselItem = (index: number) => {
    if (carouselItems.length > 1) {
      setCarouselItems(prev => prev.filter((_, i) => i !== index));
    }
  };
  
  const updateCarouselItem = (index: number, field: string, value: string) => {
    setCarouselItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };
  
  const addCarouselItemButton = (itemIndex: number) => {
    setCarouselItems(prev => prev.map((item, i) => 
      i === itemIndex ? { 
        ...item, 
        buttons: [...item.buttons, { title: "", type: "url", payload: "" }] 
      } : item
    ));
  };
  
  const removeCarouselItemButton = (itemIndex: number, buttonIndex: number) => {
    setCarouselItems(prev => prev.map((item, i) => 
      i === itemIndex ? { 
        ...item, 
        buttons: item.buttons.filter((_, bi) => bi !== buttonIndex) 
      } : item
    ));
  };
  
  const updateCarouselItemButton = (itemIndex: number, buttonIndex: number, field: string, value: string) => {
    setCarouselItems(prev => prev.map((item, i) => 
      i === itemIndex ? { 
        ...item, 
        buttons: item.buttons.map((button, bi) => 
          bi === buttonIndex ? { ...button, [field]: value } : button
        )
      } : item
    ));
  };
  
  // List section management functions
  const addListSection = () => {
    setListSections(prev => [...prev, {
      title: "",
      rows: [{ id: `row_${Date.now()}`, title: "", description: "" }]
    }]);
  };
  
  const removeListSection = (sectionIndex: number) => {
    if (listSections.length > 1) {
      setListSections(prev => prev.filter((_, i) => i !== sectionIndex));
    }
  };
  
  const updateListSection = (sectionIndex: number, field: string, value: string) => {
    setListSections(prev => prev.map((section, i) => 
      i === sectionIndex ? { ...section, [field]: value } : section
    ));
  };
  
  const addListRow = (sectionIndex: number) => {
    setListSections(prev => prev.map((section, i) => 
      i === sectionIndex ? {
        ...section,
        rows: [...section.rows, { id: `row_${Date.now()}`, title: "", description: "" }]
      } : section
    ));
  };
  
  const removeListRow = (sectionIndex: number, rowIndex: number) => {
    setListSections(prev => prev.map((section, i) => 
      i === sectionIndex ? {
        ...section,
        rows: section.rows.filter((_, ri) => ri !== rowIndex)
      } : section
    ));
  };
  
  const updateListRow = (sectionIndex: number, rowIndex: number, field: string, value: string) => {
    setListSections(prev => prev.map((section, i) => 
      i === sectionIndex ? {
        ...section,
        rows: section.rows.map((row, ri) => 
          ri === rowIndex ? { ...row, [field]: value } : row
        )
      } : section
    ));
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

  // Get border styles based on configuration
  const getBorderClasses = () => {
    switch (layout.borderStyle) {
      case 'left': return 'border-l-4';
      case 'top': return 'border-t-4';
      case 'full': return 'border-4';
      case 'none': return 'border';
      default: return 'border-l-4';
    }
  };

  const getBorderStyles = () => {
    switch (layout.borderStyle) {
      case 'left': return { borderLeftColor: categoryColor };
      case 'top': return { borderTopColor: categoryColor };
      case 'full': return { borderColor: categoryColor };
      case 'none': return { borderColor: '#e5e7eb' };
      default: return { borderLeftColor: categoryColor };
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg p-3 ${getBorderClasses()} flex flex-col overflow-hidden w-full`} 
      style={getBorderStyles()}
    >
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        {/* Top row: Title, Description and Edit Button */}
        <div className={`${layout.headerLayout === 'vertical' ? 'flex flex-col space-y-3' : 'flex items-start justify-between'} mb-3`}>
          <div className={`${layout.headerLayout === 'vertical' ? 'flex flex-col items-center text-center space-y-2' : 'flex items-center space-x-3 min-w-0 flex-1'}`}>
            {layout.showEmoji && (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: categoryColor, color: 'white' }}
              >
                {template.emoji}
              </div>
            )}
            <div className={`${layout.headerLayout === 'vertical' ? 'text-center' : 'min-w-0 flex-1'}`}>
              <h3 className="font-semibold text-base mb-1 break-words" style={{ color: brandColors.secondary }}>
                {template.title}
              </h3>
              {layout.showDescription && (
                <p className="text-sm break-words leading-relaxed" style={{ color: brandColors.text }}>
                  {template.description}
                </p>
              )}
            </div>
          </div>
          {onUpdate && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 text-sm rounded-full flex-shrink-0 transition-all duration-200 ml-2 ${
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
        
        {/* Bottom row: Category and Channel tags */}
        {(layout.showCategory || layout.showChannel) && (
          <div className={`flex items-center space-x-2 ${layout.headerLayout === 'vertical' ? 'justify-center' : 'ml-13'}`}>
            {layout.showCategory && (
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                style={{ 
                  backgroundColor: categoryColor + '20', 
                  color: categoryColor 
                }}
              >
                {template.category}
              </span>
            )}
            {layout.showChannel && (
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap border"
                style={{ 
                  backgroundColor: 'white', 
                  color: brandColors.primary,
                  borderColor: brandColors.primary + '40'
                }}
              >
                {selectedChannel === 'sms' && '📱 SMS'}
                {selectedChannel === 'rcs' && '💬 RCS'}
                {selectedChannel === 'whatsapp' && '🟢 WhatsApp'}
              </span>
            )}
          </div>
        )}
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

      {/* Content Type Preview - Show when not editing for RCS/WhatsApp */}
      {!isEditing && (selectedChannel === 'rcs' || selectedChannel === 'whatsapp') && selectedContentType !== 'text' && (
        <div className="mb-3 flex-shrink-0">
          <h4 className="text-xs font-medium mb-2" style={{ color: brandColors.secondary }}>
            {selectedContentType.charAt(0).toUpperCase() + selectedContentType.slice(1)} Preview
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 border">
            {selectedContentType === 'media' && (
              <div className="space-y-1">
                <p className="text-xs text-gray-700"><span className="font-medium">Image:</span> {contentTypeConfig.mediaUrl}</p>
                <p className="text-xs text-gray-700"><span className="font-medium">Caption:</span> {contentTypeConfig.caption}</p>
                <p className="text-xs text-gray-700"><span className="font-medium">Type:</span> {contentTypeConfig.mediaType}</p>
              </div>
            )}
            {selectedContentType === 'richCard' && (
              <div className="space-y-1">
                <p className="text-xs text-gray-700"><span className="font-medium">Title:</span> {contentTypeConfig.cardTitle}</p>
                <p className="text-xs text-gray-700"><span className="font-medium">Subtitle:</span> {contentTypeConfig.cardSubtitle}</p>
                {contentTypeConfig.cardBody && <p className="text-xs text-gray-700"><span className="font-medium">Body:</span> {contentTypeConfig.cardBody}</p>}
                <p className="text-xs text-gray-700"><span className="font-medium">Interactive:</span> {contentTypeConfig.interactiveType === 'buttons' ? `${cardButtons.length} Buttons` : `${cardQuickReplies.length} Quick Replies`}</p>
              </div>
            )}
            {selectedContentType === 'carousel' && (
              <div className="space-y-1">
                {contentTypeConfig.carouselBody && <p className="text-xs text-gray-700"><span className="font-medium">Body:</span> {contentTypeConfig.carouselBody}</p>}
                <p className="text-xs text-gray-700"><span className="font-medium">Cards:</span> {carouselItems.length} items</p>
                <p className="text-xs text-gray-600">First card: {carouselItems[0]?.title || 'Untitled'}</p>
              </div>
            )}
            {selectedContentType === 'listMessage' && (
              <div className="space-y-1">
                <p className="text-xs text-gray-700"><span className="font-medium">Header:</span> {contentTypeConfig.listHeader}</p>
                <p className="text-xs text-gray-700"><span className="font-medium">Footer:</span> {contentTypeConfig.listFooter}</p>
                <p className="text-xs text-gray-700"><span className="font-medium">Button:</span> {contentTypeConfig.buttonText}</p>
                <p className="text-xs text-gray-700"><span className="font-medium">Sections:</span> {listSections.length} sections</p>
                <p className="text-xs text-gray-600">Total items: {listSections.reduce((acc, section) => acc + section.rows.length, 0)}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2 italic">Click Edit to customize these values</p>
          </div>
        </div>
      )}

      {/* Content Type Customization - Only show when editing for RCS/WhatsApp */}
      {isEditing && (selectedChannel === 'rcs' || selectedChannel === 'whatsapp') && selectedContentType !== 'text' && (
        <div className="mb-3 flex-shrink-0">
          <h4 className="text-xs font-medium mb-2" style={{ color: brandColors.secondary }}>
            {selectedContentType.charAt(0).toUpperCase() + selectedContentType.slice(1)} Settings
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            {selectedContentType === 'media' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Media URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={contentTypeConfig.mediaUrl}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Media Type</label>
                  <select
                    value={contentTypeConfig.mediaType}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, mediaType: e.target.value as "image" | "video" | "audio" | "document" }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Caption</label>
                  <input
                    type="text"
                    placeholder="Optional caption text"
                    value={contentTypeConfig.caption}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
              </>
            )}
            
            {selectedContentType === 'richCard' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Title</label>
                  <input
                    type="text"
                    placeholder="Card title"
                    value={contentTypeConfig.cardTitle}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, cardTitle: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Subtitle</label>
                  <input
                    type="text"
                    placeholder="Card subtitle"
                    value={contentTypeConfig.cardSubtitle}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, cardSubtitle: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Body</label>
                  <textarea
                    placeholder="Card body text (optional)"
                    value={contentTypeConfig.cardBody}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, cardBody: e.target.value }))}
                    rows={2}
                    className="w-full text-xs px-2 py-1 border rounded resize-none"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/card-image.jpg"
                    value={contentTypeConfig.cardImage}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, cardImage: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Interactive Elements</label>
                  <div className="space-y-2">
                    {/* Button Type Selection */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                      <select
                        value={contentTypeConfig.interactiveType}
                        onChange={(e) => setContentTypeConfig(prev => ({ ...prev, interactiveType: e.target.value as "buttons" | "quickReplies" }))}
                        className="w-full text-xs px-2 py-1 border rounded"
                        style={{ borderColor: brandColors.text + '30' }}
                      >
                        <option value="buttons">Action Buttons</option>
                        <option value="quickReplies">Quick Replies</option>
                      </select>
                    </div>
                    
                    {/* Action Buttons - Only show if buttons is selected */}
                    {contentTypeConfig.interactiveType === 'buttons' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Buttons (max 3)</label>
                        <div className="space-y-2">
                          {cardButtons.map((button, index) => (
                            <div key={index} className="flex space-x-2 items-center">
                              <input
                                type="text"
                                placeholder="Button text"
                                value={button.title}
                                onChange={(e) => updateButton(index, 'title', e.target.value)}
                                className="flex-1 text-xs px-2 py-1 border rounded"
                                style={{ borderColor: brandColors.text + '30' }}
                              />
                              <select
                                value={button.type}
                                onChange={(e) => updateButton(index, 'type', e.target.value)}
                                className="text-xs px-2 py-1 border rounded"
                                style={{ borderColor: brandColors.text + '30' }}
                              >
                                <option value="url">🔗 Open URL</option>
                                <option value="phone">📞 Call Phone</option>
                                <option value="reply">💬 Send Reply</option>
                              </select>
                              <input
                                type="text"
                                placeholder={button.type === 'url' ? 'URL' : 'Payload'}
                                value={button.payload}
                                onChange={(e) => updateButton(index, 'payload', e.target.value)}
                                className="flex-1 text-xs px-2 py-1 border rounded"
                                style={{ borderColor: brandColors.text + '30' }}
                              />
                              {cardButtons.length > 1 && (
                                <button
                                  onClick={() => removeButton(index)}
                                  className="text-xs text-red-500 hover:text-red-700 p-1"
                                  title="Remove Button"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          {cardButtons.length < 3 && (
                            <button
                              onClick={addButton}
                              className="text-xs px-2 py-1 rounded border-dashed border"
                              style={{ borderColor: brandColors.primary, color: brandColors.primary }}
                            >
                              + Add Button ({cardButtons.length}/3)
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Replies - Only show if quickReplies is selected */}
                    {contentTypeConfig.interactiveType === 'quickReplies' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quick Replies (max 11)</label>
                        <div className="space-y-2">
                          {cardQuickReplies.map((reply, index) => (
                            <div key={index} className="flex space-x-2 items-center">
                              <input
                                type="text"
                                placeholder="Quick reply text"
                                value={reply.title}
                                onChange={(e) => updateQuickReply(index, 'title', e.target.value)}
                                className="flex-1 text-xs px-2 py-1 border rounded"
                                style={{ borderColor: brandColors.text + '30' }}
                              />
                              <input
                                type="text"
                                placeholder="Payload (optional)"
                                value={reply.payload}
                                onChange={(e) => updateQuickReply(index, 'payload', e.target.value)}
                                className="flex-1 text-xs px-2 py-1 border rounded"
                                style={{ borderColor: brandColors.text + '30' }}
                              />
                              {cardQuickReplies.length > 1 && (
                                <button
                                  onClick={() => removeQuickReply(index)}
                                  className="text-xs text-red-500 hover:text-red-700 p-1"
                                  title="Remove Quick Reply"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          {cardQuickReplies.length < 11 && (
                            <button
                              onClick={addQuickReply}
                              className="text-xs px-2 py-1 rounded border-dashed border"
                              style={{ borderColor: brandColors.accent, color: brandColors.accent }}
                            >
                              + Add Quick Reply ({cardQuickReplies.length}/11)
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {selectedContentType === 'carousel' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Carousel Body</label>
                  <textarea
                    placeholder="Carousel introduction text (optional)"
                    value={contentTypeConfig.carouselBody}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, carouselBody: e.target.value }))}
                    rows={2}
                    className="w-full text-xs px-2 py-1 border rounded resize-none"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Carousel Cards (max 10)</label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {carouselItems.map((item, index) => (
                      <div key={index} className="border border-gray-300 rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-xs font-medium text-gray-800">Card {index + 1}</h5>
                          {carouselItems.length > 1 && (
                            <button
                              onClick={() => removeCarouselItem(index)}
                              className="text-xs text-red-500 hover:text-red-700"
                              title="Remove Card"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Card title"
                              value={item.title}
                              onChange={(e) => updateCarouselItem(index, 'title', e.target.value)}
                              className="w-full text-xs px-2 py-1 border rounded"
                              style={{ borderColor: brandColors.text + '30' }}
                            />
                            <input
                              type="text"
                              placeholder="Card subtitle"
                              value={item.subtitle}
                              onChange={(e) => updateCarouselItem(index, 'subtitle', e.target.value)}
                              className="w-full text-xs px-2 py-1 border rounded"
                              style={{ borderColor: brandColors.text + '30' }}
                            />
                          </div>
                          <div>
                            <input
                              type="url"
                              placeholder="Image URL"
                              value={item.image}
                              onChange={(e) => updateCarouselItem(index, 'image', e.target.value)}
                              className="w-full text-xs px-2 py-1 border rounded"
                              style={{ borderColor: brandColors.text + '30' }}
                            />
                          </div>
                          
                          {/* Card Buttons */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Buttons (max 3)</label>
                            <div className="space-y-1">
                              {item.buttons.map((button, buttonIndex) => (
                                <div key={buttonIndex} className="flex space-x-1 items-center">
                                  <input
                                    type="text"
                                    placeholder="Button text"
                                    value={button.title}
                                    onChange={(e) => updateCarouselItemButton(index, buttonIndex, 'title', e.target.value)}
                                    className="flex-1 text-xs px-1 py-1 border rounded"
                                    style={{ borderColor: brandColors.text + '30' }}
                                  />
                                  <select
                                    value={button.type}
                                    onChange={(e) => updateCarouselItemButton(index, buttonIndex, 'type', e.target.value)}
                                    className="text-xs px-1 py-1 border rounded"
                                    style={{ borderColor: brandColors.text + '30' }}
                                  >
                                    <option value="url">🔗 URL</option>
                                    <option value="phone">📞 Phone</option>
                                    <option value="reply">💬 Reply</option>
                                  </select>
                                  <input
                                    type="text"
                                    placeholder={button.type === 'url' ? 'URL' : 'Payload'}
                                    value={button.payload}
                                    onChange={(e) => updateCarouselItemButton(index, buttonIndex, 'payload', e.target.value)}
                                    className="flex-1 text-xs px-1 py-1 border rounded"
                                    style={{ borderColor: brandColors.text + '30' }}
                                  />
                                  {item.buttons.length > 1 && (
                                    <button
                                      onClick={() => removeCarouselItemButton(index, buttonIndex)}
                                      className="text-xs text-red-500 hover:text-red-700 p-1"
                                      title="Remove Button"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                              {item.buttons.length < 3 && (
                                <button
                                  onClick={() => addCarouselItemButton(index)}
                                  className="text-xs px-2 py-1 rounded border-dashed border"
                                  style={{ borderColor: brandColors.primary, color: brandColors.primary }}
                                >
                                  + Add Button ({item.buttons.length}/3)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {carouselItems.length < 10 && (
                      <button
                        onClick={addCarouselItem}
                        className="w-full text-xs px-3 py-2 rounded border-dashed border-2"
                        style={{ borderColor: brandColors.accent, color: brandColors.accent }}
                      >
                        + Add Carousel Card ({carouselItems.length}/10)
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
            
            {selectedContentType === 'listMessage' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">List Header</label>
                  <input
                    type="text"
                    placeholder="Choose an option"
                    value={contentTypeConfig.listHeader}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, listHeader: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">List Footer</label>
                  <input
                    type="text"
                    placeholder="Optional footer text"
                    value={contentTypeConfig.listFooter}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, listFooter: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="View Options"
                    value={contentTypeConfig.buttonText}
                    onChange={(e) => setContentTypeConfig(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="w-full text-xs px-2 py-1 border rounded"
                    style={{ borderColor: brandColors.text + '30' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">List Sections</label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {listSections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border border-gray-300 rounded-lg p-3 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-xs font-medium text-gray-800">Section {sectionIndex + 1}</h5>
                          {listSections.length > 1 && (
                            <button
                              onClick={() => removeListSection(sectionIndex)}
                              className="text-xs text-red-500 hover:text-red-700"
                              title="Remove Section"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Section title"
                            value={section.title}
                            onChange={(e) => updateListSection(sectionIndex, 'title', e.target.value)}
                            className="w-full text-xs px-2 py-1 border rounded font-medium"
                            style={{ borderColor: brandColors.text + '30' }}
                          />
                          
                          {/* Section Rows */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Items</label>
                            <div className="space-y-1">
                              {section.rows.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex space-x-1 items-center">
                                  <input
                                    type="text"
                                    placeholder="Item title"
                                    value={row.title}
                                    onChange={(e) => updateListRow(sectionIndex, rowIndex, 'title', e.target.value)}
                                    className="flex-1 text-xs px-1 py-1 border rounded"
                                    style={{ borderColor: brandColors.text + '30' }}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={row.description}
                                    onChange={(e) => updateListRow(sectionIndex, rowIndex, 'description', e.target.value)}
                                    className="flex-1 text-xs px-1 py-1 border rounded"
                                    style={{ borderColor: brandColors.text + '30' }}
                                  />
                                  {section.rows.length > 1 && (
                                    <button
                                      onClick={() => removeListRow(sectionIndex, rowIndex)}
                                      className="text-xs text-red-500 hover:text-red-700 p-1"
                                      title="Remove Item"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                onClick={() => addListRow(sectionIndex)}
                                className="text-xs px-2 py-1 rounded border-dashed border"
                                style={{ borderColor: brandColors.primary, color: brandColors.primary }}
                              >
                                + Add Item ({section.rows.length}/10)
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addListSection}
                      className="w-full text-xs px-3 py-2 rounded border-dashed border-2"
                      style={{ borderColor: brandColors.accent, color: brandColors.accent }}
                    >
                      + Add Section ({listSections.length}/10)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Variables Display/Edit - Show when editing any message type or when variables exist */}
      {(isEditing || (template.variables && Object.keys(template.variables).length > 0)) && (
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