// src/components/ReplyPreviewDisplay.jsx
import React from 'react';
import { X } from 'lucide-react';

const ReplyPreviewDisplay = ({ message, onCancelReply }) => {
    if (!message) return null;

    // Determine sender name - ensure message object has senderName or isSender
    const senderName = message.isSender ? 'You' : message.senderName || 'Them';

    return (
        // Preview container: Darker Gray BG, Gold left border
        <div className="relative mb-2 rounded-t-lg border-l-4 border-[#ffcc00] bg-[#2a2a2a] p-3">
            {/* Cancel Button: Dim Cream icon, darker hover */}
            <button
                onClick={onCancelReply}
                className="absolute top-1 right-1 rounded-full p-1 text-[#ffffcc]/60 hover:bg-[#3d3d3d] hover:text-[#ffffcc]"
                aria-label="Cancel reply"
            >
                <X size={16} />
            </button>
            {/* Sender Name: Gold color */}
            <p className="text-sm font-semibold text-[#ffcc00]">{senderName}</p>
            {/* Message Snippet: Dim Cream color, limited to 2 lines */}
            <p className="mt-1 line-clamp-2 text-sm text-[#ffffcc]/80">{message.text}</p>
        </div>
    );
};

export default ReplyPreviewDisplay;
