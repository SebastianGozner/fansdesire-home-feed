// src/components/ChatView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Menu, Image as ImageIcon, Video as VideoIcon, Camera, PlayCircle } from 'lucide-react'; // Ensure all needed icons are imported
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage'; // Component for rendering individual messages
import ReplyPreviewDisplay from './ReplyPreviewDisplay'; // Component for showing reply context above input
import MediaViewerModal from './MediaViewerModal'; // Component for displaying media fullscreen

// --- Mock Data & Details ---
// NOTE: Replace with your actual data fetching logic
// Message object structure: id, text, timestamp, isSender, senderName,
// replyingTo (null | object), userReaction (null | string),
// type ('text' | 'image' | 'video' | 'view_once_image' | 'view_once_video'),
// mediaUrl (string | null)
const initialMockMessages = {
    1: [
        { id: 'm1', type: 'text', text: "Hey there! How's the yoga routine going?", timestamp: '11:40 PM', isSender: true, senderName: 'You', replyingTo: null, userReaction: null, mediaUrl: null },
        { id: 'm2', type: 'text', text: "It's great! Feeling really energized.", timestamp: '11:42 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: '❤️', mediaUrl: null },
        { id: 'm3', type: 'text', text: "Just finished a session.", timestamp: '11:43 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null, mediaUrl: null },
        { id: 'img1', type: 'image', text: null, /* Text can be null or caption */ timestamp: '11:44 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null, mediaUrl: '/discover/profile-2.png' },
        { id: 'm4', type: 'text', text: "I'm all warmed up, do you like what you see?", timestamp: '11:45 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null, mediaUrl: null },
        { id: 'vid1', type: 'video', text: 'Check this out!', /* Optional caption */ timestamp: '11:46 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null, mediaUrl: '/discover/profile-2.mp4' }, // Replace with a real small video URL if possible
        { id: 'vo_img1', type: 'view_once_image', text: "📷 Photo", timestamp: '11:47 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null, mediaUrl: '/discover/profile-1.png' }, // Actual media URL for modal
        { id: 'vo_vid1', type: 'view_once_video', text: "▶️ Video", timestamp: '11:48 PM', isSender: false, senderName: 'Rebecca Green', replyingTo: null, userReaction: null, mediaUrl: '/discover/profile-1.mp4' }, // Actual media URL for modal
    ],
    2: [
        { id: 'jd1', type: 'text', text: "Project update?", timestamp: '10:05 AM', isSender: true, senderName: 'You', replyingTo: null, userReaction: null, mediaUrl: null },
        { id: 'jd2', type: 'text', text: "Almost done, sending it over soon.", timestamp: '10:06 AM', isSender: false, senderName: 'John Doe', replyingTo: null, userReaction: null, mediaUrl: null },
    ],
    3: [
        { id: 'as1', type: 'text', text: "Lunch tomorrow?", timestamp: 'Yesterday', isSender: false, senderName: 'Alice Smith', replyingTo: null, userReaction: null, mediaUrl: null },
        { id: 'as2', type: 'text', text: "Sounds good!", timestamp: 'Yesterday', isSender: true, senderName: 'You', replyingTo: null, userReaction: null, mediaUrl: null },
    ]
};

const getConversationDetails = (id) => {
    // NOTE: Replace with your actual data fetching logic
    const MOCK_CONVOS = [
        { id: 1, name: 'Rebecca Green', avatarUrl: '/profile/avatar.jpg' }, // Use actual paths or placeholders
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
    const [isModalOpen, setIsModalOpen] = useState(false); // Is the media viewer modal open?
    const [modalMediaUrl, setModalMediaUrl] = useState(null); // URL for the media in the modal
    const [modalMediaType, setModalMediaType] = useState(null); // Type ('image', 'video', etc.) for modal content
    const [viewedMessageIds, setViewedMessageIds] = useState(new Set()); // Tracks IDs of 'view-once' messages that have been opened

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
        setViewedMessageIds(new Set()); // Reset view-once status when switching chats

        const initialData = (initialMockMessages[conversationId] || []).map(msg => ({
            ...msg,
            // Ensure required fields exist with default values
            type: msg.type || 'text', // Default to 'text' if type is missing
            userReaction: msg.userReaction || null,
            replyingTo: msg.replyingTo || null,
            senderName: msg.senderName || (msg.isSender ? 'You' : creatorName),
            mediaUrl: msg.mediaUrl || null,
        }));
        setMessages(initialData);
        setMessageText('');
        setReplyingToId(null); // Reset reply state
        setIsModalOpen(false); // Ensure modal is closed
    }, [conversationId, creatorName]); // Depend on conversationId and derived creatorName

    // Effect to scroll messages into view when new messages are added
    useEffect(() => {
        // Add a small delay to allow the DOM to update, especially for new messages adjusting layout
        const timer = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50); // 50ms delay, adjust if needed
        return () => clearTimeout(timer); // Cleanup timer on unmount or before next run
    }, [messages]); // Run whenever messages array changes

    // --- Helper Functions ---
    // Find a message in the current state by its ID
    const findMessageById = (id) => messages.find(msg => msg.id === id);

    // --- Event Handlers ---
    // Set the message ID to reply to (UPDATED: removed view-once check)
    const handleSetReply = (messageId) => {
        const messageToReply = findMessageById(messageId);
        // Allow replying to any non-sender message, regardless of view-once status
        if (messageToReply && !messageToReply.isSender) {
            setReplyingToId(messageId);
            inputRef.current?.focus(); // Focus the input field
        } else if (messageToReply && messageToReply.isSender) {
            console.warn("Attempted to reply to own message.");
        } else {
            console.warn("Attempted to reply to invalid message ID.");
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
                // Use placeholder text for media replies, or actual text if available
                let snippet = originalMessage.text || `Media (${originalMessage.type})`;
                snippet = snippet.substring(0, 70) + (snippet.length > 70 ? '...' : '');

                replyContext = {
                    messageId: originalMessage.id,
                    senderName: originalSender,
                    textSnippet: snippet
                };
            }
        }

        // Create the new message object for the user
        const userMessage = {
            id: `user-${Date.now()}`,
            type: 'text', // User messages are currently text only
            text: trimmedText,
            isSender: true,
            senderName: 'You', // User is always 'You'
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyingTo: replyContext, // Attach reply context (or null)
            userReaction: null,       // Initialize reaction field
            mediaUrl: null,
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
                type: 'text',
                text: defaultResponse,
                isSender: false,
                senderName: creatorName,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                replyingTo: null, // Auto-response is not a reply
                userReaction: null, // Initialize reaction field
                mediaUrl: null,
            };
            setMessages(prev => [...prev, creatorResponse]);
        }, 1500); // 1.5 second delay
    };

    // Handle adding or toggling a reaction on a message (UPDATED: removed view-once check)
    const handleAddReaction = (messageId, emoji) => {
        setMessages(currentMessages =>
            currentMessages.map(msg => {
                if (msg.id === messageId) {
                    // Can only react to creator messages
                    if (msg.isSender) {
                        console.warn("Cannot react to own messages.");
                        return msg;
                    }
                    // Allow reacting regardless of view-once status

                    // Toggle: if same emoji clicked again, remove reaction (null), else set new emoji
                    const newReaction = msg.userReaction === emoji ? null : emoji;
                    return { ...msg, userReaction: newReaction };
                }
                return msg; // Return unchanged message if ID doesn't match
            })
        );
    };

    // Handle clicks on media elements within ChatMessage
    const handleOpenMedia = (message) => {
        const { id, mediaUrl, type } = message;
        const isViewOnce = type === 'view_once_image' || type === 'view_once_video';

        // If it's view-once and *has already been viewed*, still allow opening, but don't re-mark.
        // If it's view-once and *is being viewed now for the first time*, mark it.
        if (isViewOnce && !viewedMessageIds.has(id)) {
            setViewedMessageIds(prev => new Set(prev).add(id)); // Mark as viewed *before* opening
        }

        // If it's a valid media type with a URL, proceed to open
        if (mediaUrl && (type === 'image' || type === 'video' || isViewOnce)) {
            setModalMediaUrl(mediaUrl);
            setModalMediaType(type); // Pass the correct type
            setIsModalOpen(true);
        } else {
            console.warn("Cannot open media: Invalid type or missing URL", message);
        }
    };

    // Close the media viewer modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Delay clearing URL slightly to allow fade-out animation
        setTimeout(() => {
            setModalMediaUrl(null);
            setModalMediaType(null);
        }, 300); // Match animation duration if modal has one
    };

    // --- Prepare Data for Rendering ---
    // Get the full message object to show in the reply preview area
    const messageToPreview = replyingToId ? findMessageById(replyingToId) : null;

    // --- Render Component ---
    return (
        // Using relative position allows absolute positioning for modal if needed, though modal uses fixed.
        <div className="relative flex h-full flex-col bg-[#1f1f1f]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#990033]/50 p-3 flex-shrink-0">
                <div className="flex items-center space-x-3">
                    {/* Back button for mobile */}
                    {onBack && (
                        <button onClick={onBack} className="text-[#ffffcc] hover:text-[#ffcc00] lg:hidden">
                            <ChevronLeft size={24} />
                        </button>
                    )}
                    {/* Avatar */}
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={conversationDetails?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=ffcc00&color=1f1f1f`}
                        alt={`${creatorName}'s avatar`}
                        onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=ffcc00&color=1f1f1f`}}
                    />
                    {/* Name */}
                    <div>
                        <p className="text-base font-semibold text-[#ffffcc]">{creatorName}</p>
                        {/* Optional: Add status indicator here */}
                    </div>
                </div>
                {/* Profile Button */}
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
                        onSetReply={handleSetReply}         // Pass updated reply handler
                        onAddReaction={handleAddReaction}   // Pass updated reaction handler
                        onOpenMedia={handleOpenMedia}       // Pass media opener handler
                        isViewed={viewedMessageIds.has(msg.id)} // Pass viewed status for view-once messages
                    />
                ))}
                {/* Anchor for scrolling */}
                <div ref={messagesEndRef} />
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
                        disabled={messageText.trim() === ''} // Disable if input is empty
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>

            {/* Media Viewer Modal (Rendered conditionally) */}
            <MediaViewerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                mediaUrl={modalMediaUrl}
                mediaType={modalMediaType}
            />
        </div>
    );
};

export default ChatView;
