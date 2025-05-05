// src/components/ChatMessage.jsx (Updated with ReplyPreviewInternal implementation)
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Reply, SmilePlus } from 'lucide-react';
import ReactionPalette from './ReactionPalette';

const ChatMessage = ({ message, onSetReply, onAddReaction }) => {
    const { id, text, isSender, type, replyingTo, userReaction } = message;
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const paletteRef = useRef(null);

    // --- Internal component to display the reply context INSIDE the bubble ---
    // Ensure this implementation exists and uses the 'repliedTo' prop
    const ReplyPreviewInternal = ({ repliedTo }) => {
        if (!repliedTo) return null; // Should not happen if called correctly, but good practice

        // Use senderName and textSnippet from the repliedTo object
        const { senderName, textSnippet } = repliedTo;

        return (
            // Simple styling: slightly transparent background, border, padding
            <div className={`mb-1.5 rounded border-l-2 px-2 py-1 border-[#ffffcc]/40 bg-[#000000]/10`}>
                <p className="text-xs font-semibold text-[#ffffcc]/80">{senderName}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-[#ffffcc]/70">{textSnippet}</p>
            </div>
        );
    };
    // --- End Internal Component ---

    const messageVariants = { /* ... */ };
    if (type === 'locked_media') { /* ... */ }

    // --- Close palette on outside click ---
    useEffect(() => {
        function handleClickOutside(event) {
            if (paletteRef.current && !paletteRef.current.contains(event.target)) {
                setIsPickerOpen(false);
            }
        }
        if (isPickerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isPickerOpen, paletteRef]);

    // Toggle picker visibility
    const handleTogglePicker = (e) => {
        e.stopPropagation();
        setIsPickerOpen(prev => !prev);
    };

    // Handle selection from palette
    const handleSelectReaction = (emoji) => {
        // Only allow reacting to non-sender messages from palette
        if (!isSender) {
            onAddReaction(id, emoji); // Handler from ChatView toggles correctly
        }
        setIsPickerOpen(false); // Close picker
    };

    return (
        <motion.div
            variants={messageVariants} initial="hidden" animate="visible"
            className={`relative flex ${isSender ? 'justify-end' : 'justify-start'} mb-1`}
        >
            <div className={`relative flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
                {/* Message Bubble */}
                <div className={`relative max-w-xs rounded-lg px-3 pt-2 pb-2 mb-4 lg:max-w-md shadow-md ${ isSender ? 'bg-[#990033] text-[#ffffcc]' : 'bg-[#3d3d3d] text-[#ffffcc]' }`} >
                    {/* THIS LINE RENDERS THE REPLY PREVIEW INSIDE THE BUBBLE */}
                    {/* It uses the 'replyingTo' data from the message object */}
                    {replyingTo && <ReplyPreviewInternal repliedTo={replyingTo} />}

                    <p className="text-sm break-words">{text}</p>

                    {/* --- Action Buttons Container (Only for RECEIVED messages) --- */}
                    {!type && !isSender && (
                        <div className="absolute -bottom-2 -right-14 z-10 flex gap-1">
                            {/* Reaction Trigger/Display Button */}
                            <button
                                onClick={handleTogglePicker}
                                className={`flex items-center justify-center rounded-full bg-[#2a2a2a] p-1.5 text-[#ffffcc]/80 shadow-md transition-colors duration-150 hover:text-[#ffffcc] hover:bg-[#4a4a4a] focus:outline-none focus:ring-1 focus:ring-[#ffcc00] min-w-[28px] min-h-[28px]`}
                                aria-label={userReaction ? `Change reaction: ${userReaction}` : "Add reaction"}
                            >
                                {userReaction ? (
                                    <span className="text-sm">{userReaction}</span>
                                ) : (
                                    <SmilePlus size={15} />
                                )}
                            </button>
                            {/* Reply Button */}
                            <button
                                onClick={() => onSetReply(id)}
                                className={`flex items-center justify-center rounded-full bg-[#2a2a2a] p-1.5 text-[#ffffcc]/80 shadow-md transition-colors duration-150 hover:text-[#ffffcc] hover:bg-[#4a4a4a] focus:outline-none focus:ring-1 focus:ring-[#ffcc00] min-w-[28px] min-h-[28px]`}
                                aria-label="Reply to message"
                            >
                                <Reply size={14} />
                            </button>
                        </div>
                    )}
                    {/* --- End Action Buttons Container --- */}
                </div>

                {/* --- Reaction Palette (Only for RECEIVED messages) --- */}
                <div className="relative w-0 h-0"> {/* Helper for positioning */}
                    <AnimatePresence>
                        {isPickerOpen && !isSender && (
                            <div
                                ref={paletteRef}
                                className="absolute bottom-[-38px] right-[-16px] z-30" // Adjusted position relative to action buttons
                            >
                                <ReactionPalette
                                    onSelectEmoji={handleSelectReaction}
                                    onClose={() => setIsPickerOpen(false)}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
