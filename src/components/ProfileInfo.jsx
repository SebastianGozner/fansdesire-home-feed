// src/components/ProfileInfo.jsx (Updated with Dark Gray BG and Enhanced Contrast)
import React from 'react';
import {
    ChevronLeft, ChevronRight, Info, User, Activity, Languages, Heart, Briefcase, Smile, ToyBrick, MapPin // Ensure all needed icons are imported
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Profile Data (Replace with your actual data fetching) ---
// Mock data remains structurally the same
const mockProfileData = {
    1: { /* Rebecca Green data */
        name: 'Rebecca Green', images: ['/profile/avatar.jpg', '/2.webp','/3.webp',], bio: 'Active Yoga and fitness coach, healthy and concerned about others.', details: {'Age': '51', 'Body': 'Athletic', 'Language': 'English', 'Relationship': 'N/A', 'Occupation': 'Yoga & Fitness Coach', 'Hobbies': 'Yoga, Fitness, Nature', 'Personality': 'Energetic and joyful',},
    },
    2: { /* John Doe data */
        name: 'John Doe', images: [`https://ui-avatars.com/api/?name=John+Doe&background=ffcc00&color=1f1f1f&size=256`], bio: 'Software developer focused on frontend technologies.', details: {'Age': '35', 'Body': 'Average', 'Language': 'English, Spanish', 'Relationship': 'Single', 'Occupation': 'Developer', 'Hobbies': 'Coding, Hiking', 'Personality': 'Analytical, Quiet', 'Location': 'New York',}
    },
    3: { /* Alice Smith data */
        name: 'Alice Smith', images: ['/placeholder-avatar-2.jpg'], bio: 'Project manager with a passion for organization.', details: {'Age': '42', 'Body': 'Fit', 'Language': 'English', 'Relationship': 'Married', 'Occupation': 'Project Manager', 'Hobbies': 'Reading, Planning', 'Personality': 'Organized, Leader', 'Experience': '5+ Years', 'Skills': 'Agile, Scrum',}
    }
};
// --- End Mock Data ---

// Helper to get icon based on detail key (Still using Cream for icons)
const getDetailIcon = (key) => {
    const iconColor = "text-[#ffffcc]"; // Base Cream for icons
    const iconSize = 18;
    // ... (switch statement remains the same as before)
    switch (key.toLowerCase()) {
        case 'age': return <User size={iconSize} className={iconColor} />;
        case 'body': return <Activity size={iconSize} className={iconColor} />;
        case 'language': return <Languages size={iconSize} className={iconColor} />;
        case 'relationship': return <Heart size={iconSize} className={iconColor} />;
        case 'occupation': return <Briefcase size={iconSize} className={iconColor} />;
        case 'hobbies': return <ToyBrick size={iconSize} className={iconColor} />;
        case 'personality': return <Smile size={iconSize} className={iconColor} />;
        case 'location': return <MapPin size={iconSize} className={iconColor} />;
        default: return <Info size={iconSize} className={iconColor} />;
    }
};


const ProfileInfo = ({ conversationId, onBack }) => {
    const profile = mockProfileData[conversationId];
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [imageDirection, setImageDirection] = React.useState(1);

    if (!profile) {
        // Fallback view with Dark Gray BG
        return (
            <div className="relative flex h-full flex-col items-center justify-center bg-[#1f1f1f] p-4 text-[#ffffcc]"> {/* Changed BG */}
                {onBack && (
                    <button
                        onClick={onBack}
                        // Mobile back: Dark Gray BG (semi-transparent), Cream icon
                        className="absolute top-4 left-4 z-10 p-1 bg-[#1f1f1f]/70 rounded-full text-[#ffffcc] hover:bg-[#1f1f1f]/90 lg:hidden" // Adjusted BG
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                Profile not available.
            </div>
        );
    }

    // --- Image Navigation and Animation ---
    const changeImage = (newDirection) => {
        setImageDirection(newDirection);
        let newIndex = (currentImageIndex + newDirection + profile.images.length) % profile.images.length;
        setCurrentImageIndex(newIndex);
    };
    const imageVariants = { /* ... (variants remain the same) ... */ };
    // --- End Image Navigation ---

    return (
        // Main container: Dark Gray BG, Cream default text, Burgundy scrollbar thumb on Dark Gray track
        <div className="flex h-full flex-col bg-[#1f1f1f] text-[#ffffcc] overflow-y-auto scrollbar-thin scrollbar-thumb-[#990033] scrollbar-track-[#1f1f1f]"> {/* Updated BG and scrollbar track */}
            {/* Mobile Back Button: Positioned over image */}
            {onBack && (
                <button
                    onClick={onBack}
                    // Dark Gray BG (semi-transparent), Cream icon
                    className="absolute top-4 left-4 z-20 p-1 bg-[#1f1f1f]/70 rounded-full text-[#ffffcc] hover:bg-[#1f1f1f]/90 lg:hidden" // Adjusted BG
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Image Section */}
            <div className="relative flex-shrink-0 overflow-hidden">
                <AnimatePresence initial={false} custom={imageDirection}>
                    <motion.img
                        key={currentImageIndex}
                        src={profile.images[currentImageIndex]}
                        alt={`${profile.name}'s profile picture ${currentImageIndex + 1}`}
                        className="aspect-[3/4] w-full object-cover"
                        // Fallback uses Gold BG and new Dark Gray text
                        onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=ffcc00&color=1f1f1f&size=256`}} // Updated text color
                        custom={imageDirection}
                        variants={imageVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                    />
                </AnimatePresence>

                {/* Image Navigation Arrows: Burgundy BG, Cream icon, Gold focus ring */}
                {profile.images.length > 1 && (
                    <>
                        <button
                            onClick={() => changeImage(-1)}
                            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#990033]/80 p-2 text-[#ffffcc] transition-colors duration-150 hover:bg-[#990033] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" // Focus uses Base Gold
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => changeImage(1)}
                            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#990033]/80 p-2 text-[#ffffcc] transition-colors duration-150 hover:bg-[#990033] focus:outline-none focus:ring-2 focus:ring-[#ffcc00]" // Focus uses Base Gold
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col p-4 space-y-4">
                {/* Name and Bio */}
                <div>
                    {/* Name: Base Cream */}
                    <h2 className="text-xl font-semibold text-[#ffffcc]">{profile.name}</h2>
                    {/* Bio: Dimmer Cream */}
                    <p className="mt-1 text-sm text-[#ffffcc]/80">{profile.bio}</p>
                </div>

                {/* "About me" Section */}
                {profile.details && Object.keys(profile.details).length > 0 && (
                    <div>
                        {/* Section Title: Base Gold */}
                        <h3 className="text-base font-semibold text-[#ffcc00] mb-3">About me:</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                            {Object.entries(profile.details).map(([key, value]) => (
                                key.toLowerCase() === 'ethnicity' ? null : ( // Still skipping ethnicity
                                    <div key={key} className="flex items-start space-x-3">
                                        {/* Icon Container: Low-opacity Burgundy BG */}
                                        <div className="mt-1 flex-shrink-0 rounded-full bg-[#990033]/30 p-2">
                                            {/* Icon: Base Cream color */}
                                            {getDetailIcon(key)}
                                        </div>
                                        {/* Text Details */}
                                        <div>
                                            {/* Label: Darker Gold color for better contrast, uppercase */}
                                            <p className="text-xs uppercase text-[#cca300] tracking-wide">{key}</p>
                                            {/* Value: Base Cream color */}
                                            <p className="text-[#ffffcc] font-medium">{value}</p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileInfo;
