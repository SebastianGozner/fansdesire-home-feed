// src/components/ChatView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage'; // Assumes ChatMessage handles reply/reaction UI
import ReplyPreviewDisplay from './ReplyPreviewDisplay';

// --- Mock Data & Details ---
// NOTE: Replace with your actual data fetching logic
// Ensure message objects include: id, text, timestamp, isSender, senderName, replyingTo (null | object), userReaction (null | string)
const initialMockMessages = {
    1: [
        { id: 'm1', text: "Hey there! How's the yoga routine going?", timestamp: '11:40 PM', isSender: true, senderName: 'You', replyingTo: null, userReaction: null },
        { id: 'm2', text: "It's great! Feeling really energized.", timestamp: '11:42 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: '❤️' },
        { id: 'm3', text: "Just finished a session.", timestamp: '11:43 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null },
        { id: 'm4', text: "I'm all warmed up, do you like what you see?", timestamp: '11:45 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null },
        { id: 'locked1', type: 'locked_media', text: "Click to unlock", isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null },
    ],
    // Define other conversations as needed
};
const getConversationDetails = (id) => {
    // NOTE: Replace with your actual data fetching logic
    const MOCK_CONVOS = [
        { id: 1, name: 'Rebecca Green', avatarUrl: '/rebecca-profile.jpg' }, // Use actual paths
        { id: 2, name: 'John Doe', avatarUrl: null },
        { id: 3, name: 'Alice Smith', avatarUrl: '/placeholder-avatar-2.jpg' },
    ];
    return MOCK_CONVOS.find(c => c.id === id) || { id: 0, name: 'Unknown User', avatarUrl: null };
};
// --- End Mock Data & Details ---


const ChatView = ({ conversationId, onBack, onShowProfile }) => {
    // --- State ---
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [replyingToId, setReplyingToId] = useState(null); // ID of message being replied to

    // --- Refs ---
    const messagesEndRef = useRef(null); // For scrolling to bottom
    const inputRef = useRef(null); // For focusing input on reply

    // --- Derived Data ---
    const conversationDetails = getConversationDetails(conversationId);
    const creatorName = conversationDetails?.name || 'Creator'; // Fallback name
    const defaultResponse = "Thanks for your message! I'll get back to you soon."; // Default auto-reply

    // --- Effects ---
    // Effect to load initial messages and reset state when conversationId changes
    useEffect(() => {
        const initialData = (initialMockMessages[conversationId] || []).map(msg => ({
            ...msg,
            // Ensure required fields exist with default values
            userReaction: msg.userReaction || null,
            replyingTo: msg.replyingTo || null,
            senderName: msg.senderName || (msg.isSender ? 'You' : creatorName)
        }));
        setMessages(initialData);
        setMessageText('');
        setReplyingToId(null); // Reset reply state on chat change
    }, [conversationId, creatorName]); // Depend on conversationId and derived creatorName

    // Effect to scroll messages into view when new messages are added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Helper Functions ---
    // Find a message in the current state by its ID
    const findMessageById = (id) => messages.find(msg => msg.id === id);

    // --- Event Handlers ---
    // Set the message ID to reply to
    const handleSetReply = (messageId) => {
        const messageToReply = findMessageById(messageId);
        // Only allow replying to messages from the creator (!isSender)
        if (messageToReply && !messageToReply.isSender) {
            setReplyingToId(messageId);
            inputRef.current?.focus(); // Focus the input field
        } else {
            console.warn("Attempted to reply to a non-creator message or invalid message ID");
        }
    };

    // Clear the reply state
    const cancelReply = () => {
        setReplyingToId(null);
    };

    // Handle sending a new message (includes reply context)
    const handleSendMessage = (e) => {
        e.preventDefault();
        const trimmedText = messageText.trim();
        if (trimmedText === '') return;

        let replyContext = null;
        // If currently replying, find original message and create context
        if (replyingToId) {
            const originalMessage = findMessageById(replyingToId);
            // Check original exists and is from creator
            if (originalMessage && !originalMessage.isSender) {
                const originalSender = originalMessage.senderName || creatorName;
                replyContext = {
                    messageId: originalMessage.id,
                    senderName: originalSender,
                    textSnippet: originalMessage.text.substring(0, 70) + (originalMessage.text.length > 70 ? '...' : '')
                };
            }
        }

        // Create the new message object for the user
        const userMessage = {
            id: `user-${Date.now()}`,
            text: trimmedText,
            isSender: true,
            senderName: 'You', // User is always 'You'
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyingTo: replyContext, // Attach reply context (or null)
            userReaction: null        // Initialize reaction field
        };

        // Update messages state
        setMessages(prev => [...prev, userMessage]);
        // Reset input and reply state
        setMessageText('');
        setReplyingToId(null);

        // Simulate creator's auto-response after a delay
        setTimeout(() => {
            const creatorResponse = {
                id: `creator-${Date.now()}`,
                text: defaultResponse,
                isSender: false,
                senderName: creatorName,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                replyingTo: null, // Auto-response is not a reply
                userReaction: null // Initialize reaction field
            };
            setMessages(prev => [...prev, creatorResponse]);
        }, 1500); // 1.5 second delay
    };

    // Handle adding or toggling a reaction on a message
    const handleAddReaction = (messageId, emoji) => {
        setMessages(currentMessages =>
            currentMessages.map(msg => {
                if (msg.id === messageId) {
                    // Can only react to creator messages
                    if (msg.isSender) {
                        console.warn("Cannot react to own messages.");
                        return msg;
                    }
                    // Toggle: if same emoji clicked again, remove reaction (null), else set new emoji
                    const newReaction = msg.userReaction === emoji ? null : emoji;
                    return { ...msg, userReaction: newReaction };
                }
                return msg; // Return unchanged message if ID doesn't match
            })
        );
    };

    // --- Prepare Data for Rendering ---
    // Get the full message object to show in the reply preview area
    const messageToPreview = replyingToId ? findMessageById(replyingToId) : null;

    // --- Render Component ---
    return (
        <div className="flex h-full flex-col bg-[#1f1f1f]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#990033]/50 p-3 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    {onBack && (
                        <button onClick={onBack} className="text-[#ffffcc] hover:text-[#ffcc00] lg:hidden">
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={conversationDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=ffcc00&color=1f1f1f`}
                        alt={`${creatorName}'s avatar`}
                        onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=ffcc00&color=1f1f1f`}}
                    />
                    <div>
                        <p className="text-base font-semibold text-[#ffffcc]">{creatorName}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={onShowProfile} className="text-[#ffffcc] hover:text-[#ffcc00]">
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Message List Area */}
            <div className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#990033] scrollbar-track-[#1f1f1f]">
                {messages.map(msg => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        onSetReply={handleSetReply}         // Pass reply handler
                        onAddReaction={handleAddReaction}   // Pass reaction handler
                    />
                ))}
                <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
            </div>

            {/* Input Area */}
            <div className="border-t border-[#990033]/50 p-4 flex-shrink-0">
                {/* Reply Preview (Animated) */}
                <AnimatePresence>
                    {messageToPreview && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: '0.5rem' }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <ReplyPreviewDisplay
                                message={messageToPreview}
                                onCancelReply={cancelReply}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Write a message..."
                        className="flex-1 rounded-lg bg-[#2a2a2a] px-4 py-2 text-sm text-[#ffffcc] placeholder-[#ffffcc]/60 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    />
                    <button
                        type="submit"
                        className="rounded-full bg-[#990033] p-2 text-[#ffffcc] transition-colors hover:bg-[#660022] focus:outline-none focus:ring-2 focus:ring-[#ffcc00] disabled:opacity-50 disabled:cursor-not-allowed"
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
