// src/components/ReactionPalette.jsx
import React from 'react';
import { motion } from 'framer-motion';

const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

// Props:
// - onSelectEmoji: Function called with the chosen emoji string
// - onClose: Optional function to call to close the palette
const ReactionPalette = ({ onSelectEmoji, onClose }) => {

    // Optional: Close palette if clicking outside
    // This requires more setup (e.g., useRef and event listener in parent)
    // For simplicity, we might rely on clicking an emoji or a dedicated close button if needed

    const handleEmojiSelect = (emoji) => {
        onSelectEmoji(emoji);
        if (onClose) onClose(); // Close palette after selection
    };

    return (
        // Palette container: Darker Gray BG, rounded, padding, shadow
        <motion.div
            className="absolute z-20 mt-1 flex space-x-1 rounded-full bg-[#2a2a2a] p-1.5 shadow-lg"
            // Simple scale/fade animation
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.15 }}
        >
            {commonReactions.map(emoji => (
                <motion.button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="rounded-full p-1 text-xl transition-colors duration-100 hover:bg-[#3d3d3d] focus:outline-none focus:ring-1 focus:ring-[#ffcc00]" // Gold focus ring
                    whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }} // Add hover animation
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.1 }}
                >
                    {emoji}
                </motion.button>
            ))}
        </motion.div>
    );
};

export default ReactionPalette;
