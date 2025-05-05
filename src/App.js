// src/App.js (Updated with New Color Scheme)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the already updated components
import ConversationList from './components/ConversationList';
import ChatView from './components/ChatView';
import ProfileInfo from './components/ProfileInfo';

function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // lg breakpoint
    const [activePanelMobile, setActivePanelMobile] = useState('list');
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [showProfilePanel, setShowProfilePanel] = useState(true); // Desktop visibility
    const [animationDirection, setAnimationDirection] = useState(1);

    // --- Effect for Handling Resize ---
    useEffect(() => {
        const handleResize = () => {
            const mobileCheck = window.innerWidth < 1024;
            setIsMobile(mobileCheck);
            if (!mobileCheck) {
                setShowProfilePanel(true);
                setActivePanelMobile('list');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // --- Handlers ---
    const handleSelectConversation = (id) => {
        setSelectedConversationId(id);
        if (isMobile) {
            setAnimationDirection(1);
            setActivePanelMobile('chat');
        }
        console.log("Selected Conversation ID:", id);
    };

    const handleBackToList = () => {
        setAnimationDirection(-1);
        setActivePanelMobile('list');
    }
    const handleShowChat = () => {
        setAnimationDirection(-1);
        setActivePanelMobile('chat');
    }
    const handleShowProfile = () => {
        if (isMobile) {
            setAnimationDirection(1);
            setActivePanelMobile('profile');
        } else {
            setShowProfilePanel(prev => !prev);
        }
    };

    // --- Animation Variants (remain the same) ---
    const panelVariants = {
        initial: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
        animate: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
        exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%', opacity: 0, transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } }),
    };

    // --- Render Logic ---
    return (
        // Outermost container: Updated BG to Dark Gray, default text to Cream
        <div className="flex h-screen w-screen overflow-hidden bg-[#1f1f1f] text-[#ffffcc] font-sans">

            {/* --- Desktop Layout --- */}
            {!isMobile && (
                <div className={`flex h-full w-full`}>
                    {/* Left Panel: Add subtle Burgundy border */}
                    <motion.div
                        layout
                        transition={{ duration: 0.3 }}
                        // Use a subtle Burgundy border
                        className="w-1/4 max-w-xs flex-shrink-0 border-r border-[#990033]/30" // Adjusted border color
                    >
                        <ConversationList
                            onSelectConversation={handleSelectConversation}
                            selectedConversationId={selectedConversationId}
                        />
                    </motion.div>

                    {/* Middle Panel */}
                    <div className="flex-1 relative overflow-hidden">
                        {selectedConversationId ? (
                            <motion.div
                                key={selectedConversationId}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="h-full w-full"
                            >
                                <ChatView
                                    conversationId={selectedConversationId}
                                    onBack={null}
                                    onShowProfile={handleShowProfile}
                                />
                            </motion.div>
                        ) : (
                            // Placeholder text: Use Dim Cream color, adjust border
                            <div className="flex h-full items-center justify-center text-[#ffffcc]/70 p-4 border-r border-[#990033]/30"> {/* Adjusted text color & border */}
                                Select a conversation to start chatting.
                            </div>
                        )}
                    </div>

                    {/* Right Panel */}
                    <AnimatePresence initial={false}>
                        {showProfilePanel && (
                            <motion.div
                                layout
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                                // Use a subtle Burgundy border
                                className="w-1/4 max-w-xs flex-shrink-0 border-l border-[#990033]/30 flex flex-col" // Adjusted border color
                            >
                                {selectedConversationId ? (
                                    <ProfileInfo
                                        key={`profile-${selectedConversationId}`}
                                        conversationId={selectedConversationId}
                                        onBack={null}
                                    />
                                ) : (
                                    // Placeholder text: Use Dim Cream color
                                    <div className="flex h-full items-center justify-center text-[#ffffcc]/70 p-4"> {/* Adjusted text color */}
                                        Select a conversation to view profile.
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* --- Mobile Layout --- */}
            {/* Container for mobile needs no explicit color, relies on panels */}
            {isMobile && (
                <div className="relative h-full w-full overflow-hidden">
                    <AnimatePresence initial={false} custom={animationDirection}>
                        {/* Conditionally rendered panels cover the background */}
                        {activePanelMobile === 'list' && (
                            <motion.div
                                key="list" /* ... animation props ... */
                                custom={animationDirection} variants={panelVariants} initial="initial" animate="animate" exit="exit"
                                className="absolute top-0 left-0 h-full w-full"
                            >
                                <ConversationList
                                    onSelectConversation={handleSelectConversation}
                                    selectedConversationId={selectedConversationId}
                                />
                            </motion.div>
                        )}

                        {activePanelMobile === 'chat' && selectedConversationId && (
                            <motion.div
                                key="chat" /* ... animation props ... */
                                custom={animationDirection} variants={panelVariants} initial="initial" animate="animate" exit="exit"
                                className="absolute top-0 left-0 h-full w-full"
                            >
                                <ChatView
                                    key={selectedConversationId}
                                    conversationId={selectedConversationId}
                                    onBack={handleBackToList}
                                    onShowProfile={handleShowProfile}
                                />
                            </motion.div>
                        )}

                        {activePanelMobile === 'profile' && selectedConversationId && (
                            <motion.div
                                key="profile" /* ... animation props ... */
                                custom={animationDirection} variants={panelVariants} initial="initial" animate="animate" exit="exit"
                                className="absolute top-0 left-0 h-full w-full"
                            >
                                <ProfileInfo
                                    key={`profile-${selectedConversationId}`}
                                    conversationId={selectedConversationId}
                                    onBack={handleShowChat}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

export default App;
