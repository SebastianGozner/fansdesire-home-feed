// src/components/ChatMessage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import necessary icons from lucide-react
import { Reply, SmilePlus, Image as ImageIcon, Video as VideoIcon, Camera, PlayCircle, AlertCircle } from 'lucide-react';
import ReactionPalette from './ReactionPalette'; // Component for selecting emoji reactions

// Define the ChatMessage component
const ChatMessage = ({
                         message,          // The message object containing all details
                         onSetReply,       // Function called when the reply button is clicked (passes message.id)
                         onAddReaction,    // Function called when a reaction is selected (passes message.id, emoji)
                         onOpenMedia,      // Function called when a media element (img/video/view-once) is clicked (passes message object)
                         isViewed          // Boolean indicating if a view-once message has been opened (passed from ChatView)
                     }) => {
    // Destructure message object with defaults
    const {
        id,
        text,
        isSender,
        type = 'text', // Default message type to 'text' if not specified
        replyingTo,    // Object containing details of the message being replied to (or null)
        userReaction,  // The emoji reaction string applied by the current user (or null)
        mediaUrl,      // URL of the media content (for image/video types)
        senderName     // Name of the message sender (used in reply preview)
    } = message;

    // State for controlling the visibility of the reaction emoji picker
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    // Ref for the reaction picker palette to detect outside clicks
    const paletteRef = useRef(null);

    // Effect to handle closing the reaction picker when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event) {
            if (paletteRef.current && !paletteRef.current.contains(event.target)) {
                setIsPickerOpen(false);
            }
        }
        if (isPickerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isPickerOpen]);

    // --- Sub-component for rendering the preview of a replied-to message ---
    const ReplyPreviewInternal = ({ repliedTo }) => {
        if (!repliedTo || !repliedTo.senderName || !repliedTo.textSnippet) {
            console.warn("ReplyPreviewInternal received incomplete data:", repliedTo);
            return null;
        }
        const { senderName, textSnippet } = repliedTo;
        return (
            <div className={`mb-1.5 rounded border-l-2 px-2 py-1 border-[#ffffcc]/40 bg-[#000000]/10`}>
                <p className="text-xs font-semibold text-[#ffffcc]/80">{senderName}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[#ffffcc]/70">{textSnippet}</p>
            </div>
        );
    };

    // --- Framer Motion variants for message appearance animation ---
    const messageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    // --- Event Handlers ---
    const handleTogglePicker = (e) => {
        e.stopPropagation();
        setIsPickerOpen(prev => !prev);
    };

    const handleSelectReaction = (emoji) => {
        if (!isSender) {
            onAddReaction(id, emoji);
        }
        setIsPickerOpen(false);
    };

    const handleMediaClick = () => {
        const isViewOnce = type === 'view_once_image' || type === 'view_once_video';
        if (isViewOnce && isViewed) {
            console.log("Already viewed this message (opening again).");
            // Allow re-opening if desired, or keep the return here to prevent re-opening
            // return; // Uncomment this line to prevent re-opening viewed messages
        }
        if (mediaUrl && onOpenMedia) {
            onOpenMedia(message);
        }
    };

    // --- Content Rendering Logic ---
    const renderContent = () => {
        switch (type) {
            case 'image':
                return (
                    <div className="relative cursor-pointer group/media" onClick={handleMediaClick}>
                        <img
                            src={mediaUrl}
                            alt={text || 'Sent image'}
                            className="block max-w-full h-auto rounded-md object-cover"
                            style={{ maxHeight: '300px' }}
                            loading="lazy"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling?.classList.remove('hidden'); }}
                        />
                        <div className="hidden items-center justify-center bg-gray-700/50 p-4 rounded-md text-xs text-red-400">
                            <AlertCircle size={16} className="mr-1" /> Image failed to load.
                        </div>
                        {text && <p className="mt-1 px-1 pb-1 text-sm break-words">{text}</p>}
                    </div>
                );
            case 'video':
                return (
                    <div className="relative cursor-pointer group/media" onClick={handleMediaClick}>
                        <div className="relative bg-[#4a4a4a] rounded-md overflow-hidden flex items-center justify-center aspect-video max-h-[300px]">
                            <VideoIcon size={48} className="text-[#ffffcc]/50 opacity-70" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity group-hover/media:opacity-100 opacity-80">
                                <PlayCircle size={48} className="text-white/80 group-hover/media:text-white transition-colors" />
                            </div>
                        </div>
                        {text && <p className="mt-1 px-1 pb-1 text-sm break-words">{text}</p>}
                    </div>
                );
            case 'view_once_image':
                return (
                    <div
                        className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${isViewed ? 'opacity-70' : ''} cursor-pointer hover:bg-[#5a5a5a]`} // Keep hover effect, adjust opacity when viewed
                        onClick={handleMediaClick}
                        // No aria-disabled as it's always clickable now
                    >
                        <Camera size={20} />
                        <span className="text-sm font-medium">{isViewed ? "Photo (Viewed)" : "Photo"}</span> {/* Indicate viewed status */}
                    </div>
                );
            case 'view_once_video':
                return (
                    <div
                        className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${isViewed ? 'opacity-70' : ''} cursor-pointer hover:bg-[#5a5a5a]`} // Keep hover effect, adjust opacity when viewed
                        onClick={handleMediaClick}
                        // No aria-disabled as it's always clickable now
                    >
                        <PlayCircle size={20} />
                        <span className="text-sm font-medium">{isViewed ? "Video (Viewed)" : "Video"}</span> {/* Indicate viewed status */}
                    </div>
                );
            case 'text':
            default:
                return <p className="text-sm break-words">{text}</p>;
        }
    };

    // --- Dynamic Styling ---
    let bgColor = isSender ? 'bg-[#990033]' : 'bg-[#3d3d3d]';
    let textColor = 'text-[#ffffcc]';
    const isMedia = ['image', 'video'].includes(type);
    const isViewOncePlaceholder = ['view_once_image', 'view_once_video'].includes(type);
    let padding = isMedia ? 'p-1' : 'px-3 pt-2 pb-2';
    if (isViewOncePlaceholder) {
        padding = 'p-0';
    }
    if (type === 'text' && replyingTo) {
        padding = 'px-3 pt-1 pb-2';
    }

    // Add bottom margin to the bubble *only if it's a received message* to make space for buttons
    const bubbleMarginBottom = !isSender ? 'mb-4' : 'mb-1'; // Increased margin for received messages

    // --- Render Component ---
    return (
        <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            // Outer container still handles alignment and base margin
            className={`relative flex ${isSender ? 'justify-end' : 'justify-start'} mb-1`}
        >
            {/* Inner container */}
            <div className={`relative flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>

                {/* The main message bubble */}
                {/* Apply calculated bottom margin here */}
                <div className={`relative max-w-xs rounded-lg ${padding} ${bubbleMarginBottom} lg:max-w-md shadow-md ${bgColor} ${textColor}`} >
                    {replyingTo && <ReplyPreviewInternal repliedTo={replyingTo} />}
                    {renderContent()}
                </div>

                {/* Action Buttons - Conditionally render container only for non-sender */}
                {!isSender && (
                    // Position absolutely, slightly below the bubble
                    // REMOVED: opacity-0 group-hover:opacity-100 - Buttons are now always visible
                    <div className={`absolute -bottom-1 z-10 flex items-center gap-1 mb-4 ${isSender ? '-left-14' : '-right-16'} transition-opacity duration-150`}>

                        {/* Reaction Button & Palette Container */}
                        <div className="relative">
                            <button
                                onClick={handleTogglePicker}
                                className={`flex items-center justify-center rounded-full bg-[#2a2a2a] p-1.5 text-[#ffffcc]/80 shadow-md transition-colors duration-150 hover:text-[#ffffcc] hover:bg-[#4a4a4a] focus:outline-none focus:ring-1 focus:ring-[#ffcc00] min-w-[28px] min-h-[28px]`}
                                aria-label={userReaction ? `Change reaction: ${userReaction}` : "Add reaction"}
                                // REMOVED: disabled={isViewOncePlaceholder && isViewed}
                            >
                                {userReaction ? ( <span className="text-sm">{userReaction}</span> ) : ( <SmilePlus size={15} /> )}
                            </button>

                            {/* Reaction Palette (Animated) */}
                            <AnimatePresence>
                                {isPickerOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.15 }}
                                        ref={paletteRef}
                                        className="absolute bottom-full z-30 mb-14 transform -translate-x-1/2 right-[120px]"
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <ReactionPalette
                                            onSelectEmoji={handleSelectReaction}
                                            onClose={() => setIsPickerOpen(false)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Reply Button */}
                        <button
                            onClick={() => onSetReply(id)}
                            className={`flex items-center justify-center rounded-full bg-[#2a2a2a] p-1.5 text-[#ffffcc]/80 shadow-md transition-colors duration-150 hover:text-[#ffffcc] hover:bg-[#4a4a4a] focus:outline-none focus:ring-1 focus:ring-[#ffcc00] min-w-[28px] min-h-[28px]`}
                            aria-label="Reply to message"
                            // REMOVED: disabled={isViewOncePlaceholder && isViewed}
                        >
                            <Reply size={14} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChatMessage;
