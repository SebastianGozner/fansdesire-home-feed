// src/components/ConversationList.jsx (Updated with New Colors)
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ConversationItem from './ConversationItem'; // Adjust path if needed

// --- Mock Data (Replace with your actual data fetching) ---
const mockConversations = [ /* ... same mock data ... */
    { id: 1, name: 'Rebecca Green', avatarUrl: '/profile/avatar.jpg', lastMessage: "I'm all warmed up, do you like what you see?", timestamp: '11:45 PM', }, { id: 2, name: 'John Doe', avatarUrl: null, lastMessage: 'Okay, sounds good!', timestamp: '10:30 AM', }, { id: 3, name: 'Alice Smith', avatarUrl: '/placeholder-avatar-2.jpg', lastMessage: 'See you tomorrow!', timestamp: 'Yesterday', },
];
// --- End Mock Data ---


const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConversations = mockConversations.filter(convo =>
        convo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        // Main container: Dark Gray BG
        <div className="flex h-full flex-col bg-[#1f1f1f]">
            {/* Header: Dark Gray BG, Burgundy bottom border, Cream text */}
            <div className="p-4 border-b border-[#990033]/50 flex-shrink-0">
                <h1 className="text-xl font-semibold text-[#ffffcc]">Chat</h1>
            </div>

            {/* Search Bar: Dark Gray BG */}
            <div className="p-4 flex-shrink-0">
                <div className="relative">
                    {/* Input: Darker Gray BG, Cream text, Gold focus */}
                    <input
                        type="text"
                        placeholder="Search for a profile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg bg-[#2a2a2a] py-2 pl-10 pr-4 text-sm text-[#ffffcc] placeholder-[#ffffcc]/60 focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" // Adjusted BG, Text, Placeholder, Focus
                    />
                    {/* Search Icon: Dim Cream color */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-[#ffffcc]/60" />
                    </div>
                </div>
            </div>

            {/* Conversation List Items: Dark Gray BG, themed scrollbar */}
            <div className="flex-1 space-y-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#990033] scrollbar-track-[#1f1f1f]"> {/* Updated scrollbar track */}
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(convo => (
                        <ConversationItem
                            key={convo.id}
                            conversation={convo}
                            onClick={onSelectConversation}
                            isSelected={convo.id === selectedConversationId}
                        />
                    ))
                ) : (
                    // Fallback text: Dim Cream color
                    <p className="p-4 text-center text-sm text-[#ffffcc]/70">No conversations found.</p>
                )}
            </div>
        </div>
    );
};

export default ConversationList;
