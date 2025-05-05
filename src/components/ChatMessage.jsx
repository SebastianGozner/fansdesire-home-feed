// src/components/ChatMessage.jsx (Updated with New Colors)
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react'; // Assuming Play icon for locked media

const ChatMessage = ({ message }) => {
    const { text, isSender, type } = message; // Added type for locked media

    const messageVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    // --- Locked Media Styling ---
    if (type === 'locked_media') {
        return (
            <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className="flex justify-start mb-3" // Locked media always from receiver? Adjust if needed
            >
                <div className="flex flex-col items-center justify-center bg-[#3d3d3d] rounded-lg p-6 text-center cursor-pointer hover:bg-[#4a4a4a] transition-colors w-48 h-64 my-2 shadow-md"> {/* Darker Gray BG */}
                    <div className="p-3 bg-[#1f1f1f]/50 rounded-full mb-4"> {/* Dark Gray icon BG */}
                        <Play size={24} className="text-[#ffffcc]" /> {/* Cream Icon */}
                    </div>
                    <button className="bg-[#990033] text-[#ffffcc] text-sm font-semibold py-2 px-4 rounded-lg hover:bg-[#660022] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"> {/* Burgundy Button, Cream Text, Gold Focus */}
                        {text || "Click to unlock"} {/* Use message text or default */}
                    </button>
                </div>
            </motion.div>
        );
    }

    // --- Regular Message Styling ---
    return (
        <motion.div
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}
        >
            <div
                className={`max-w-xs rounded-lg px-3 py-2 lg:max-w-md shadow-md ${
                    isSender
                        // Sender: Burgundy BG, Cream text
                        ? 'bg-[#990033] text-[#ffffcc]'
                        // Receiver: Darker Gray BG, Cream text
                        : 'bg-[#3d3d3d] text-[#ffffcc]'
                }`}
            >
                <p className="text-sm break-words">{text}</p>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
