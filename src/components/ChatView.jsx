// src/components/ChatView.jsx (Updated with Colors & Send/Receive Logic)
import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Menu } from 'lucide-react';
import ChatMessage from './ChatMessage'; // Adjust path if needed

// Static Mock Data (used for initial load, then state takes over)
const initialMockMessages = { /* ... keep your existing initialMockMessages structure ... */
    1: [
        { id: 'm1', text: "Hey there! How's the yoga routine going?", timestamp: '11:40 PM', isSender: true },
        { id: 'm2', text: "It's great! Feeling really energized.", timestamp: '11:42 PM', isSender: false },
        { id: 'm3', text: "Just finished a session.", timestamp: '11:43 PM', isSender: false },
        { id: 'm4', text: "I'm all warmed up, do you like what you see?", timestamp: '11:45 PM', isSender: false },
        { id: 'locked1', type: 'locked_media', text: "Click to unlock", isSender: false },
        { id: 'm5', text: "I'm all warmed up, do you like what you see?", timestamp: '11:45 PM', isSender: false, isRepeat: true },
    ],
    // ... other conversations
};

// Mock Conversation Details (can remain the same)
const getConversationDetails = (id) => { /* ... keep getConversationDetails function ... */
    const MOCK_CONVOS = [ { id: 1, name: 'Rebecca Green', avatarUrl: '/profile/avatar.jpg', onlineStatus: 'online' }, { id: 2, name: 'John Doe', avatarUrl: null, onlineStatus: 'offline' }, { id: 3, name: 'Alice Smith', avatarUrl: '/placeholder-avatar-2.jpg', onlineStatus: 'online' }, ]; return MOCK_CONVOS.find(c => c.id === id) || { id: 0, name: 'Unknown User', avatarUrl: null, onlineStatus: 'offline' };
};

const ChatView = ({ conversationId, onBack, onShowProfile }) => {
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]); // State for messages
    const messagesEndRef = useRef(null);

    const conversationDetails = getConversationDetails(conversationId);
    const defaultResponse = "Thanks for your message! I'll get back to you soon."; // Default creator response

    // --- Effect to load initial messages and reset on ID change ---
    useEffect(() => {
        // Load initial messages from mock data when conversationId changes
        setMessages(initialMockMessages[conversationId] || []);
        // Clear input when changing chats
        setMessageText('');
    }, [conversationId]);

    // --- Effect to scroll to bottom when messages change ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Handle Sending Message ---
    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedText = messageText.trim();
        if (trimmedText === '') return;

        // 1. Create user message object
        const userMessage = {
            id: `user-${Date.now()}`, // Simple unique ID
            text: trimmedText,
            isSender: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Simple timestamp
        };

        // 2. Add user message to state
        setMessages(prevMessages => [...prevMessages, userMessage]);

        // 3. Clear input
        setMessageText('');

        // 4. Simulate creator response after a delay
        setTimeout(() => {
            const creatorResponse = {
                id: `creator-${Date.now()}`,
                text: defaultResponse, // Use the default response
                isSender: false,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prevMessages => [...prevMessages, creatorResponse]);
        }, 1500); // 1.5 second delay
    };

    // --- Render message content (handles locked/repeated messages) ---
    const renderMessageContent = (message) => {
        // Skip rendering the repeated text message shown below locked media
        if (message.isRepeat) return null;

        // Check if the *next* message is a repeat (to render text below locked media)
        const currentIndex = messages.findIndex(m => m.id === message.id);
        const nextMessage = messages[currentIndex + 1];
        const textBelowLocked = (message.type === 'locked_media' && nextMessage?.isRepeat) ? nextMessage.text : null;

        return (
            <div key={message.id}>
                <ChatMessage message={message} />
                {/* Render text below locked media if applicable */}
                {textBelowLocked && (
                    <div className="flex justify-start -mt-2 mb-3"> {/* Adjust alignment/margin */}
                        <p className="max-w-xs lg:max-w-md px-4 py-2 text-sm text-[#ffffcc]/80"> {/* Dimmer Cream text */}
                            {textBelowLocked}
                        </p>
                    </div>
                )}
            </div>
        );
    };


    return (
        // Main container: Dark Gray BG
        <div className="flex h-full flex-col bg-[#1f1f1f]">
            {/* Chat Header: Dark Gray BG, Burgundy bottom border */}
            <div className="flex items-center justify-between border-b border-[#990033]/50 p-3 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    {/* Back Button (Mobile Only) */}
                    {onBack && (
                        <button onClick={onBack} className="text-[#ffffcc] hover:text-[#ffcc00] lg:hidden"> {/* Cream icon, Gold hover */}
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    {/* Avatar */}
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={conversationDetails.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversationDetails.name)}&background=ffcc00&color=1f1f1f`} // Adjusted fallback
                        alt={`${conversationDetails.name}'s avatar`}
                        onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(conversationDetails.name)}&background=ffcc00&color=1f1f1f`}}
                    />
                    {/* Name: Cream color */}
                    <div>
                        <p className="text-base font-semibold text-[#ffffcc]">{conversationDetails.name}</p>
                    </div>
                </div>
                {/* Header Right: Profile toggle */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onShowProfile}
                        className="text-[#ffffcc] hover:text-[#ffcc00]" // Cream icon, Gold hover
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Message Area: Dark Gray BG, themed scrollbar */}
            <div className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#990033] scrollbar-track-[#1f1f1f]">
                {/* Render messages FROM STATE */}
                {messages.map(msg => renderMessageContent(msg))}
                <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
            </div>

            {/* Message Input Area: Dark Gray BG, Burgundy top border */}
            <div className="border-t border-[#990033]/50 p-4 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    {/* Input Field: Darker Gray BG, Cream text, Gold focus */}
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-1 rounded-lg bg-[#2a2a2a] px-4 py-2 text-sm text-[#ffffcc] placeholder-[#ffffcc]/60 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" // Adjusted BG/Placeholder/Focus
                    />
                    {/* Optional Ask button: Dark Gold border, Cream text, Gold 'V' */}
                    {/*<button type="button" className="text-[#ffffcc]/80 hover:text-[#ffffcc] p-2 rounded-lg border border-[#cca300]/50 hover:bg-[#2a2a2a] text-xs transition-colors">*/}
                    {/*    Ask <span className="font-semibold text-[#ffcc00]">V</span>*/}
                    {/*</button>*/}
                    {/* Send Button: Burgundy BG, Cream icon */}
                    <button
                        type="submit"
                        className="rounded-full bg-[#990033] p-2 text-[#ffffcc] transition-colors hover:bg-[#660022] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] disabled:opacity-50 disabled:cursor-not-allowed" // Added focus/disabled styles
                        disabled={messageText.trim() === ''}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatView;
