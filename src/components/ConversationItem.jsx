// src/components/ConversationItem.jsx (Updated with New Colors)
import React from 'react';
import { motion } from 'framer-motion';

const ConversationItem = ({ conversation, onClick, isSelected }) => {
    const { id, name, avatarUrl, lastMessage, timestamp } = conversation;

    return (
        <motion.button
            onClick={() => onClick(id)}
            // Base Style: Transparent BG on Dark Gray List BG
            // Hover Style: Slightly darker gray, semi-transparent
            className={`relative flex w-full items-center space-x-3 p-3 text-left rounded-lg focus:outline-none transition-colors duration-150 hover:bg-[#2a2a2a]/60`} // Adjusted hover BG
            whileTap={{ scale: 0.98 }}
        >
            {/* Animated Background for Selection: Burgundy BG */}
            {isSelected && (
                <motion.div
                    layoutId="selected-conversation-bg" // Keep layoutId consistent
                    className="absolute inset-0 rounded-lg bg-[#990033] z-0" // Burgundy selected BG
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            )}

            {/* Content Wrapper: Positioned above background */}
            <div className="relative z-10 flex w-full items-center space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        className="h-10 w-10 rounded-full object-cover"
                        // Fallback uses Gold BG, Dark Gray text
                        src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffcc00&color=1f1f1f`} // Updated fallback colors
                        alt={`${name}'s avatar`}
                        onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffcc00&color=1f1f1f`}}
                    />
                </div>

                {/* Text Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                        {/* Name: Cream default, White selected for contrast on Burgundy */}
                        <p className={`truncate text-sm font-medium ${isSelected ? 'text-[#ffffff]' : 'text-[#ffffcc]'}`}>{name}</p>
                        {/* Timestamp: Dim Cream default, Lighter Cream selected */}
                        <p className={`flex-shrink-0 text-xs ${isSelected ? 'text-[#ffffcc]/80' : 'text-[#ffffcc]/60'}`}>{timestamp}</p>
                    </div>
                    {/* Last Message: Dimmer Cream default, Lighter Cream selected */}
                    <p className={`truncate text-sm ${isSelected ? 'text-[#ffffcc]/90' : 'text-[#ffffcc]/70'}`}>{lastMessage}</p>
                </div>
            </div>
        </motion.button>
    );
};

export default ConversationItem;
